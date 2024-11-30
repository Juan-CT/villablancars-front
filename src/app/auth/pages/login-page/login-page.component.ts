import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { SwalService } from '../../../shared/swal.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})

export class LoginPageComponent {

  @Output() aRegistro = new EventEmitter<void>();
  @Output() cerrarModal = new EventEmitter<void>();

  formLogin: FormGroup;
  passwordError: boolean = false;

  constructor(private authService: AuthService, private fb: FormBuilder, private swalService: SwalService) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/)]]
    });
  }

  async loginUsuario() {
    if (this.formLogin.valid) {
      const { email, password } = this.formLogin.value;

      try {
        const emailExiste = await firstValueFrom(this.authService.verificarEmail(email));

        if (emailExiste.exists) {
          await this.authService.login(email, password);
          this.cerrarModal.emit();
        } else {
          this.swalService.mostrarMensajeText(
            'Error', 'El email introducido no está registrado.', 'error'
          );
        }
      } catch (error) {
        console.error("Error en el login:", error);
        this.swalService.mostrarMensajeText(
          'Error', 'El email o contraseña son incorrectos.', 'error'
        );
      }
    }
  }

  verificarLogin() {
    const checkPassword = this.formLogin.get('password');

    if (checkPassword?.invalid) {
      this.passwordError = true;
      setTimeout(() => {
        this.passwordError = false;
      }, 2000);
      return;
    }

    this.loginUsuario();
  }

  irARegistro() {
    this.aRegistro.emit();
  }

}
