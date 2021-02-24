import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Injector,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Client } from '../../../../../services/api';
import { Session } from '../../../../../services/session';
import { WalletV2Service } from '../../wallet-v2.service';
import { WithdrawContractService } from '../../../../blockchain/contracts/withdraw-contract.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { OverlayModalService } from '../../../../../services/ux/overlay-modal';
import { PhoneVerificationService } from '../phone-verification/phone-verification.service';
import { WireCreatorComponent } from '../../../../wire/v2/creator/wire-creator.component';
import {
  StackableModalEvent,
  StackableModalService,
} from '../../../../../services/ux/stackable-modal.service';
import { WirePaymentHandlersService } from '../../../../wire/wire-payment-handlers.service';
import { BigNumber } from 'ethers';
import { Web3WalletService } from '../../../../blockchain/web3-wallet.service';

@Component({
  moduleId: module.id,
  selector: 'm-walletOnchainTransfer',
  templateUrl: './onchain-transfer.component.html',
  styleUrls: ['./onchain-transfer.component.ng.scss'],
  providers: [PhoneVerificationService],
})
export class WalletOnchainTransferComponent implements OnInit, OnDestroy {
  form;
  wallet;
  balance: number = 0;
  amountSubscription: Subscription;

  canTransfer = true; // whether the user can withdraw from wallet
  phoneVerified = false;
  isPlus = false;
  submitError = '';
  transferring: boolean = false;
  loading: boolean = true;

  phoneVerifiedSubscription: Subscription;

  readonly cdnAssetsUrl: string;

  transferLimit: number;
  ceilingIsLimit: boolean = false; // true if balance > limit,

  constructor(
    protected session: Session,
    protected client: Client,
    protected contract: WithdrawContractService,
    protected walletService: WalletV2Service,
    protected toasterService: FormToastService,
    protected overlayModal: OverlayModalService,
    protected phoneVerificationService: PhoneVerificationService,
    protected stackableModal: StackableModalService,
    protected wirePaymentHandlers: WirePaymentHandlersService,
    protected web3Wallet: Web3WalletService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');

    // ojm temp
    // this.transferLimit = configs.get('blockchain').contracts.withdraw.limit;
    this.transferLimit = 25000;
    console.log('ojm,', configs.get('blockchain'));
  }

  async ngOnInit() {
    this.phoneVerifiedSubscription = this.phoneVerificationService.phoneVerified$.subscribe(
      verified => {
        this.phoneVerified = verified;
      }
    );
    this.isPlus = this.session.getLoggedInUser().plus;
    this.load();
  }

  async load() {
    this.loading = true;
    this.submitError = '';
    this.wallet = await this.walletService.wallet;

    this.balance = this.wallet.offchain.balance;

    this.ceilingIsLimit =
      Math.min(this.balance, this.transferLimit) === this.balance;

    this.form = new FormGroup({
      amount: new FormControl(Math.min(this.balance, 1), {
        validators: [
          Validators.required,
          Validators.max(Math.min(this.balance, this.transferLimit)),
          Validators.min(0),
          this.validateMoreThanZero,
        ],
      }),
    });

    this.amountSubscription = this.form
      .get('amount')
      .valueChanges.subscribe(changes => {
        this.submitError = '';
      });

    this.canTransfer = await this.walletService.canTransfer();

    this.loading = false;
  }

  validateMoreThanZero(control: AbstractControl) {
    if (control.value <= 0 || control.value === -0) {
      return { moreThanZero: true }; // true if invalid
    }
    return null; // null if valid
  }

  async transfer() {
    if (!this.isPlus || !this.phoneVerified) {
      return;
    }

    if (await this.walletService.web3WalletUnlocked()) {
      try {
        this.transferring = true;

        const result: {
          address;
          guid;
          amount;
          gas;
          tx;
        } = await this.contract.request(
          this.session.getLoggedInUser().guid,
          this.web3Wallet.toWei(this.amount.value, 'ether')
        );

        const response: any = await this.client.post(
          `api/v2/blockchain/transactions/withdraw`,
          result
        );

        if (response.done) {
          this.transferComplete();
        } else {
          this.submitError = 'Server error';
        }
      } catch (e) {
        console.error(e);
        this.submitError = (e && e.message) || 'Server error';
      } finally {
        this.transferring = false;
      }
    }
  }

  onSubmit() {
    if (this.form.valid && this.canTransfer) {
      this.transfer();
    }
  }

  isFormValid() {
    return this.form.valid && this.canTransfer;
  }

  get amount() {
    return this.form.get('amount');
  }

  get web3WalletWorks() {
    return this.form.get('web3WalletWorks');
  }

  get meetsRequirements() {
    return this.phoneVerified && this.isPlus;
  }

  async openPhoneVerificationModal() {
    this.phoneVerificationService.open();
  }

  async openPlusSubscriptionModal(): Promise<void> {
    if (this.session.getLoggedInUser().plus) {
      this.isPlus = true;
      return;
    }

    const stackableModalEvent: StackableModalEvent = await this.stackableModal
      .present(
        WireCreatorComponent,
        await this.wirePaymentHandlers.get('plus'),
        {
          wrapperClass: 'm-modalV2__wrapper',
          default: {
            type: 'money',
            upgradeType: 'plus',
          },
          onComplete: () => {
            this.isPlus = true;
            this.session.getLoggedInUser().plus = true;
            this.toasterService.success('Welcome to Minds+');
            this.stackableModal.dismiss();
          },
          onDismissIntent: () => {
            this.stackableModal.dismiss();
          },
        }
      )
      .toPromise();
  }

  transferComplete(): void {
    this.toasterService.success('On-chain transfer complete');
    this.overlayModal.dismiss();
  }

  ngOnDestroy(): void {
    this.overlayModal.dismiss();
    if (this.amountSubscription) {
      this.amountSubscription.unsubscribe();
    }
    if (this.phoneVerifiedSubscription) {
      this.phoneVerifiedSubscription.unsubscribe();
    }
  }
}
