import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-blockchainMarketing__token',
  templateUrl: 'token.component.html',
  styleUrls: ['./token.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockchainMarketingTokenComponent {
  public readonly cdnAssetsUrl: string;
  public readonly siteUrl: string;

  @ViewChild('topAnchor')
  readonly topAnchor: ElementRef;

  constructor(
    protected router: Router,
    protected cd: ChangeDetectorRef,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
    this.siteUrl = configs.get('site_url');
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
}
