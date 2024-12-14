import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from '../../shared/swal.service';
import { AuthService } from '../../auth/auth.service';
import { GestUserService } from '../../services/gest-user.service';
import { Usuario } from '../../auth/usuario';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css'
})
export class ContactPageComponent {

  formContacto: FormGroup;
  usuarioLogueado: Usuario | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService,
    private swalService: SwalService, private gestUserService: GestUserService) {

    this.formContacto = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.authService.usuario$.subscribe(usuario => {
      this.usuarioLogueado = usuario;
      this.patchDatosUsuario();
    });

  }

  enviarFormulario() {
    if (this.formContacto.valid) {

      if (this.formContacto.controls['nombre'].disabled && this.formContacto.controls['nombre'].disabled) {
        this.formContacto.controls['nombre'].enable();
        this.formContacto.controls['email'].enable();
      }
      const formValues = this.formContacto.value;

      this.swalService.mostrarMensajeForm('Confirma tus datos', formValues.nombre, formValues.email, 'warning')
        .then((result) => {
          if (result.isConfirmed) {
            this.gestUserService.enviarFormContacto(formValues).subscribe(() => {
              this.swalService.mostrarMensajeText('Éxito', 'Formulario enviado correctamente. Contactaremos contigo lo antes posible', 'success');
              this.resetForm();
            }, () => {
              this.swalService.mostrarMensajeText('Error', 'Hubo un problema al enviar el formulario, inténtalo de nuevo', 'error');
            });
          }
        });
    } else {
      this.swalService.mostrarMensajeText('Error', 'Hay que rellenar todos los campos para enviar el formulario', 'error');
    }
  }

  resetForm() {
    this.formContacto.reset();
    this.patchDatosUsuario();
  }

  patchDatosUsuario() {
    if (this.usuarioLogueado) {
      this.formContacto.patchValue({
        nombre: this.usuarioLogueado.nombre,
        email: this.usuarioLogueado.email,
      });
      this.formContacto.controls['nombre'].disable();
      this.formContacto.controls['email'].disable();
    }
  }
}
