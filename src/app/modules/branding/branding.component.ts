import { Component } from '@angular/core';
import { ConfigsService } from '../../common/services/configs.service';

@Component({
  selector: 'm-branding',
  templateUrl: 'branding.component.html',
  styleUrls: ['./branding.component.ng.scss'],
})
export class BrandingComponent {
  readonly cdnAssetsUrl: string;
  constructor(public configs: ConfigsService) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }
}
