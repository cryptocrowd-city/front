import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormToastService } from '../../../common/services/form-toast.service';
import { MockService } from '../../../utils/mock';
import { OnboardingV3WidgetComponent } from './onboarding-widget.component';
import { OnboardingV3Service } from '../onboarding-v3.service';
import { OnboardingV3PanelService } from '../panel/onboarding-panel.service';
import { storageMock } from '../../../../tests/storage-mock.spec';
import { featuresServiceMock } from '../../../../tests/features-service-mock.spec';
import { Injector } from '@angular/core';
import { Storage } from '../../../services/storage';
import { ModalService } from '../../composer/components/modal/modal.service';
import { BehaviorSubject } from 'rxjs';

describe('OnboardingV3WidgetComponent', () => {
  let comp: OnboardingV3WidgetComponent;
  let fixture: ComponentFixture<OnboardingV3WidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingV3WidgetComponent],
      providers: [
        {
          provide: OnboardingV3Service,
          useValue: MockService(OnboardingV3Service),
        },
        {
          provide: OnboardingV3PanelService,
          useValue: MockService(OnboardingV3PanelService),
        },
        { provide: Storage, useValue: storageMock },
        { provide: ModalService, useValue: MockService(ModalService) },
        { provide: Injector, useValue: MockService(Injector) },
        { provide: FormToastService, useValue: MockService(FormToastService) },
      ],
      imports: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    featuresServiceMock.mock('onboarding-october-2020', true);

    fixture = TestBed.createComponent(OnboardingV3WidgetComponent);

    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to load on init', () => {
    expect((comp as any).onboarding.load).toHaveBeenCalled();
  });

  it('should hide on init if local storage item is set', () => {
    storageMock.set('onboarding:widget:hidden', 99999999999999999999);
    expect((comp as any).shouldHide()).toBeTruthy();
  });

  it('should get progress from service', () => {
    let response = { status: 'success' };
    (comp as any).onboarding.progress$ = new BehaviorSubject<any>(response);

    comp.progress$.subscribe(val => {
      expect(val).toBe(response);
    });
  });

  it('should send message through toast service when email verification clicked', () => {
    comp.onTaskClick('VerifyEmailStep');
    expect((comp as any).toast.inform).toHaveBeenCalledWith(
      'Check your inbox for a verification email from us.'
    );
  });

  it('should open composer modal when create a post clicked', () => {
    comp.onTaskClick('CreatePostStep');

    // chain called that presents modal
    expect((comp as any).composerModal.setInjector).toHaveBeenCalledWith(
      (comp as any).injector
    );
  });

  it('should hide and show the widget and change local storage appropriately', () => {
    comp.onHideClick('hide');
    expect(comp.hidden).toBeTruthy();
    expect(storageMock.get('onboarding:widget:hidden')).toBeGreaterThan(
      Date.now()
    );

    comp.onHideClick('show');
    expect(comp.hidden).toBeFalsy();
    expect(storageMock.get('onboarding:widget:hidden')).toBeFalsy();
  });
});
