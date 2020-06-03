import { Injectable, Output, EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs';

/**
 * Mini-service allowing components to hook into
 * $posted to see when a new activity has been posted.
 */
@Injectable()
export class FeedsUpdateService {
  @Output() public readonly postEmitter: EventEmitter<any> = new EventEmitter();
}
