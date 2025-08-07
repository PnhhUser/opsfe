import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: '<span class="loader"></span>',
  styleUrl: './loading.component.css',
})
export class LoadingComponent {}
