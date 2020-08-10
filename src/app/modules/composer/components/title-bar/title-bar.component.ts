import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
} from '@angular/core';
import {
  ACCESS,
  LICENSES,
  LicensesEntry,
} from '../../../../services/list-options';
import {
  AccessIdSubjectValue,
  ComposerService,
  LicenseSubjectValue,
  PostToPermawebSubjectValue,
} from '../../services/composer.service';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { FeaturesService } from '../../../../services/features.service';
import { Session } from '../../../../services/session';
import { PopupService } from '../popup/popup.service';
import { PermawebTermsComponent } from '../popup/permaweb/permaweb-terms.component';
import { take } from 'rxjs/operators';
import { FormToastService } from '../../../../common/services/form-toast.service';

/**
 * Composer title bar component. It features a label and a dropdown menu
 * with not-that-important options.
 */
@Component({
  selector: 'm-composer__titleBar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'title-bar.component.html',
})
export class TitleBarComponent implements OnDestroy {
  /**
   * Composer textarea ID
   */
  @Input() inputId: string;

  /**
   * Create blog intent
   */
  @Output('onCreateBlog') onCreateBlogEmitter: EventEmitter<
    void
  > = new EventEmitter<void>();

  /**
   * Visibility items list
   */
  visibilityItems: Array<{ text: string; value: string }> = ACCESS.map(
    ({ text, value }) => ({
      text,
      value: `${value}`,
    })
  );

  /**
   * License items list
   */
  licenseItems: Array<LicensesEntry> = LICENSES.filter(
    license => license.selectable
  );

  permawebPostClickSubscription: Subscription;

  constructor(
    protected service: ComposerService,
    private features: FeaturesService,
    private session: Session,
    private popup: PopupService,
    private toaster: FormToastService
  ) {}

  ngOnDestroy() {
    if (this.permawebPostClickSubscription) {
      this.permawebPostClickSubscription.unsubscribe();
    }
  }

  /**
   * Access ID subject from service
   */
  get accessId$(): BehaviorSubject<AccessIdSubjectValue> {
    return this.service.accessId$;
  }

  /**
   * License subject from service
   */
  get license$(): BehaviorSubject<LicenseSubjectValue> {
    return this.service.license$;
  }

  /**
   * Post to permaweb subject from service
   */
  get postToPermaweb$(): BehaviorSubject<PostToPermawebSubjectValue> {
    return this.service.postToPermaweb$;
  }

  /**
   * Attachment subject value from service
   */
  get attachment$() {
    return this.service.attachment$;
  }

  /**
   * Is editing? subject value from service
   */
  get isEditing$() {
    return this.service.isEditing$;
  }

  /**
   * Is posting? subject value from service
   */
  get isPosting$() {
    return this.service.isPosting$;
  }

  /**
   * Get monetization subject value from service
   */
  get monetization$() {
    return this.service.monetization$;
  }

  /**
   * Can the actor change visibility? (disabled when there's a container)
   */
  get canChangeVisibility(): boolean {
    return !this.service.getContainerGuid();
  }

  /**
   * Clicked Create Blog trigger
   */
  onCreateBlogClick() {
    this.onCreateBlogEmitter.emit();
  }

  /**
   * Emits the new visibility (access ID)
   * @param $event
   */
  onVisibilityClick($event) {
    if (!this.canChangeVisibility) {
      return;
    }

    this.accessId$.next($event);
  }

  /**
   * Emits the new license
   * @param $event
   */
  onLicenseClick($event) {
    this.license$.next($event);
  }

  /**
   * Opens modal for permaweb if it can be opened.
   * @returns { void }
   */
  public async onPostToPermawebClick(): Promise<void> {
    this.permawebPostClickSubscription = combineLatest([
      this.postToPermaweb$,
      this.monetization$,
      this.accessId$,
    ])
      .pipe(take(1))
      .subscribe(async ([postToPermaweb, monetization, accessId]) => {
        if (postToPermaweb) {
          this.postToPermaweb$.next(!postToPermaweb);
          return;
        }

        if (monetization) {
          this.toaster.warn('Cannot post monetized posts to permaweb');
          return;
        }

        if (accessId !== '2') {
          this.toaster.warn('Only public posts can be posted to the permaweb');
          return;
        }

        await this.popup
          .create(PermawebTermsComponent)
          .present()
          .toPromise(/* Promise is needed to boot-up the Observable */);
      });
  }

  /**
   * Show permaweb option.
   * @returns { boolean } true if option should be shown.
   */
  public shouldShowPermawebOption(): boolean {
    return (
      this.features.has('permaweb') &&
      this.session.getLoggedInUser().plus &&
      this.canChangeVisibility
    ); // true is there is a container_guid
  }
}
