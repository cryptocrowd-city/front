import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TransakService } from './transak.service';
import { UniswapModalService } from './uniswap/uniswap-modal.service';

type PaymentMethod = 'fiat' | 'crypto' | '';

@Component({
  selector: 'm-buyTokens__modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'buy-tokens-modal.component.html',
})
export class BuyTokensModalComponent {
  terms: boolean = false;
  paymentMethod: PaymentMethod = '';

  constructor(
    private transakService: TransakService,
    private uniswapModalService: UniswapModalService
  ) {}

  canContinue() {
    return this.terms && this.paymentMethod;
  }

  choosePaymentMethod(paymentMethod: PaymentMethod) {
    if (paymentMethod === this.paymentMethod) {
      this.paymentMethod = '';
    } else {
      this.paymentMethod = paymentMethod;
    }
  }

  async openPaymentModal() {
    if (this.paymentMethod === 'crypto') {
      await this.uniswapModalService.open();
    } else {
      await this.transakService.open();
    }
  }
}
