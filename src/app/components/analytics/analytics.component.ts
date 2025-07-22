import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PanelComponent } from '../../shared/components/panel/panel.component';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  standalone: true,
  imports: [CommonModule, PanelComponent],
})
export class AnalyticsComponent {}
