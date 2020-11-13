import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'm-uniswap__modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'uniswap-modal.component.html',
  styleUrls: ['./uniswap-modal.component.scss'],
})
export class UniswapModalComponent {}
