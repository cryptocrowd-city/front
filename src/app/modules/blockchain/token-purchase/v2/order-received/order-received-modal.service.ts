import { Compiler, Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import {
  StackableModalEvent,
  StackableModalService,
} from '../../../../../services/ux/stackable-modal.service';
import { OrderReceivedModalComponent } from './order-received-modal.component';

export interface OrderData {
  paymentMethod: 'Card' | 'Bank';
  tokenAmount: number;
  paymentAmount: number;
  currency: string;
}

@Injectable()
export class OrderReceivedModalService {
  constructor(
    private stackableModal: StackableModalService,
    private compiler: Compiler,
    private injector: Injector
  ) {}

  async open(orderData: OrderData): Promise<any> {
    const { BuyTokensModalModule } = await import('../buy-tokens-modal.module');

    const moduleFactory = await this.compiler.compileModuleAsync(
      BuyTokensModalModule
    );
    const moduleRef = moduleFactory.create(this.injector);

    const componentFactory = moduleRef.instance.resolveOrderReceivedComponent();

    const onSuccess$: Subject<any> = new Subject();

    const evt: StackableModalEvent = await this.stackableModal
      .present(OrderReceivedModalComponent, orderData, {
        wrapperClass: 'm-modalV2__wrapper',
        onComplete: (result: any) => {
          onSuccess$.next(result);
          onSuccess$.complete(); // Ensures promise can be called below
          this.stackableModal.dismiss();
        },
        onDismissIntent: () => {
          this.stackableModal.dismiss();
        },
      })
      .toPromise();

    return onSuccess$.toPromise();
  }
}
