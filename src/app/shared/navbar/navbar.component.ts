import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Usuario } from '../../auth/usuario';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit {


  @Output() emitAbrirModal = new EventEmitter<void>();
  usuarioLogueado: Usuario | null = null;
  isMenuVisible: boolean = false; // Estado del menú desplegable


  constructor(private authService: AuthService) {}

  ngOnInit(){
    this.authService.usuario$.subscribe(usuario => {
      this.usuarioLogueado = usuario && usuario.emailVerificado ? usuario : null;
    });
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible; // Cambia el estado al hacer clic
  }

  abrirModal() {
    this.emitAbrirModal.emit();
  }

  logout() {
    this.authService.logout();
  }

}
