import { Component } from '@angular/core';

@Component({
  templateUrl: './root.component.html'
})
export class RootComponent {
  public showModal = false;
  openModal(): void {
    this.showModal = true;
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.showModal = false;
  }
}
