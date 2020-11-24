import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UniswapModalService } from '../blockchain/token-purchase/v2/uniswap/uniswap-modal.service';
import { Web3WalletService } from '../blockchain/web3-wallet.service';

@Component({
  selector: 'm-earn__modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'earn-modal.component.html',
  styleUrls: ['./earn-modal.component.ng.scss'],
})
export class EarnModalComponent {
  onDismissIntent: () => void = () => {};

  set opts({ onDismissIntent }) {
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  constructor(
    private uniswapModalService: UniswapModalService,
    private web3walletService: Web3WalletService
  ) {}

  async openAddLiquidity() {
    this.onDismissIntent();
    await this.web3walletService.getCurrentWallet(true);
    await this.uniswapModalService.open('add');
  }
}
