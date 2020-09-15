import { Injectable } from '@angular/core';
import { BehaviorSubject, timer, Observable, Subscription, of } from 'rxjs';
import { tap, takeWhile, scan, take, map, switchMap } from 'rxjs/operators';
import { HorizontalFeedService } from '../../../../../common/services/horizontal-feed.service';
import { ActivityEntity } from '../../../../newsfeed/activity/activity.service';

/**
 * Singleton holding a goNext$ value, to be pushed too when wanting
 * the next video in a sequence to load.
 */
@Injectable({ providedIn: 'root' })
export class AutoProgressVideoService {
  /**
   * Holds countdown timer Observable. Can be destroyed.
   */
  public timer$: Observable<number> = new Observable<number>();

  /**
   * Push a new value to trigger subscribers to play the next video instantly.
   */
  public readonly goNext$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * Holds the next entity to play.
   */
  private readonly nextEntity$: BehaviorSubject<
    ActivityEntity
  > = new BehaviorSubject<ActivityEntity>(null);

  /**
   * Updates next entity observable in horizontal feed service
   * @returns { void }
   */
  public updateNextEntity(): void {
    this.nextEntity$.next(this.horizontalFeed.updateNextEntity());
  }

  /**
   * Gets the next videos title.
   * @returns { Observable<string> } The next videos title.
   */
  public get nextTitle$(): Observable<string> {
    return this.nextEntity$.pipe(
      map(entity => {
        if (!entity || !entity.title) return 'Untitled';

        if (entity.title.length > 100) {
          return entity.title.substr(0, 97) + '...';
        }

        return entity.title;
      })
    );
  }

  /**
   * Gets the author of the next video.
   * @returns { Observable<string> } The author of the next video.
   */
  public get nextAuthor$(): Observable<string> {
    return this.nextEntity$.pipe(
      map(entity => {
        return entity && entity.ownerObj.username
          ? entity.ownerObj.username
          : '';
      })
    );
  }

  constructor(private horizontalFeed: HorizontalFeedService) {}

  /**
   * If a next video exists, trigger it to play next.
   * @returns { AutoProgressVideoService } - chainable.
   */
  public next(): AutoProgressVideoService {
    if (this.horizontalFeed && this.horizontalFeed.hasNext) {
      const entity = this.updateNextEntity();

      this.delayed(6);
    }
    return this;
  }

  /**
   * Overwrites timer variable with fixed Observable with value 0.
   * You must also hide the overlay in your component.
   * @returns { AutoProgressVideoService } - chainable.
   */
  public cancel(): AutoProgressVideoService {
    this.timer$ = of(0);
    return this;
  }

  /**
   * Starts a countdown timer that triggers service subscribers.
   * to update and trigger showing the next video on completion.
   * @param { number } - whole seconds to count from. e.g. number 5 is 5 seconds.
   * @returns { AutoProgressVideoService } - chainable.
   */
  private delayed(seconds: number = 5): AutoProgressVideoService {
    this.timer$ = timer(0, 1000).pipe(
      scan(acc => --acc, seconds),
      tap(x => {
        if (x === 0) {
          this.goNext$.next(true);
        }
      }),
      takeWhile(x => x >= 0)
    );
    return this;
  }
}
