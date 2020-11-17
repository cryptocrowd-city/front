import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { UniswapAction } from './uniswap-modal.service';

@Component({
  selector: 'm-uniswap__modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'uniswap-modal.component.html',
  styleUrls: ['./uniswap-modal.component.scss'],
})
export class UniswapModalComponent {
  private baseUrl = 'https://app.uniswap.org/#';
  private action: UniswapAction;
  public iframeUrl: string;

  @Input('action') set data(action) {
    this.action = action;

    const mindsTokenAddress = this.configService.get('blockchain').token;

    if (this.action === 'swap') {
      this.iframeUrl = `${this.baseUrl}/${this.action}?outputCurrency=0x6B175474E89094C44Da98b954EedeAC495271d0F`;
    } else {
      this.iframeUrl = this.iframeUrl = `${this.baseUrl}/${this.action}/0x6B175474E89094C44Da98b954EedeAC495271d0F`;
    }
  }

  constructor(private configService: ConfigsService) {}
}
