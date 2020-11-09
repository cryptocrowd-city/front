import { Compiler, Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import {
  StackableModalEvent,
  StackableModalService,
  StackableModalState,
} from '../../../../../services/ux/stackable-modal.service';
import { UniswapModalComponent } from './uniswap-modal.component';

@Injectable()
export class UniswapModalService {
  constructor(
    private stackableModal: StackableModalService,
    private compiler: Compiler,
    private injector: Injector
  ) {}

  async open(): Promise<any> {
    const { BuyTokensModalModule } = await import('../buy-tokens-modal.module');

    const moduleFactory = await this.compiler.compileModuleAsync(
      BuyTokensModalModule
    );
    const moduleRef = moduleFactory.create(this.injector);

    const componentFactory = moduleRef.instance.resolveComponent();

    const onSuccess$: Subject<any> = new Subject();

    const evt: StackableModalEvent = await this.stackableModal
      .present(UniswapModalComponent, null, {
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

    if (evt.state === StackableModalState.Dismissed && !onSuccess$.isStopped) {
      throw 'Dismissed modal';
    }

    return onSuccess$.toPromise();
  }
}
