import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import { DropdownComponent } from "../dropdown/dropdown.component";
import { Subject, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: 'm-sort-selector',
  templateUrl: './sort-selector.component.html',
})
export class SortSelectorComponent implements OnInit, OnDestroy, AfterViewInit {
  algorithms: Array<{ id, label, icon?, noPeriod? }> = [
    {
      id: 'hot',
      label: 'Hot',
      icon: 'whatshot',
      noPeriod: true,
    },
    {
      id: 'top',
      label: 'Top',
      icon: 'trending_up',
    },
    {
      id: 'latest',
      label: 'Latest',
      icon: 'timelapse',
      noPeriod: true,
    },
  ];

  periods: Array<{ id, label }> = [
    {
      id: '12h',
      label: '12h',
    },
    {
      id: '24h',
      label: '24h',
    },
    {
      id: '7d',
      label: '7d',
    },
    {
      id: '30d',
      label: '30d',
    },
    {
      id: '1y',
      label: '1y'
    },
  ];

  customTypes: Array<{ id, label, icon? }> = [
    {
      id: 'activities',
      label: 'All',
      icon: 'all_inclusive',
    },
    {
      id: 'images',
      label: 'Images',
      icon: 'photo',
    },
    {
      id: 'videos',
      label: 'Videos',
      icon: 'videocam',
    },
    {
      id: 'blogs',
      label: 'Blogs',
      icon: 'subject',
    },
    {
      id: 'channels',
      label: 'Channels',
      icon: 'people',
    },
    {
      id: 'groups',
      label: 'Groups',
      icon: 'group_work',
    },
  ];

  @Input() algorithm: string;

  @Input() period: string;

  @Input() customType: string;

  @Input() labelClass: string = "m--sort-selector-label";

  @Input() hideCustomTypesOnLatest: string[] = [];

  @Output() onChange: EventEmitter<{ algorithm, period, customType }> = new EventEmitter<{ algorithm, period, customType }>();

  @ViewChild('algorithmDropdown') algorithmDropdown: DropdownComponent;

  @ViewChild('periodDropdown') periodDropdown: DropdownComponent;

  @ViewChild('customTypeDropdown') customTypeDropdown: DropdownComponent;

  expandedAlgorithmDropdown: boolean = true;

  expandedCustomTypeDropdown: boolean = true;

  protected lastWidth: number;

  protected resizeSubscription: Subscription;

  protected resizeSubject: Subject<number> = new Subject<number>();

  constructor(
    protected elementRef: ElementRef
  ) {
  }

  @HostListener('window:resize') _widthDetection() {
    this.resizeSubject.next(Date.now());
  }

  ngOnInit() {
    this.resizeSubscription = this.resizeSubject
      .pipe(debounceTime(1000 / 30))
      .subscribe(() => this.onResize());
  }

  ngAfterViewInit() {
    this.resizeSubject.next(Date.now());
  }

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  onResize() {
    const width = this.elementRef &&
      this.elementRef.nativeElement &&
      this.elementRef.nativeElement.clientWidth;

    if (width && width !== this.lastWidth) {
      this.lastWidth = width;

      this.expandedAlgorithmDropdown = width >= 500;
      this.expandedCustomTypeDropdown = width >= 580;
    }
  }

  setAlgorithm(id: string) {
    if (!this.algorithms.find(algorithm => id === algorithm.id)) {
      console.error('Unknown algorithm');
      return false;
    }

    this.algorithm = id;
    this.emit();

    return true;
  }

  getCurrentAlgorithm() {
    return this.algorithms.find(algorithm => this.algorithm === algorithm.id);
  }

  getCurrentAlgorithmProp(prop: string) {
    const currentAlgorithm = this.getCurrentAlgorithm();

    if (!currentAlgorithm) {
      return '';
    }

    return currentAlgorithm[prop];
  }

  setPeriod(id: string) {
    if (!this.periods.find(period => id === period.id)) {
      console.error('Unknown period');
      return false;
    }

    this.period = id;
    this.emit();

    return true;
  }

  getCurrentPeriod() {
    return this.periods.find(period => this.period === period.id)
  }

  getCurrentPeriodLabel() {
    const currentPeriod = this.getCurrentPeriod();

    if (!currentPeriod) {
      return 'All the time';
    }

    return currentPeriod.label;
  }

  hasCurrentAlgorithmPeriod() {
    const currentAlgorithm = this.getCurrentAlgorithm();

    if (!currentAlgorithm) {
      return false;
    }

    return !currentAlgorithm.noPeriod;
  }

  getCustomTypes() {
    if (this.hideCustomTypesOnLatest && this.algorithm === 'latest') {
      return this.customTypes.filter(customType => this.hideCustomTypesOnLatest.indexOf(customType.id) === -1);
    }

    return this.customTypes;
  }

  setCustomType(id: string) {
    if (!this.customTypes.find(customType => id === customType.id)) {
      console.error('Unknown custom type');
      return false;
    }

    this.customType = id;
    this.emit();

    return true;
  }

  getCurrentCustomType() {
    return this.customTypes.find(customType => this.customType === customType.id)
  }

  getCurrentCustomTypeProp(prop: string) {
    const currentAlgorithm = this.getCurrentCustomType();

    if (!currentAlgorithm) {
      return '';
    }

    return currentAlgorithm[prop];
  }

  emit() {
    this.onChange.emit({
      algorithm: this.algorithm,
      period: this.hasCurrentAlgorithmPeriod() ? this.period : null,
      customType: this.customType,
    });
  }

  closeDropdowns() {
    if (this.algorithmDropdown) {
      this.algorithmDropdown.close();
    }

    if (this.periodDropdown) {
      this.periodDropdown.close();
    }

    if (this.customTypeDropdown) {
      this.customTypeDropdown.close();
    }
  }
}
