import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'm-pro__joinButton',
  templateUrl: 'join-button.component.html',
  styleUrls: ['join-button.component.ng.scss'],
})
export class JoinButtonComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  join(): void {
    // TODO: open new wire membership modal
  }
}
