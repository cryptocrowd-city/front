import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '../../common/common.module';
import { ProService } from './pro.service';
import { ProMarketingComponent } from './marketing.component';
import { ProSubscriptionComponent } from './channel/subscription/subscription.component';
import { ProChannelComponent } from "./channel/channel.component";
import { ProChannelLoginComponent } from "./channel/login/login.component";
import { MindsFormsModule } from "../forms/forms.module";
import { ProChannelListComponent } from "./channel/list/list.component";
import { ProChannelDonateComponent } from './channel/donate/donate.component';
import { ProTileComponent } from "./channel/tiles/media/tile.component";
import { NewsfeedModule } from "../newsfeed/newsfeed.module";
import { ProSettingsComponent } from './settings/settings.component';
import { ProUserMenuComponent } from "./channel/pro-user-menu/pro-user-menu.component";
import { ProChannelFooterComponent } from './channel/footer/footer.component';
import { LegacyModule } from "../legacy/legacy.module";
import { WireModule } from "../wire/wire.module";
import { ProContentModalComponent } from "./channel/content-modal/modal.component";
import { VideoModule } from "../media/components/video/video.module";
import { ProChannelListModal } from './channel/list-modal/list-modal.component';
import { ProChannelHomeComponent } from './channel/home/home.component';
import { ProGroupTileComponent } from "./channel/tiles/group/group-tile.component";
import { ProUnsubscribeModalComponent } from './channel/unsubscribe-modal/modal.component';
import { ProCategoriesComponent } from "./channel/categories/categories.component";
import { BlogView } from "../blogs/view/view";

const routes: Routes = [];

const channelRoute = {
  component: ProChannelComponent,
  children: [
    {
      path: '',
      component: ProChannelHomeComponent,
    },
    {
      path: 'donate',
      component: ProChannelDonateComponent
    },
    {
      path: 'login',
      component: ProChannelLoginComponent
    },
    {
      path: ':type',
      component: ProChannelListComponent,
    },
  ]
};

if (window.Minds.pro) {
  routes.push({
    path: '',
    ...channelRoute
  });
}

routes.push({
  path: 'pro',
  children: [
    {
      path: '',
      component: ProMarketingComponent,
    },
    {
      path: 'settings',
      component: ProSettingsComponent,
    },
    {
      path: ':username',
      ...channelRoute
    },
  ]
});

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    MindsFormsModule,
    NewsfeedModule,
    LegacyModule,
    WireModule,
    VideoModule,
  ],
  providers: [
    ProService,
  ],
  declarations: [
    ProMarketingComponent,
    ProSettingsComponent,
    ProSubscriptionComponent,
    ProTileComponent,
    ProContentModalComponent,
    ProChannelHomeComponent,
    ProCategoriesComponent,
    ProChannelListModal,
    ProChannelComponent,
    ProChannelLoginComponent,
    ProChannelListComponent,
    ProChannelDonateComponent,
    ProUserMenuComponent,
    ProChannelFooterComponent,
    ProGroupTileComponent,
    ProUnsubscribeModalComponent
  ],
  exports: [],
  entryComponents: [
    ProChannelListModal,
    ProUnsubscribeModalComponent,
    BlogView,
  ],
})
export class ProModule {
}
