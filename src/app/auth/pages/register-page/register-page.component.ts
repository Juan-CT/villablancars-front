import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Usuario } from '../../usuario';
import Swal from 'sweetalert2';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from '../../../shared/swal.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  @Output() aLogin = new EventEmitter<void>();
  @Output() cerrarModal = new EventEmitter<void>();

  formRegistro: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder, private swalService: SwalService) {
    this.formRegistro = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/)]],
      repetirPassword: ['', Validators.required]
    },
      {
        validators: this.passwordsCoinciden('password', 'repetirPassword')
      });
  }

  irALogin() {
    this.aLogin.emit();
  }

  async registrarUsuarioFirebase() {
    if (this.formRegistro.valid) {
      const { nombre, email, password } = this.formRegistro.value;
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

          this.authService.guardarUsuario(usuario).subscribe(() => {
            this.swalService.mostrarMensajeText(
              'Registrado con éxito', 'Tu cuenta ha sido creada, revisa tu email para validar el registro.', 'info'
            ).then((res) => {
              if (res.isConfirmed) {
                this.aLogin.emit();
              }
            });

          }, error => console.error("Error al mandar el usuario al backend", error));
        }
      } catch (error) {
        console.error("Error al registrar un nuevo usuario", error);
      }
    }
  }

  passwordsCoinciden(pass: string, passRepetida: string) {
    return (group: AbstractControl) => {
      const password = group.get(pass)?.value;
      const repetirPassword = group.get(passRepetida)?.value;
      console.log('Password:', password, 'Repetir Password:', repetirPassword);
      if (password !== repetirPassword) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

}
