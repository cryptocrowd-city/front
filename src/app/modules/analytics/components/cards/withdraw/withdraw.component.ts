import { Component, OnInit, ViewChild } from '@angular/core';
import { Client } from "../../../../../services/api/client";
import { AnalyticsCardComponent } from "../card/card.component";
import { Subscription } from "rxjs";

@Component({
  selector: 'm-analyticswithdraw__card',
  templateUrl: 'withdraw.component.html'
})

export class WithdrawCardComponent implements OnInit {
  @ViewChild('card') card: AnalyticsCardComponent;

  subscription: Subscription;

  tokens: number = 0;
  transactions: number = 0;
  users: number = 0;

  constructor(private client: Client) {
  }

  ngOnInit() {
    this.getAvgData();

    this.subscription = this.card.selectedOptionChange.subscribe(() => {
      this.getAvgData();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private async getAvgData() {
    try {
      let avgs: Array<any> = await Promise.all([
        this.client.get('api/v2/analytics/withdraw', { key: 'average_tokens', timespan: this.card.selectedOption }),
        this.client.get('api/v2/analytics/withdraw', { key: 'average', timespan: this.card.selectedOption }),
        this.client.get('api/v2/analytics/withdraw', { key: 'average_users', timespan: this.card.selectedOption }),
      ]);

      this.tokens = avgs[0].data;

      this.transactions = avgs[1].data;

      this.users = avgs[2].data;
    } catch (e) {
      console.error(e);
    }
  }
}
