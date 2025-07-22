import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PanelComponent } from '../../shared/components/panel/panel.component';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  standalone: true,
  imports: [CommonModule, PanelComponent],
})
export class SettingComponent {}
