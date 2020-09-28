import { Component } from '@angular/core';
import { MarkedDirective } from '../../../../common/directives/marked.directive';

@Component({
  selector: 'm-aux__proTerms',
  templateUrl: './pro-terms.component.html',
  providers: [MarkedDirective],
})
export class AuxProTermsComponent {
  init: boolean = false;

  constructor(private markedDirective: MarkedDirective) {}
}
