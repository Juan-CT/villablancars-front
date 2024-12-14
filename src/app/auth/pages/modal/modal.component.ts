import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit {

  @Output() cerrar = new EventEmitter<void>();

  vistaLogin: boolean = true;

  ngOnInit() {
    window.addEventListener('keydown', this.manejoTeclaEscape.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.manejoTeclaEscape.bind(this));
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  cambiarVistaRegistrar() {
    this.vistaLogin = false;
  }

  cambiarVistaLogin() {
    this.vistaLogin = true;
  }

  manejoTeclaEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.cerrarModal();
    }
  }

}
