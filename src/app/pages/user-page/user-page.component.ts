import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Usuario } from '../../auth/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})

export class UserPageComponent implements OnInit {
  usuarioLogueado: Usuario | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.usuario$.subscribe(usuario => {
      this.usuarioLogueado = usuario;
    });
  }

  irAdminPage() {
    this.router.navigate(['/admin']);
  }
}
