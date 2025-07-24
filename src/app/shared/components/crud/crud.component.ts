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
        styleCss:
          'px-4 py-2 rounded-md border border-green-500 text-green-600 hover:bg-green-100 font-semibold shadow',
      },
    ];

    if (this.selectedItem) {
      buttons.push(
        {
          name: 'Edit',
          url: `/${this.prefixRouter}/edit-${this.name}/${this.selectedItem.id}`,
          styleCss:
            'px-4 py-2 rounded-md border border-blue-500 text-blue-600 hover:bg-blue-100 font-semibold shadow',
        },
        {
          name: 'Delete',
          url: `/${this.prefixRouter}/delete-${this.name}/${this.selectedItem.id}`,
          styleCss:
            'px-4 py-2 rounded-md border border-red-500 text-red-600 hover:bg-red-100 font-semibold shadow',
        }
      );
    }

    return buttons;
  }
}
