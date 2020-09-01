import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Singleton holding a trigger$ value, to be pushed to when wanting
 * the next video in a sequence to load. Moving to and playing the
 * next video should be handled in subscriptions to trigger$.
 */
@Injectable({ providedIn: 'root' })
export class AutoProgressVideoService {
  /**
   * Call next() to trigger subscribers to play the next video.
   */
  @Output() public readonly trigger$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);
}
