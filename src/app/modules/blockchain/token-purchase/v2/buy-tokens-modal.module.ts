import {
  NgModule,
  ComponentFactoryResolver,
  ComponentFactory,
} from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../../common/common.module';
import { BuyTokensModalComponent } from './buy-tokens-modal.component';
import { FormsModule } from '@angular/forms';
import { TransakService } from './transak.service';
import { UniswapModalComponent } from './uniswap/uniswap-modal.component';
import { UniswapModalService } from './uniswap/uniswap-modal.service';

@NgModule({
  imports: [NgCommonModule, CommonModule, FormsModule],
  declarations: [BuyTokensModalComponent, UniswapModalComponent],
  exports: [BuyTokensModalComponent],
  providers: [TransakService, UniswapModalService],
})
export class BuyTokensModalModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveComponent(): ComponentFactory<BuyTokensModalComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(
      BuyTokensModalComponent
    );
  }
}
