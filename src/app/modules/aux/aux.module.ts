import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { RouterModule, Routes } from '@angular/router';
import { AuxComponent } from './aux.component';
import { AuxPrivacyComponent } from './components/privacy/privacy.component';
import { MarketingModule } from '../marketing/marketing.module';
import { AuxDmcaComponent } from './components/dmca/dmca.component';
import { AuxTermsComponent } from './components/terms/terms.component';
import { AuxRightsComponent } from './components/rights/rights.component';
import { AuxContactComponent } from './components/contact/contact.component';

const AUX_ROUTES: Routes = [
  {
    path: '',
    component: AuxComponent,
    data: {
      ogImage: '/assets/logos/placeholder.jpg',
    },
    children: [
      {
        path: '',
        redirectTo: 'privacy',
      },
      {
        path: 'privacy',
        component: AuxPrivacyComponent,
        data: {
          title: 'Privacy Policy',
          description:
            'This privacy policy is made available for remix under a Creative Commons Sharealike license. Your privacy is important to Minds, Inc. ...',
        },
      },
      {
        path: 'dmca',
        component: AuxDmcaComponent,
        data: {
          title: 'DMCA',
          description:
            'If you believe that material available on our sites infringes on your copyright(s), please notify us by providing a DMCA notice...',
        },
      },
      {
        path: 'terms',
        component: AuxTermsComponent,
        data: {
          title: 'Terms of Service',
          description:
            'We (the people who work with Minds) create free and open source software and run the Minds.com social network...',
        },
      },
      {
        path: 'contact',
        component: AuxContactComponent,
        data: {
          title: 'Contact',
          description:
            'Contact details for press, general enquiries and support, copyright and DMCA, security and vulnerabilities...',
        },
      },
      {
        path: 'billofrights',
        component: AuxRightsComponent,
        data: {
          title: 'Bill of Rights',
          description:
            'Minds is officially adopting the Manila Principles On Intermediary Liability, a digital bill of rights...',
        },
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild(AUX_ROUTES),
    MarketingModule,
  ],
  declarations: [
    AuxComponent,
    AuxPrivacyComponent,
    AuxDmcaComponent,
    AuxTermsComponent,
    AuxRightsComponent,
    AuxContactComponent,
  ],
})
export class AuxModule {}
