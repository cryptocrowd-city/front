import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivityService, ActivityEntity } from '../activity.service';
import { Session } from '../../../../services/session';
import { Router } from '@angular/router';
import { BoostCreatorComponent } from '../../../boost/creator/creator.component';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';

@Component({
  selector: 'm-activity__toolbar',
  templateUrl: 'toolbar.component.html',
})
export class ActivityToolbarComponent {
  private entitySubscription: Subscription;
  private paywallBadgeSubscription: Subscription;

  entity: ActivityEntity;
  allowReminds: boolean = true;

  constructor(
    public service: ActivityService,
    public session: Session,
    private router: Router,
    private overlayModalService: OverlayModalService
  ) {}

  ngOnInit() {
    this.entitySubscription = this.service.entity$.subscribe(
      (entity: ActivityEntity) => {
        this.entity = entity;
        console.log('888 this entity', entity);
      }
    );

    this.paywallBadgeSubscription = this.service.shouldShowPaywallBadge$.subscribe(
      (showBadge: boolean) => {
        if (showBadge === undefined) {
          showBadge = false;
        }
        const tempEntity = JSON.parse(JSON.stringify(this.entity));
        const hasPaywallFlag = tempEntity.flags && tempEntity.flags.paywall;

        this.allowReminds = !showBadge && !hasPaywallFlag;
        console.log(
          '888 show badge?',
          showBadge,
          hasPaywallFlag,
          this.allowReminds,
          tempEntity
        );
      }
    );
  }

  ngOnDestroy() {
    this.entitySubscription.unsubscribe();
    this.paywallBadgeSubscription.unsubscribe();
  }

  toggleComments(): void {
    if (this.service.displayOptions.fixedHeight) {
      this.router.navigate([`/newsfeed/${this.entity.guid}`]);
      return;
    }

    this.service.displayOptions.showOnlyCommentsInput = !this.service
      .displayOptions.showOnlyCommentsInput;
  }

  openBoostModal(e: MouseEvent): void {
    this.overlayModalService
      .create(BoostCreatorComponent, this.entity)
      .present();
  }
}
