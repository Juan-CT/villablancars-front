import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  modalVisible: boolean = false;
  botonVisible: boolean = false;

  constructor() {}

  abrirModal() {
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  @HostListener("window:scroll", [])
  onVentanaScroll() {
    this.botonVisible = window.scrollY > 500;
  }

  scrollToTop(): void {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

}
