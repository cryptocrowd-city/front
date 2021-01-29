import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-marketing__asFeaturedInBlockchain',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'as-featured-in-blockchain.component.html',
  styleUrls: ['./as-featured-in-blockchain.component.ng.scss'],
})
export class MarketingAsFeaturedInBlockchainComponent {
  @Input() inThePress: boolean = false;

  readonly cdnAssetsUrl: string;

  constructor(configs: ConfigsService) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }
}
