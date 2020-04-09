import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockchainEthModalComponent } from './eth-modal.component';
import { MockService, MockComponent } from '../../../utils/mock';
import { Web3WalletService } from '../web3-wallet.service';
import { ChangeDetectorRef } from '@angular/core';
import { SendWyreService } from '../sendwyre/sendwyre.service';
import { SendWyreConfig } from '../sendwyre/sendwyre.interface';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { SiteService } from '../../../common/services/site.service';
import { Session } from '../../../services/session';
import { siteServiceMock } from '../../notifications/notification.service.spec';

describe('BlockchainEthModalComponent', () => {
  let comp: BlockchainEthModalComponent;
  let fixture: ComponentFixture<BlockchainEthModalComponent>;
  let sendWyreMock: any = MockService(SendWyreService);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BlockchainEthModalComponent,
        MockComponent({
          selector: 'm-modal',
          inputs: [],
        }),
        MockComponent({
          selector: 'input',
          inputs: ['ngModel'],
        }),
      ],
      providers: [
        {
          provide: Web3WalletService,
          useValue: MockService(Web3WalletService),
        },
        {
          provide: ChangeDetectorRef,
          useValue: MockService(ChangeDetectorRef),
        },
        {
          provide: SendWyreService,
          useValue: sendWyreMock,
        },
        {
          provide: Session,
          useValue: sessionMock,
        },
        {
          provide: SiteService,
          useValue: siteServiceMock,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;

    fixture = TestBed.createComponent(BlockchainEthModalComponent);

    comp = fixture.componentInstance;

    this.hasMetamask = true;
    spyOn(comp.session, 'getLoggedInUser').and.returnValue({
      eth_wallet: '0x',
    });
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

  it('should instantiate modal', () => {
    expect(comp).toBeTruthy();
  });

  it('should redirect when buy clicked', () => {
    comp.usd = 40;
    siteServiceMock.baseUrl = 'https://www.minds.com/';

    comp.buy();

    expect(sendWyreMock.redirect).toHaveBeenCalledWith({
      paymentMethod: 'debit-card',
      accountId: 'AC_TNCD9GVCFA9',
      dest: 'ethereum:0x',
      destCurrency: 'ETH',
      sourceAmount: '40',
      redirectUrl: 'https://www.minds.com/token',
      failureRedirectUrl: 'https://www.minds.com/token?purchaseFailed=true',
    });
  });
});