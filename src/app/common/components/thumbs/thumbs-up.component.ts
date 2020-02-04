import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
} from '@angular/core';

import { Session } from '../../../services/session';
import { Client } from '../../../services/api';
import { WalletService } from '../../../services/wallet';
import { SignupModalService } from '../../../modules/modals/signup/service';
import { ConfigsService } from '../../services/configs.service';

@Component({
  selector: 'minds-button-thumbs-up',
  inputs: ['_object: object'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      (click)="thumb()"
      [ngClass]="{ selected: has() }"
      data-cy="data-minds-thumbs-up-button"
    >
      <img
        class="m-buttonsThumbsUp__icon"
        [src]="cdn_assets_url + 'assets/icons/upvote.svg'"
      />
      <span
        class="minds-counter"
        *ngIf="object['thumbs:up:count'] > 0"
        data-cy="data-minds-thumbs-up-counter"
      >
        {{ object['thumbs:up:count'] | number }}
      </span>
    </a>
  `,
  styles: [
    `
      a {
        cursor: pointer;
      }
    `,
  ],
})
export class ThumbsUpButton implements DoCheck {
  changesDetected: boolean = false;
  object = {
    guid: null,
    owner_guid: null,
    'thumbs:up:user_guids': [],
  };
  showModal: boolean = false;
  cdn_assets_url: string;

  constructor(
    public session: Session,
    public client: Client,
    public wallet: WalletService,
    private modal: SignupModalService,
    private cd: ChangeDetectorRef,
    private configs: ConfigsService
  ) {
    this.cdn_assets_url = this.configs.get('cdn_assets_url');
  }

  set _object(value: any) {
    if (!value) return;
    this.object = value;
    if (!this.object['thumbs:up:user_guids'])
      this.object['thumbs:up:user_guids'] = [];
  }

  thumb() {
    if (!this.session.isLoggedIn()) {
      this.modal.setSubtitle('You need to have a channel to vote').open();
      this.showModal = true;
      return false;
    }

    this.client.put('api/v1/thumbs/' + this.object.guid + '/up', {});
    if (!this.has()) {
      // this.object['thumbs:up:user_guids'].push(this.session.getLoggedInUser().guid);
      this.object['thumbs:up:user_guids'] = [
        this.session.getLoggedInUser().guid,
      ];
      this.object['thumbs:up:count']++;
    } else {
      for (let key in this.object['thumbs:up:user_guids']) {
        if (
          this.object['thumbs:up:user_guids'][key] ===
          this.session.getLoggedInUser().guid
        )
          delete this.object['thumbs:up:user_guids'][key];
      }
      this.object['thumbs:up:count']--;
    }
  }

  has() {
    for (var guid of this.object['thumbs:up:user_guids']) {
      if (guid === this.session.getLoggedInUser().guid) return true;
    }
    return false;
  }

  ngDoCheck() {
    this.changesDetected = false;
    if (this.object['thumbs:up:count'] != this.object['thumbs:up:count:old']) {
      this.object['thumbs:up:count:old'] = this.object['thumbs:up:count'];
      this.changesDetected = true;
    }

    if (this.changesDetected) {
      this.cd.detectChanges();
    }
  }
}
