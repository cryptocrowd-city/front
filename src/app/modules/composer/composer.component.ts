import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ComposerService } from './services/composer.service';
import { ModalService } from './components/modal/modal.service';
import { BaseComponent } from './components/base/base.component';
import { TagsPipe } from '../../common/pipes/tags';
import { FormToastService } from '../../common/services/form-toast.service';
import { Subscription } from 'rxjs';
import { Session } from '../../services/session';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfigsService } from '../../common/services/configs.service';
import { Storage } from '../../services/storage';

/**
 * Wrapper component for composer. It can hold an embedded base composer
 * or a placeholder-like non-interactive copy that will open a floating modal
 */
@Component({
  providers: [ComposerService],
  selector: 'm-composer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'composer.component.html',
})
export class ComposerComponent implements OnInit, OnDestroy {
  /**
   * Is this an embedded composer (i.e. no modal)
   */
  @Input() embedded: boolean = false;

  /**
   * Should create blog button be hidden?
   * @param { boolean } value - true if Creat Blog option should be hidden.
   */
  @Input() set hideCreateBlog(value: boolean) {
    this.service.hideCreateBlog$.next(value);
  }

  /**
   * Input activity (for edits)
   * @param activity
   * @private
   */
  @Input('activity') set _activity(activity: any) {
    if (activity) {
      this.service.load(activity);
    }
  }

  /**
   * Container GUID (group context)
   * @param containerGuid
   * @private
   */
  @Input('containerGuid') set _containerGuid(containerGuid: any) {
    if (typeof containerGuid !== 'undefined') {
      this.service.setContainerGuid(containerGuid);
    }
  }

  /**
   * Post event emitter
   * Consider whether feedsUpdateService
   * better suits your needs before hooking in.
   */
  @Output('onPost') onPostEmitter: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Posting error event emitter
   */
  @Output('onPostError') onPostErrorEmitter: EventEmitter<
    any
  > = new EventEmitter<any>();

  /**
   * Is the modal open?
   */
  modalOpen: boolean = false;

  /**
   * Embedded composer ref
   */
  @ViewChild('embeddedBaseComposer')
  protected embeddedBaseComposer: BaseComponent;

  /**
   * Popup placeholder composer ref
   */
  @ViewChild('popOutBaseComposer')
  protected popOutBaseComposer: BaseComponent;

  /**
   * Was this component destroyed (yes, it can happen)
   */
  protected destroyed: boolean = false;

  protected tooManyTagsSubscription: Subscription;

  querySubscription: Subscription;

  readonly siteUrl: string;

  /**
   * Constructor
   * @param modalService
   * @param formToast
   * @param service
   * @param cd
   * @param injector
   */
  constructor(
    protected modalService: ModalService,
    protected formToast: FormToastService,
    protected service: ComposerService /* NOTE: Used for DI. DO NOT REMOVE OR CHANGE !!! */,
    protected cd: ChangeDetectorRef,
    protected injector: Injector,
    protected session: Session,
    protected route: ActivatedRoute,
    public storage: Storage,
    public router: Router,
    configs: ConfigsService
  ) {
    this.siteUrl = configs.get('site_url');

    this.tooManyTagsSubscription = this.service.tooManyTags$.subscribe(
      value => {
        if (value) {
          const message = 'You may include up to 5 hashtags';

          if (!this.formToast.isToastActive(message)) {
            this.formToast.error(message);
          }
        }
      }
    );
  }

  ngOnInit(): void {
    this.querySubscription = this.route.queryParamMap.subscribe(
      (params: ParamMap) => {
        if (params.has('intentUrl')) {
          const intentUrl = params.get('intentUrl');
          if (this.session.isLoggedIn()) {
            this.onTriggerClick();
            this.service.message$.next(intentUrl);
          } else {
            this.storage.set(
              'redirect',
              `${this.siteUrl}?intentUrl=${intentUrl}`
            );
            this.router.navigate(['/login']);
          }
        }
      }
    );
  }
  /**
   * Component destroy hook
   */
  ngOnDestroy(): void {
    this.destroyed = true;
    this.tooManyTagsSubscription.unsubscribe();
    this.modalService.dismiss();
    this.querySubscription.unsubscribe();
  }

  /**
   * Opens the modal when the placeholder is clicked
   * @param $event
   */
  async onTriggerClick($event?: MouseEvent) {
    this.modalOpen = true;
    this.detectChanges();

    //

    try {
      const $event = await this.modalService
        .setInjector(this.injector)
        .present()
        .toPromise();

      if (this.destroyed) {
        // If the component was destroyed (i.e navigated away), do nothing
        return;
      }

      if ($event) {
        this.onPostEmitter.emit($event);
      }
    } catch (e) {
      console.error('Composer.onTriggerClick', e);
      this.onPostErrorEmitter.emit(e);
    }

    this.modalOpen = false;

    // Cleanup intentUrl param
    if (this.route.snapshot.queryParamMap.get('intentUrl')) {
      this.router.navigate(['.'], {
        queryParams: {},
        relativeTo: this.route,
      });
    }
    this.detectChanges();
  }

  /**
   * Can navigate away? Children base components are responsible for asking
   */
  canDeactivate(): boolean | Promise<boolean> {
    if (this.popOutBaseComposer) {
      return this.popOutBaseComposer.canDeactivate();
    }

    if (this.embeddedBaseComposer) {
      return this.embeddedBaseComposer.canDeactivate();
    }

    return true;
  }

  /**
   * Detect changes. Do nothing if component is destroyed.
   */
  detectChanges() {
    if (this.destroyed) {
      return;
    }

    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
