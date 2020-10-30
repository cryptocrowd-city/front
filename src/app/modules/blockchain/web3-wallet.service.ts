import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { LocalWalletService } from './local-wallet.service';
import asyncSleep from '../../helpers/async-sleep';
import { TransactionOverlayService } from './transaction-overlay/transaction-overlay.service';
import { ConfigsService } from '../../common/services/configs.service';
import { Web3Service } from './web3.service';
import { BigNumber, BigNumberish, Contract, utils, Wallet } from 'ethers';
import BN from 'bn.js';

@Injectable()
export class Web3WalletService {
  public config; // TODO add types
  protected unavailable: boolean = false;
  protected local: boolean = false;
  protected _ready: Promise<any>;
  protected _web3LoadAttempt: number = 0;

  constructor(
    protected localWallet: LocalWalletService,
    protected transactionOverlay: TransactionOverlayService,
    protected web3service: Web3Service,
    @Inject(PLATFORM_ID) private platformId: Object,
    private configs: ConfigsService
  ) {
    this.config = this.configs.get('blockchain');
  }

  // Wallet

  async getWallets() {
    const address = await this.getCurrentWallet();

    if (!address) {
      return [];
    }

    return [address];
  }

  async getCurrentWallet(
    forceAuthorization: boolean = false
  ): Promise<string | false> {
    if (forceAuthorization) {
      await this.web3service.initializeProvider();
    }

    const signer = this.web3service.getSigner();

    if (!signer) {
      return false;
    }

    return await signer.getAddress();
  }

  async getBalance(address): Promise<string | false> {
    const signer = this.web3service.getSigner();

    if (!signer) {
      return false;
    }

    const balance = await signer.getBalance();

    return balance.toString();
  }

  async isLocked() {
    return !(await this.getCurrentWallet());
  }

  async setupMetamask() {
    return await this.localWallet.setupMetamask();
  }

  async unlock() {
    if (await this.isLocked()) {
      try {
        await this.getCurrentWallet(true);
      } catch (e) {
        console.log(e);
      }
    }

    return !(await this.isLocked());
  }

  // Network

  async isSameNetwork() {
    const provider = this.web3service.provider;
    let chainId = null;

    if (provider) {
      const network = await provider.getNetwork();
      chainId = network.chainId;
    }

    return (chainId || 1) == this.config.client_network;
  }

  // Bootstrap

  setUp() {
    this.config = this.configs.get('blockchain');
  }

  isUnavailable() {
    return this.unavailable;
  }

  // Contract Methods

  async sendSignedContractMethodWithValue(
    contract: Contract,
    method: string,
    params: any[],
    value: number | string,
    message: string = '',
    tokenDelta: string | 0 = 0
  ): Promise<string> {
    const connectedContract = contract.connect(this.web3service.getSigner());

    let gasLimit: string;

    try {
      gasLimit = (
        await connectedContract.estimateGas[method](...params, { value })
      ).toHexString();
    } catch (e) {
      console.log(e);
      gasLimit = BigNumber.from(15000000).toHexString();
    }

    const txHash = await this.transactionOverlay.waitForExternalTx(
      () =>
        connectedContract[method](...params, {
          value,
          gasLimit,
        }),
      message
    );

    await asyncSleep(1000); // Modals "cooldown"

    return txHash;
  }

  async sendSignedContractMethod(
    contract: any,
    method: string,
    params: any[],
    message: string = '',
    tokenDelta: string | 0 = 0
  ): Promise<string> {
    return await this.sendSignedContractMethodWithValue(
      contract,
      method,
      params,
      0,
      message,
      tokenDelta
    );
  }

  // Normal Transactions

  async sendTransaction(
    originalTxObject: any,
    message: string = ''
  ): Promise<string> {
    if (!originalTxObject.gasLimit) {
      try {
        const gasLimit = await this.web3service
          .getSigner()
          .estimateGas(originalTxObject);
        originalTxObject.gasLimit = gasLimit.toHexString();
      } catch (e) {
        console.log(e);
        originalTxObject.gasLimit = 15000000;
      }
    }

    const txHash = await this.transactionOverlay.waitForExternalTx(
      () => this.web3service.getSigner().sendTransaction(originalTxObject),
      message
    );

    await asyncSleep(1000); // Modals "cooldown"

    return txHash;
  }

  getContract(address: string, abi: any[]) {
    return this.web3service.getContract(address, abi);
  }

  toWei(amount: number | string, unit?: BigNumberish) {
    return BigNumber.from(
      this.web3service.toWei(amount, unit).toString()
    ).toHexString();
  }

  fromWei(amount: BN, unit?: BigNumberish) {
    return BigNumber.from(
      this.web3service.fromWei(amount, unit).toString()
    ).toHexString();
  }

  privateKeyToAccount(privateKey: string | utils.Bytes | utils.SigningKey) {
    if (typeof privateKey === 'string') {
      if (privateKey.indexOf('0x') !== 0) {
        return new Wallet('0x' + privateKey).address;
      }
    }

    return new Wallet(privateKey).address;
  }

  resetProvider() {
    this.web3service.resetProvider();
  }

  getOnChainInterfaceLabel() {
    if (this.local) {
      return 'Private Key';
    }

    if (
      window.web3.currentProvider.constructor.name === 'MetamaskInpageProvider'
    ) {
      return 'Metamask';
    } else if (
      window.web3.currentProvider.constructor.name === 'EthereumProvider'
    ) {
      return 'Mist';
    } else if (window.web3.currentProvider.constructor.name === 'o') {
      return 'Parity';
    }

    return 'Local Interface';
  }

  public encodeParams(types: (string | utils.ParamType)[], values: any[]) {
    return this.web3service.encodeParams(types, values);
  }

  // Service provider

  static _(
    localWallet: LocalWalletService,
    transactionOverlay: TransactionOverlayService,
    web3service: Web3Service,
    platformId: Object,
    configs: ConfigsService
  ) {
    return new Web3WalletService(
      localWallet,
      transactionOverlay,
      web3service,
      platformId,
      configs
    );
  }
}
