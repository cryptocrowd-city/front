import { Component, Input } from '@angular/core';

/**
 * Small canary flag to be shown to a user alongside a logo to show they are in Canary mode.
 */
@Component({
  selector: 'm-canaryFlag',
  template: `
    <span class="m-v3TopbarNav__canaryFlag" *ngIf="isCanaryMode">Canary</span>
  `,
  styleUrls: ['./canary-flag.component.ng.scss'],
})
export class CanaryFlagComponent {
  /**
   * If true show flag.
   */
  @Input() isCanaryMode = false;
}
