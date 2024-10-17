import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isMenuVisible: boolean = false; // Estado del menú desplegable
  logueado: boolean = false;

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible; // Cambia el estado al hacer clic
  }
}
