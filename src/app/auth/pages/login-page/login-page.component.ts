import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})

export class LoginPageComponent {

  @Output() aRegistro = new EventEmitter<void>();
  formLogin: FormGroup;
  passwordError: boolean = false;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/)]]
    });
   }

  loginUsuario() {

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
