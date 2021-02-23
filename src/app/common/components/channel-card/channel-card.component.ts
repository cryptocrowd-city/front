import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'm-channelCard',
  templateUrl: './channel-card.component.html',
  styleUrls: ['./channel-card.component.ng.scss'],
})
export class ChannelCardComponent implements OnInit {
  @Input() channel: any;
  // @Input() containerEl: any; ojm todo
  @Input() showDescription: boolean = true;
  @Input() showTags: boolean = true;
  @Input() showSubs: boolean = true;
  @Input() showSubscribeButton: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  //ojm listen(): void {
  // apply size class based on container width
  //  }
}
