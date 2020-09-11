import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Session } from '../../../../services/session';
import { NewsfeedBoostService } from '../../../newsfeed/newsfeed-boost.service';
import { Router } from '@angular/router';
import { SettingsV2Service } from '../../settings-v2.service';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'm-settingsV2__boostedContent',
  templateUrl: './boosted-content.component.html',
  styleUrls: ['./boosted-content.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2BoostedContentComponent implements OnInit {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();

  init: boolean = false;
  inProgress: boolean = false;
  user;
  settingsSubscription: Subscription;

  form;

  constructor(
    protected cd: ChangeDetectorRef,
    public session: Session,
    // public router: Router,
    // public boostService: NewsfeedBoostService,
    protected settingsService: SettingsV2Service,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.user = this.session.getLoggedInUser();

    this.form = new FormGroup({
      disabled_boost: new FormControl(''),
      boost_autorotate: new FormControl(''),
      boost_rating: new FormControl(''),
    });

    this.settingsSubscription = this.settingsService.settings$.subscribe(
      (settings: any) => {
        console.log('ojm settings sub', settings, settings.disabled_boost);
        this.disabled_boost.setValue(settings.disabled_boost);
        this.boost_autorotate.setValue(settings.boost_autorotate);
        this.boost_rating.setValue(settings.boost_rating);
        this.detectChanges();
      }
    );

    this.init = true;
    this.detectChanges();
  }

  async submit() {
    if (!this.canSubmit()) {
      return;
    }
    try {
      this.inProgress = true;
      this.detectChanges();

      const response: any = await this.settingsService.updateSettings(
        this.user.guid,
        this.form.value
      );
      if (response.status === 'success') {
        this.formSubmitted.emit({ formSubmitted: true });
        this.form.reset();
      }
    } catch (e) {
      this.formSubmitted.emit({ formSubmitted: false, error: e });
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.form.pristine) {
      return true;
    }

    return this.dialogService.confirm('Discard changes?');
  }

  canSubmit(): boolean {
    return !this.inProgress && !this.form.pristine;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
  }

  get disabled_boost() {
    return this.form.get('disabled_boost');
  }

  get boost_autorotate() {
    return this.form.get('boost_autorotate');
  }

  get boost_rating() {
    return this.form.get('boost_rating');
  }

  get plus(): boolean {
    return this.session.getLoggedInUser().plus;
  }
}
