import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageLayoutService } from '../../common/layout/page-layout.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'm-aux',
  templateUrl: './aux.component.html',
  styleUrls: ['./aux.component.ng.scss'],
})
export class AuxComponent implements OnInit, OnDestroy {
  routerSubscription: Subscription;

  constructor(
    private pageLayoutService: PageLayoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pageLayoutService.useFullWidth();

    {
      this.routerSubscription = this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(() => {
          console.log('ojm');
          this.pageLayoutService.useFullWidth();
        });
    }
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
