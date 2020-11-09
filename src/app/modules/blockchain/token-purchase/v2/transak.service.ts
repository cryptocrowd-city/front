import { Injectable } from '@angular/core';
import transakSDK from '@transak/transak-sdk';
import { Web3WalletService } from '../../web3-wallet.service';

@Injectable()
export class TransakService {
  constructor(private web3WalletService: Web3WalletService) {}

  async open() {
    const address = await this.web3WalletService.getCurrentWallet(true);

    let transak = new transakSDK({
      apiKey: '4fcd6904-706b-4aff-bd9d-77422813bbb7',
      environment: 'STAGING',
      defaultCryptoCurrency: 'ETH',
      walletAddress: address,
      themeColor: '000000',
      hostURL: window.location.origin,
      widgetHeight: '650px',
      widgetWidth: '450px',
    });

    return await new Promise((resolve, reject) => {
      transak.init();

      transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, error => {
        reject(error);
      });

      transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, orderData => {
        resolve(orderData);
        transak.close();
      });
    });
  }
}
