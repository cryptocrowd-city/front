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

  const accessId$ = jasmine.createSpyObj('accessId$', ['next', 'getValue']);
  const license$ = jasmine.createSpyObj('license$', ['next']);

  let containerGuid;

  const composerServiceMock: any = MockService(ComposerService, {
    getContainerGuid: () => containerGuid,
    has: ['accessId$', 'license$', 'containerGuid'],
    props: {
      accessId$: { get: () => accessId$ },
      license$: { get: () => license$ },
    },
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TitleBarComponent,
        MockComponent({
          selector: 'm-dropdownMenu',
          inputs: ['menu', 'triggerClass', 'menuClass', 'anchorPosition'],
        }),
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

  it('should emit on visibility change', () => {
    featuresServiceMock.mock('permaweb', false);
    containerGuid = '';
    accessId$.next.calls.reset();
    fixture.detectChanges();

    comp.onVisibilityClick('2');
    expect(accessId$.next).toHaveBeenCalledWith('2');
  });

  it('should not emit visibility change if disabled', () => {
    featuresServiceMock.mock('permaweb', false);
    containerGuid = '100000';
    accessId$.next.calls.reset();
    fixture.detectChanges();

    comp.onVisibilityClick('2');
    expect(accessId$.next).not.toHaveBeenCalled();
  });

  it('should emit on license change', () => {
    featuresServiceMock.mock('permaweb', true);
    license$.next.calls.reset();
    fixture.detectChanges();

    comp.onLicenseClick('spec-test');
    expect(license$.next).toHaveBeenCalledWith('spec-test');
  });

  it('should not show permaweb option if no feature flag', () => {
    featuresServiceMock.mock('permaweb', false);
    sessionMock.user.plus = true;
    spyOnProperty(comp, 'canChangeVisibility', 'get').and.returnValue('100000');
    (comp as any).service.isEditing$ = new BehaviorSubject<boolean>(false);
    expect(comp.shouldShowPermawebOption()).toBeFalsy();
  });

  it('should not show permaweb option if user not plus, but every other condition is truthy', () => {
    featuresServiceMock.mock('permaweb', true);
    sessionMock.user.plus = false;
    (comp as any).service.isEditing$ = new BehaviorSubject<boolean>(false);
    spyOnProperty(comp, 'canChangeVisibility', 'get').and.returnValue('100000');
    expect(comp.shouldShowPermawebOption()).toBeFalsy();
  });

  it('should not show permaweb option if editing, but every other condition is truthy', () => {
    featuresServiceMock.mock('permaweb', true);
    sessionMock.user.plus = true;
    (comp as any).service.isEditing$ = new BehaviorSubject<boolean>(true);
    spyOnProperty(comp, 'canChangeVisibility', 'get').and.returnValue('100000');
    expect(comp.shouldShowPermawebOption()).toBeFalsy();
  });

  it('should show permaweb option if feat flag, user is plus not editing and can change visibility', () => {
    featuresServiceMock.mock('permaweb', true);
    sessionMock.user.plus = true;
    (comp as any).service.isEditing$ = new BehaviorSubject<boolean>(false);
    spyOnProperty(comp, 'canChangeVisibility', 'get').and.returnValue('100000');

    composerServiceMock.containerGuid = '100000';

    fixture.detectChanges();
    expect(comp.shouldShowPermawebOption()).toBeTruthy();
  });
});
