import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../auth/usuario';
import { GestUserService } from '../../../services/gest-user.service';
import { Cita } from '../modelo-cita';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit{

  usuarios: Usuario[] = [];
  citasUsuario: Cita[] = [];
  mostrarModal: boolean = false;
  usuarioSeleccionado: Usuario | null = null;

  constructor(private gestUserService: GestUserService) {

  }

  ngOnInit(): void {
    this.gestUserService.obtenerUsuarios().subscribe(
      (datos) => {
        this.usuarios = datos.usuarios;
      }
    );
  }

  verCitas(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario;
    this.gestUserService.obtenerCitasUsuario(usuario.idFirebase).subscribe(
      (datos) => {
        this.citasUsuario = datos.citas;
        this.mostrarModal = true;
      },
      (error) => {
        console.error('Error al obtener las citas del usuario:', error);
      }
    );
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.citasUsuario = [];
    this.usuarioSeleccionado = null;
  }

}
