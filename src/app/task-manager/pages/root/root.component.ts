import { Component } from '@angular/core';

@Component({
  templateUrl: './root.component.html',
  styleUrl: './root.component.css'
})
export class RootComponent {
  public showModal = true;
  openModal(): void {
    this.showModal = true;
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.showModal = false;
  }
}
