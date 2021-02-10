import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';

import {
  ComposerService,
  RemindSubjectValue,
} from '../../services/composer.service';

/**
 * Composer title bar component. It features a label and a dropdown menu
 * with not-that-important options.
 */
@Component({
  selector: 'm-composer__titleBar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'title-bar.component.html',
})
export class TitleBarComponent {
  /**
   * Composer textarea ID
   */
  @Input() inputId: string;

  /**
   * Create blog intent
   */
  @Output('onCreateBlog') onCreateBlogEmitter: EventEmitter<
    void
  > = new EventEmitter<void>();

  remind$: Observable<RemindSubjectValue> = this.service.remind$;

  constructor(protected service: ComposerService) {}

  /**
   * Attachment subject value from service
   */
  get attachment$() {
    return this.service.attachment$;
  }

  /**
   * Is editing? subject value from service
   */
  get isEditing$() {
    return this.service.isEditing$;
  }

  /**
   * Is posting? subject value from service
   */
  get isPosting$() {
    return this.service.isPosting$;
  }

  /**
   * Should "Create Blog" be hidden?
   * @returns { Observable<boolean> } - holds true if 'Create Blog' option should be hidden.
   */
  get hideCreateBlog$(): Observable<boolean> {
    return this.service.hideCreateBlog$;
  }

  /**
   * Clicked Create Blog trigger
   */
  onCreateBlogClick() {
    this.onCreateBlogEmitter.emit();
  }
}
