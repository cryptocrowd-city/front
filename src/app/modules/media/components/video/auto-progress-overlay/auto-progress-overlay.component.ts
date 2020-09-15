import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { HorizontalFeedService } from '../../../../../common/services/horizontal-feed.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MediumFadeAnimation } from '../../../../../animations';
import { AutoProgressVideoService } from './auto-progress-video.service';

@Component({
  selector: 'm-autoProgress__overlay',
  templateUrl: './auto-progress-overlay.component.html',
  styleUrls: ['./auto-progress-overlay.component.ng.scss'],
})
export class AutoProgressOverlayComponent {
  constructor(public autoProgress: AutoProgressVideoService) {}
}
