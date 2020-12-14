import { Component, Input, OnInit } from '@angular/core';
import {
  HorizontalFeedPool,
  HorizontalFeedPools,
  HorizontalFeedService,
} from '../../../common/services/horizontal-feed.service';
import getActivityContentType from '../../../helpers/activity-content-type';
import { Session } from '../../../services/session';
import { ActivityEntity } from '../activity/activity.service';

@Component({
  selector: 'm-newsfeed__activitySuggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.ng.scss'],
  providers: [HorizontalFeedService],
})
export class NewsfeedActivitySuggestionsComponent {
  protected _baseEntity: ActivityEntity;
  /**
   * The 'base' entity is the activity that will be
   * used to determine which posts to suggest
   */
  @Input() set baseEntity(e: ActivityEntity) {
    if (e) {
      this._baseEntity = e;
      this.onBaseEntityChange(e);
    }
  }

  /**
   * Raw feed entities are filtered by content type
   */
  entities: Array<any> = [];
  inProgress: boolean = false;

  constructor(
    public session: Session,
    protected horizontalFeed: HorizontalFeedService
  ) {}

  async onBaseEntityChange(e: ActivityEntity): Promise<void> {
    this.inProgress = true;
    this.entities = [];
    this.horizontalFeed.setContext('container');
    this.horizontalFeed.setBaseEntity(e);

    await this.horizontalFeed.fetch();

    const pools = this.horizontalFeed.pools;

    if (pools) {
      this.collatePools(pools);
    }

    this.inProgress = false;
  }

  collatePools(pools: HorizontalFeedPools): void {
    this.filterPoolByType(pools.next);

    // if there aren't enough viable posts in the 'next' pool
    // try the 'previous' pool
    if (this.entities.length < 3) {
      this.filterPoolByType(pools.prev);
    }

    this.entities.length = Math.min(this.entities.length, 3);
  }

  filterPoolByType(pool: HorizontalFeedPool): void {
    if (!pool.entities.length) {
      return;
    }

    pool.entities.forEach(e => {
      let entity = e.entity;
      const type = getActivityContentType(entity, true, false);

      if (type === 'image' || type === 'video' || type === 'blog') {
        this.entities.push(entity);
      }
    });
  }

  activityClicked(event: MouseEvent) {
    if (!event) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
  }

  get headerName(): string {
    if (!this._baseEntity) {
      return;
    }
    const baseOwner = this._baseEntity.ownerObj;

    if (baseOwner.guid === this.session.getLoggedInUser().guid) {
      return 'you';
    }

    return baseOwner.name;
  }
}
