import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Web3WalletService } from '../../../web3-wallet.service';

@Component({
  selector: 'm-buy_tokens',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'uniswap-modal.component.html',
  styleUrls: ['./uniswap-modal.component.scss'],
})
export class UniswapModalComponent implements OnInit {
  ofac: boolean = false;
  use: boolean = false;
  terms: boolean = false;

  constructor(private web3Wallet: Web3WalletService) {
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
}
