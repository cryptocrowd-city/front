import { Injectable, Output, EventEmitter } from '@angular/core';
import { Client } from '../../common/api/client.service';
import { Session } from '../../services/session';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsV2Service {
  settings: any = {
    name: '',
  };
  proSettings: any = {};
  settings$: BehaviorSubject<any> = new BehaviorSubject(this.settings);
  proSettings$: BehaviorSubject<any> = new BehaviorSubject(this.proSettings);

  lastBoostRating: number;
  ratingChanged: EventEmitter<number> = new EventEmitter<number>();

  constructor(private client: Client, protected session: Session) {}

  async loadSettings(guid): Promise<any> {
    try {
      const { channel } = <any>await this.client.get('api/v1/settings/' + guid);

      this.settings = { ...channel };
      console.log('ojm get settings', this.settings, channel);

      this.lastBoostRating = this.settings.boost_rating || 2;

      this.settings$.next(this.settings);

      return channel;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async updateSettings(guid, form): Promise<any> {
    /**
     * Keep track of boost rating so we know when to refresh the feed
     * ojm do we still need this now that the settings aren't embedded in the feed?
     */
    if (
      form.hasOwnProperty('boost_rating') &&
      form.boost_rating !== this.lastBoostRating
    ) {
      this.boostRatingChanged(form.boost_rating);
    }

    try {
      const response = <any>(
        await this.client.post('api/v1/settings/' + guid, form)
      );

      // Refresh settings$ after updates are made
      this.loadSettings(guid);
      return response;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  boostRatingChanged(rating): void {
    this.session.getLoggedInUser().boost_rating = rating;
    this.ratingChanged.emit(rating);
  }
}
