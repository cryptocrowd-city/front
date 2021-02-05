import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Session } from '../../../../../services/session';
import { OverlayModalService } from '../../../../../services/ux/overlay-modal';
import {
  StackableModalEvent,
  StackableModalService,
} from '../../../../../services/ux/stackable-modal.service';
import { WalletPhoneVerificationComponent } from './phone-verification.component';

/**
 * Global service to open a phone verification modal
 */
@Injectable()
export class PhoneVerificationService {
  /**
   * phoneVerified subject
   */
  phoneVerified$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    private stackableModal: StackableModalService,
    private session: Session
  ) {}

  async open(): Promise<void> {
    if (this.session.getLoggedInUser().rewards) {
      this.phoneVerified$.next(true);
      return;
    }

    const stackableModalEvent: StackableModalEvent = await this.stackableModal
      .present(WalletPhoneVerificationComponent, null, {
        wrapperClass: 'm-modalV2__wrapper',
        onComplete: () => {
          this.phoneVerified$.next(true);
          this.stackableModal.dismiss();
        },
        onDismissIntent: () => {
          this.stackableModal.dismiss();
        },
      })
      .toPromise();
  }
}
// todoojm make phone modal in token onboarding use this
