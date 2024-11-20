import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../auth/usuario';
import { GestUserService } from '../../../services/gest-user.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit{


  usuarios: Usuario[] = [];

  constructor(private gestUserService: GestUserService) {

  }

  ngOnInit(): void {
    this.gestUserService.obtenerUsuarios().subscribe(
      (datos) => {
        this.usuarios = datos.usuarios;
      }
    );
  }
}
