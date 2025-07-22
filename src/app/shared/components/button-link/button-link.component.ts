import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-button-link',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a
      [routerLink]="url"
      class="px-4 py-2 border rounded-md text-sm font-medium text-center inline-block  transition {{
        styleCss ?? 'text-[#16162a] hover:bg-gray-100 w-56'
      }}"
    >
      {{ name }}
    </a>
  `,
})
export class ButtonLinkComponent {
  @Input() url!: string;
  @Input() name!: string;
  @Input() styleCss?: string;
}
