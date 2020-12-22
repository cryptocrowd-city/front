import { Injectable } from '@angular/core';
import { Session } from '../../services/session';
import { FeaturesService } from '../../services/features.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable()
export class GuestModeService {
  isGuest$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  sessionSubscription: Subscription;

  constructor(private session: Session, private features: FeaturesService) {}

  setup(): void {
    this.sessionSubscription = this.session.loggedinEmitter.subscribe(
      isLoggedIn => {
        this.emitIsGuest(!isLoggedIn);
      }
    );
  }

  /**
   * Emits an events that others can listen to
   */
  emitIsGuest(isGuest: boolean): void {
    if (this.features.has('guest-mode')) {
      this.isGuest$.next(isGuest);
    }
  }
}
