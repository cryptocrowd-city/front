import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { TitleBarComponent } from './title-bar.component';
import { ComposerService } from '../../services/composer.service';
import { FeaturesService } from '../../../../services/features.service';
import { Session } from '../../../../services/session';
import { PopupService } from '../popup/popup.service';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { featuresServiceMock } from '../../../../../tests/features-service-mock.spec';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { BehaviorSubject } from 'rxjs';

describe('Composer Title Bar', () => {
  let comp: TitleBarComponent;
  let fixture: ComponentFixture<TitleBarComponent>;

  let containerGuid;

  const composerServiceMock: any = MockService(ComposerService, {
    getContainerGuid: () => containerGuid,
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TitleBarComponent,
        MockComponent({
          selector: 'm-icon',
          inputs: ['from', 'iconId', 'sizeFactor'],
        }),
      ],
      providers: [
        {
          provide: ComposerService,
          useValue: composerServiceMock,
        },
        {
          provide: FeaturesService,
          useValue: featuresServiceMock,
        },
        {
          provide: Session,
          useValue: sessionMock,
        },
        {
          provide: PopupService,
          useValue: MockService(PopupService),
        },
        {
          provide: FormToastService,
          useValue: MockService(FormToastService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(TitleBarComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });
});
