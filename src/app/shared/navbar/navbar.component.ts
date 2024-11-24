import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Usuario } from '../../auth/usuario';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit {


  @Output() emitAbrirModal = new EventEmitter<void>();
  usuarioLogueado: Usuario | null = null;
  isMenuAppVisible: boolean = false;
  isMenuUserVisible: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(){
    this.authService.usuario$.subscribe(usuario => {
      this.usuarioLogueado = usuario && usuario.emailVerificado ? usuario : null;
    });
  }

  toggleAppMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isMenuAppVisible = !this.isMenuAppVisible;
    if (this.isMenuUserVisible) {
      this.isMenuUserVisible = !this.isMenuUserVisible;
    }
  }

  toggleUserMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isMenuUserVisible = !this.isMenuUserVisible;
    if (this.isMenuAppVisible) {
      this.isMenuAppVisible = !this.isMenuAppVisible;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Cierra el menú de la app si se hace clic fuera de él
    if (this.isMenuAppVisible && !target.closest('.app-menu')) {
      this.isMenuAppVisible = false;
    }

    // Cierra el menú del usuario si se hace clic fuera de él
    if (this.isMenuUserVisible && !target.closest('.user-menu')) {
      this.isMenuUserVisible = false;
    }
  }

  abrirModal() {
    this.emitAbrirModal.emit();
  }

  async logout() {
    await this.authService.logout();
    this.isMenuUserVisible = false;
    this.router.navigate(['/']);
  }

}
