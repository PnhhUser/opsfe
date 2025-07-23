import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonLinkComponent } from '../button-link/button-link.component';

interface IRoute {
  name: string;
  url: string;
  styleCss: string;
}

@Component({
  selector: 'app-crud',
  standalone: true,
  templateUrl: './crud.component.html',
  imports: [CommonModule, ButtonLinkComponent],
})
export class CRUDComponent {
  @Input() selectedItem: { id: number } | null = null;
  @Input() name!: string;
  @Input() prefixRouter!: string;

  get routes(): IRoute[] {
    const buttons: IRoute[] = [
      {
        name: 'Add',
        url: `/${this.prefixRouter}/add-${this.name}`,
        styleCss: 'bg-green-500 text-white hover:bg-green-600 w-32',
      },
    ];

    if (this.selectedItem) {
      buttons.push(
        {
          name: 'Update',
          url: `/${this.prefixRouter}/update-${this.name}/${this.selectedItem.id}`,
          styleCss: 'bg-blue-500 text-white hover:bg-blue-600 w-32',
        },
        {
          name: 'Delete',
          url: `/${this.prefixRouter}/delete-${this.name}/${this.selectedItem.id}`,
          styleCss: 'bg-red-500 text-white hover:bg-red-600 w-32',
        }
      );
    }

    return buttons;
  }
}
