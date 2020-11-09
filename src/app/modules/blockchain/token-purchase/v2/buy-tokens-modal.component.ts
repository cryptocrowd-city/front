import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TransakService } from './transak.service';
import { UniswapModalService } from './uniswap/uniswap-modal.service';

@Component({
  selector: 'm-buy_tokens',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'buy-tokens-modal.component.html',
  styleUrls: ['./buy-tokens-modal.component.scss'],
})
export class BuyTokensModalComponent implements OnInit {
  ofac: boolean = false;
  use: boolean = false;
  terms: boolean = false;

  constructor(
    private transakService: TransakService,
    private uniswapModalService: UniswapModalService
  ) {
    console.log('HEY');
  }

  /**
   * Modal options
   *
   * @param onSave
   * @param onDismissIntent
   */
  set opts({ onSave, onDismissIntent }) {
    this.onSave = onSave || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  ngOnInit() {
    console.log('ON INIT');
  }

  /**
   * Modal save handler
   */
  onSave: (any) => any = () => {};

  /**
   * Modal dismiss intent handler
   */
  onDismissIntent: () => void = () => {};

  canContinue() {
    return this.terms;
  }

  async payWithTransak() {
    await this.transakService.open();
  }

  async payWithCrypto() {
    await this.uniswapModalService.open();
  }
}
