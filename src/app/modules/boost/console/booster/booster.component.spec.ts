import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { BoostConsoleBooster } from './booster.component';
import { clientMock, } from '../../../../../tests/client-mock.spec';
import { feedsServiceMock } from '../../../../../tests/feed-service-mock.spec';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { MockComponent, MockDirective } from '../../../../utils/mock';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { FeedsService } from '../../../../common/services/feeds.service';
import { BehaviorSubject } from 'rxjs';

describe('BoostConsoleBooster', () => {

  let comp: BoostConsoleBooster;
  let fixture: ComponentFixture<BoostConsoleBooster>;
  // const feedsService = {
  //     clear() { return this },
  //     setEndpoint(str: string) { return this },
  //     setLimit(int: number) { return this },
  //     fetch() { return this },
  //     feed()
  //       pipe: this,
  //     },
  // }

  // const feedsService = {
  //   feed: new BehaviorSubject([Promise.resolve('testing')]),
  //   clear() {
  //      of( { response: false }, { response: false }, { response: true } )
  //   },
  //   response() { return {'response': true } },
  //   setEndpoint(str) { return this }, //chainable
  //   setLimit(limit) { return this }, //chainable
  //   fetch() { return this } //chainable
  // };

  // let feedsService = { //new function () {
  //   response: null,
  //   callFake: this, //chainable
  
  //   clear: jasmine.createSpy('clear').and.callFake(callFake),
  //   this.setEndpoint = jasmine.createSpy('setEndpoint').and.callFake(callFake);
  //   this.setLimit = jasmine.createSpy('setLimit').and.callFake(callFake);
  //   this.fetch = jasmine.createSpy('fetch').and.callFake(callFake);
  //   this.feed = {
  //     pipe: jasmine.createSpy('pipe').and.callFake((fn) => Promise.resolve(fn))
  //   }
  // };
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockDirective({ selector: '[mdl]', inputs: ['mdl'] }),
        MockComponent({ selector: 'minds-card', inputs: ['object', 'hostClass'] }),
        MockComponent({ selector: 'minds-button', inputs: ['object', 'type'] }),
        MockDirective({ selector: 'infinite-scroll', inputs: ['moreData', 'inProgress'], outputs: ['load'] }),
        BoostConsoleBooster
      ],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: Session, useValue: sessionMock },
        { provide: ActivatedRoute, useValue: { parent: { url: of([{ path: 'newsfeed' }]) } } },
        { provide: FeedsService, useValue: feedsServiceMock },
      ]
    })
      .compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;

    fixture = TestBed.createComponent(BoostConsoleBooster);

    comp = fixture.componentInstance;

    // feedsService.response = {};
    feedsServiceMock.response['api/v1/newsfeed/personal'] = {
      status: 'success',
      activity: [
        { guid: '123' },
        { guid: '456' },
      ]
    };

    feedsServiceMock.response['api/v1/entities/owner'] = {
      status: 'success',
      entities: [
        { guid: '789' },
        { guid: '101112' },
      ]
    };

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable()
        .then(() => {
          fixture.detectChanges();
          done()
        });
    }
  });

  it('should have loaded the lists', () => {
    // expect(comp.ownerFeedsService).toBeDefined();
    expect(comp.ownerFeedsService).toBeDefined();
  });

  it('should have a title', () => {
    const title = fixture.debugElement.query(By.css('.m-boost-console-booster--cta span'));
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain('Boosting guarantees more views on your posts and content.');
  });

  it('should have a list of activities', () => {
    const list = fixture.debugElement.query(By.css('.m-boost-console--booster--posts-list'));
    expect(list).not.toBeNull();
    expect(list.nativeElement.children.length).toBe(1);
  });

  it("should have a poster if the user hasn't posted anything yet", () => {
    fixture.detectChanges();
    comp.posts = [];
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('.m-boost-console-booster--content h3'));
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain("You have no content yet. Why don't you post something?");


    const poster = fixture.debugElement.query(By.css('.m-boost-console-booster--content div:last-child'));
    expect(poster).not.toBeNull();
    expect(poster.nativeElement.hidden).toBeFalsy();
  });

});
