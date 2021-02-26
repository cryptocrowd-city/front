import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  BoostModalService,
  BoostTab,
  MAXIMUM_SINGLE_BOOST_IMPRESSIONS,
  MINIMUM_BOOST_OFFER_TOKENS,
  MINIMUM_SINGLE_BOOST_IMPRESSIONS,
} from '../../boost-modal.service';

@Component({
  selector: 'm-boostModal__amountInput',
  templateUrl: './amount-input.component.html',
  styleUrls: ['./amount-input.component.ng.scss'],
})
export class BoostModalAmountInputComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];

  // max impressions.
  public maxImpressions = MAXIMUM_SINGLE_BOOST_IMPRESSIONS;

  // min impressions.
  public minImpressions = MINIMUM_SINGLE_BOOST_IMPRESSIONS;

  public minTokens = MINIMUM_BOOST_OFFER_TOKENS;

  // amount input form
  public form: FormGroup;

  constructor(private service: BoostModalService) {}

  /**
   * Gets impressions subject from service.
   * @returns { BehaviorSubject<number> } - impressions.
   */
  get impressions$(): BehaviorSubject<number> {
    return this.service.impressions$;
  }

  /**
   * Gets impressions subject from service.
   * @returns { BehaviorSubject<number> } - impressions.
   */
  get tokens$(): BehaviorSubject<number> {
    return this.service.tokens$;
  }

  /**
   * Gets rate from service.
   * @returns { BehaviorSubject<number> } - rate.
   */
  get rate$(): BehaviorSubject<number> {
    return this.service.rate$;
  }

  /**
   * Gets current boost tab from service.
   * @returns { BehaviorSubject<BoostTab> } = current boost tab.
   */
  get activeTab$(): BehaviorSubject<BoostTab> {
    return this.service.activeTab$;
  }

  ngOnInit(): void {
    // subscribe to changes in current rate and active tab
    this.subscriptions.push(
      combineLatest([this.rate$, this.activeTab$])
        .pipe(
          map(([rate, activeTab]) => {
            // setup form controls.
            this.setupFormControls(rate, activeTab);
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Sets up form controls depending on the active tab.
   * @param { number } rate - rate.
   * @param { BoostTab } activeTab - current active tab.
   * @returns { void }
   */
  setupFormControls(rate: number, activeTab: BoostTab): void {
    const defaultViews = this.maxImpressions / 2;
    const defaultTokens = defaultViews / rate;
    const minTokens = this.minImpressions / rate;

    if (activeTab === 'offer') {
      this.form = new FormGroup({
        tokens: new FormControl(defaultTokens, {
          validators: [Validators.required, Validators.min(minTokens)],
        }),
      });
      return;
    }

    // else newsfeed.
    const maxTokens = this.maxImpressions / rate; // no max on offers

    this.form = new FormGroup({
      tokens: new FormControl(defaultTokens, {
        validators: [
          Validators.required,
          Validators.max(maxTokens),
          Validators.min(minTokens),
        ],
      }),
      impressions: new FormControl(defaultViews, {
        validators: [
          Validators.required,
          Validators.max(this.maxImpressions),
          Validators.min(this.minImpressions),
        ],
      }),
    });
  }

  /**
   * On views value changed, update tokens to match based on rate.
   * @param { number } $event - views value.
   * @returns { void }
   */
  public viewsValueChanged($event: number): void {
    this.impressions$.next($event);
    this.tokens$.next($event / this.rate$.getValue());
  }

  /**
   * On tokens value changed, update impressions to match based on rate.
   * @param { number } $event - tokens value.
   * @returns { void }
   */
  public tokensValueChanged($event: number): void {
    this.tokens$.next($event);
    this.impressions$.next($event * this.rate$.getValue());
  }
}
