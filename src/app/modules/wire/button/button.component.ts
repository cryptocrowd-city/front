import { Component, EventEmitter, Input, Output } from '@angular/core';

import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { SignupModalService } from '../../modals/signup/service';
import { Session } from '../../../services/session';
import { WireModalService } from '../wire-modal.service';
import { WireEventType } from '../v2/wire-v2.service';
import { FeaturesService } from '../../../services/features.service';

@Component({
  selector: 'm-wire-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.ng.scss'],
})
export class WireButtonComponent {
  @Input() object: any;
  @Output('done') doneEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    public session: Session,
    private overlayModal: OverlayModalService,
    private modal: SignupModalService,
    private wireModal: WireModalService,
    public features: FeaturesService
  ) {}

  async wire() {
    if (!this.session.isLoggedIn()) {
      this.modal.open();

      return;
    }

    const wireEvent = await this.wireModal
      .present(this.object, {
        default: this.object && this.object.wire_threshold,
      })
      .toPromise();

    if (wireEvent.type === WireEventType.Completed) {
      const wire = wireEvent.payload;

      if (this.object.wire_totals) {
        this.object.wire_totals[wire.currency] = wire.amount;
      }

      this.doneEmitter.emit(wire);
    }
  }
}
