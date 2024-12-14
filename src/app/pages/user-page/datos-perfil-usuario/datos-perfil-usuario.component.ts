import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Usuario } from '../../../auth/usuario';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-datos-perfil-usuario',
  templateUrl: './datos-perfil-usuario.component.html',
  styleUrl: './datos-perfil-usuario.component.css'
})
export class DatosPerfilUsuarioComponent {

  usuarioLogueado: Usuario | null = null;
  cambiarEmailForm: FormGroup;
  cambiarPasswordForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder) {

    this.cambiarEmailForm = this.fb.group({
      nuevoEmail: ['', [Validators.required, Validators.email]]
    });

    this.cambiarPasswordForm = this.fb.group({
      nuevaPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/)]],
      confirmarPassword: ['', Validators.required]
    }, {
      validators: this.passwordsCoinciden('nuevaPassword', 'confirmarPassword')
    });
  }

  ngOnInit() {
    this.authService.usuario$.subscribe(usuario => {
      this.usuarioLogueado = usuario;
    });
  }

  cambiarEmail(): void {
    if (this.cambiarEmailForm.invalid) {
      return;
    }

    const nuevoEmail = this.cambiarEmailForm.value.nuevoEmail;
    this.authService.cambiarEmail(nuevoEmail);
  }

  cambiarPassword(): void {
    if (this.cambiarPasswordForm.invalid) {
      return;
    }

    const nuevaPassword = this.cambiarPasswordForm.value.nuevaPassword;
    this.authService.cambiarPassword(nuevaPassword);
  }

  passwordsCoinciden(pass: string, passRepetida: string) {
    return (group: AbstractControl) => {
      const password = group.get(pass)?.value;
      const confirmarPassword = group.get(passRepetida)?.value;

      if (password !== confirmarPassword) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }
}
