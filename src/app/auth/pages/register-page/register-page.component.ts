import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Usuario } from '../../usuario';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  @Output() aLogin = new EventEmitter<void>();
  @Output() cerrarModal = new EventEmitter<void>();

  formRegistro: FormGroup;
  constructor(private authService: AuthService , private fb: FormBuilder) {
    this.formRegistro = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/)]]
    });
  }

  irALogin() {
    this.aLogin.emit();
  }

  async registrarUsuarioFirebase() {
    if (this.formRegistro.valid) {
      const {nombre, email, password} = this.formRegistro.value;
      try {
        const credencialUsuario = await this.authService.registro(nombre, email, password);
        const idFirebase = credencialUsuario?.uid;

        if (idFirebase) {
          const usuario: Usuario = {
            idFirebase: idFirebase,
            nombre: nombre,
            email: email,
            emailVerificado: false,
            rol: ''
          };

          this.authService.guardarUsuario(usuario).subscribe((res) => {
            Swal.fire({
              title: 'Registrado con éxito',
              text: 'Tu cuenta ha sido creada, revisa tu email para validar el registro.',
              icon: 'info',
              confirmButtonText: 'Aceptar',
              background: '#fff',
              color: '#333',
              confirmButtonColor: '#25d366',
              cancelButtonColor: '#ff6b6b',
              customClass: {
                popup: 'swal'
              }
            }).then((res) => {
              if (res.isConfirmed) {
                this.aLogin.emit();
              }
            });

          }, error => console.log("Error al mandar el usuario al backend", error));
        }
      } catch (error) {
        console.error("Error al registrar un nuevo usuario", error);
      }
    }
  }

}
