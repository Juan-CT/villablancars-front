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
  isMenuAppVisible: boolean = false; // Estado del menú desplegable
  isMenuUserVisible: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(){
    this.authService.usuario$.subscribe(usuario => {
      this.usuarioLogueado = usuario && usuario.emailVerificado ? usuario : null;
    });
  }

  toggleAppMenu() {
    this.isMenuAppVisible = !this.isMenuAppVisible; // Cambia el estado al hacer clic
    if (this.isMenuUserVisible) {
      this.isMenuUserVisible = !this.isMenuUserVisible;
    }
  }

  toggleUserMenu() {
    this.isMenuUserVisible = !this.isMenuUserVisible;
    if (this.isMenuAppVisible) {
      this.isMenuAppVisible = !this.isMenuAppVisible;
    }
  }

  abrirModal() {
    this.emitAbrirModal.emit();
  }

  logout() {
    this.authService.logout();
  }

}
