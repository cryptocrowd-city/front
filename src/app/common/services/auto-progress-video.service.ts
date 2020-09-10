import { Injectable, Output } from '@angular/core';
import { BehaviorSubject, timer, Observable } from 'rxjs';
import { tap, takeWhile, scan } from 'rxjs/operators';

/**
 * Singleton holding a trigger$ value, to be pushed to when wanting
 * the next video in a sequence to load. Moving to and playing the
 * next video should be handled in subscriptions to trigger$.
 */
@Injectable({ providedIn: 'root' })
export class AutoProgressVideoService {
  /**
   * Push a new value to trigger subscribers to play the next video instantly.
   */
  @Output() public readonly trigger$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /**
   * Holds countdown timer Observable. Can be destroyed.
   */
  public timer$: Observable<number> = new Observable<number>();

  /**
   * Starts a countdown timer that triggers service subscribers
   * to update and trigger showing the next video on completion.
   * @param { number } - whole seconds to count from. e.g. number 5 is 5 seconds
   * @returns void
   */
  public delayed(seconds: number = 5): void {
    this.timer$ = timer(0, 1000).pipe(
      scan(acc => --acc, seconds),
      tap(x => {
        if (x === 0) {
          this.trigger$.next(true);
        }
      }),
      takeWhile(x => x >= 0)
    );
  }
}
