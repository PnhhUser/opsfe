import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-button-link',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a
      [routerLink]="isDisabled ? null : url"
      class="px-4 py-2 border rounded-md text-sm font-medium text-center inline-block transition {{
        styleCss ?? 'text-[#16162a] hover:bg-gray-100 w-56'
      }}"
      [class.opacity-50]="isDisabled"
      [class.cursor-not-allowed]="isDisabled"
      (click)="handleClick($event)"
    >
      {{ name }}
    </a>
  `,
})
export class ButtonLinkComponent {
  @Input() url!: string;
  @Input() name!: string;
  @Input() styleCss?: string;
  @Input() isDisabled?: boolean = false;

  constructor(private toastService: ToastService) {}

  handleClick(event: MouseEvent) {
    if (this.isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      this.infoToast();
    }
  }

  infoToast() {
    this.toastService.info(`Bạn không có quyền hạn để vào ${this.name}`);
  }
}
