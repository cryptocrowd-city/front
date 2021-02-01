import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { AbstractSubscriberComponent } from '../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ConfigsService } from '../../../common/services/configs.service';
import { ThemeService } from '../../../common/services/theme.service';
import { Session } from '../../../services/session';
import { ModalService } from '../../composer/components/modal/modal.service';
import { ComposerService } from '../../composer/services/composer.service';

@Component({
  selector: 'm-blockchainMarketing__token',
  templateUrl: 'token.component.html',
  styleUrls: ['./token.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComposerService],
})
export class BlockchainMarketingTokenComponent extends AbstractSubscriberComponent {
  public readonly cdnAssetsUrl: string;
  public readonly siteUrl: string;

  @ViewChild('topAnchor')
  readonly topAnchor: ElementRef;

  @ViewChild('composerOpenAnchor') readonly composerOpenAnchor: ElementRef;

  constructor(
    protected router: Router,
    protected cd: ChangeDetectorRef,
    private injector: Injector,
    private composerModal: ModalService,
    private session: Session,
    configs: ConfigsService
  ) {
    super();
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.siteUrl = configs.get('site_url');
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      fromEvent(this.composerOpenAnchor.nativeElement, 'click').subscribe(
        $event => {
          console.log('hello');
          if (!this.session.isLoggedIn()) {
            this.router.navigate(['/']);
            return;
          }
          this.openComposerModal();
        }
      )
    );
  }

  scrollToTop() {
    if (this.topAnchor.nativeElement) {
      this.topAnchor.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }

  onPurchaseComplete(purchase: any) {}

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  /**
   * Opens composer modal
   * @returns { BlockchainMarketingTokenComponent } - Chainable.
   */
  openComposerModal(): BlockchainMarketingTokenComponent {
    try {
      console.log('open composer');
      this.composerModal
        .setInjector(this.injector)
        .present()
        .toPromise();
      console.log('opened');
    } catch (e) {
      // do nothing
    }
    return this;
  }
}
