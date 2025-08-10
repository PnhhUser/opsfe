import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="loader" [style]="getLoaderStyles()">
      <span class="loader-inner" [style]="getInnerStyles()"></span>
    </span>
  `,
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color: 'primary' | 'secondary' = 'primary';
  @Input() customColor?: string; // Màu tùy chỉnh

  getLoaderStyles() {
    const size = {
      sm: '50px',
      md: '100px',
      lg: '150px',
    }[this.size];

    const color =
      this.customColor ||
      {
        primary: '#2074da',
        secondary: '#6b7280',
      }[this.color];

    return `
      width: ${size};
      height: ${size};
      border-color: ${color} ${color} transparent;
    `;
  }

  getInnerStyles() {
    const size = {
      sm: '25px',
      md: '50px',
      lg: '75px',
    }[this.size];

    const color =
      this.customColor ||
      {
        primary: '#2074da',
        secondary: '#6b7280',
      }[this.color];

    return `
      width: ${size};
      height: ${size};
      border-color: transparent ${color} ${color};
    `;
  }
}
