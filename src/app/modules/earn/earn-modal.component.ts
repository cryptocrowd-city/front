import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { BuyTokensModalService } from '../blockchain/token-purchase/v2/buy-tokens-modal.service';
import { UniswapModalService } from '../blockchain/token-purchase/v2/uniswap/uniswap-modal.service';
import { Web3WalletService } from '../blockchain/web3-wallet.service';
import { ModalService } from '../composer/components/modal/modal.service';
import { ComposerService } from '../composer/services/composer.service';

@Component({
  selector: 'm-earn__modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'earn-modal.component.html',
  styleUrls: ['./earn-modal.component.ng.scss'],
  providers: [ComposerService],
})
export class EarnModalComponent {
  onDismissIntent: () => void = () => {};

  set opts({ onDismissIntent }) {
    this.onDismissIntent = onDismissIntent || (() => {});
  }

  constructor(
    private composer: ComposerService,
    private uniswapModalService: UniswapModalService,
    private web3walletService: Web3WalletService,
    private composerModal: ModalService,
    private injector: Injector,
    private buyTokensModalService: BuyTokensModalService
  ) {}

  async openAddLiquidity() {
    this.onDismissIntent();
    await this.web3walletService.getCurrentWallet(true);
    await this.uniswapModalService.open('add');
  }

  async openCompose() {
    this.onDismissIntent();
    this.composerModal
      .setInjector(this.injector)
      .present()
      .toPromise();
  }

  redirectDevelop() {
    window.location.replace('https://gitlab.com/minds');
  }

  async openReferModal() {
    this.onDismissIntent();
    await this.buyTokensModalService.open();
  }

}
