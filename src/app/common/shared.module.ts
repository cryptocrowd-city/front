import { NgModule } from '@angular/core';
import { PageLayoutService } from './layout/page-layout.service';
import { FeaturesService } from '../services/features.service';
import { ConfigsService } from './services/configs.service';
import { SettingsService } from '../modules/settings/settings.service';

@NgModule({
  providers: [
    ConfigsService,
    PageLayoutService,
    FeaturesService,
    SettingsService,
  ],
})
export class SharedModule {}
