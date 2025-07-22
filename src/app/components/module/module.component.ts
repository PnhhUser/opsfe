import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class ModuleComponent {}
