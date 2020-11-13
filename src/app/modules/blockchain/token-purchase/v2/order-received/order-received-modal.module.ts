import {
  NgModule,
  ComponentFactoryResolver,
  ComponentFactory,
} from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderReceivedModalComponent } from './order-received-modal.component';
import { CommonModule } from '../../../../../common/common.module';

@NgModule({
  imports: [NgCommonModule, CommonModule, FormsModule],
  declarations: [OrderReceivedModalComponent],
  exports: [OrderReceivedModalComponent],
})
export class OrderReceivedModalModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  public resolveComponent(): ComponentFactory<OrderReceivedModalComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(
      OrderReceivedModalComponent
    );
  }
}
