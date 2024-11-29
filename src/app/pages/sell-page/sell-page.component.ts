import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Usuario } from '../../auth/usuario';
import Swal from 'sweetalert2';
import { SwalService } from '../../shared/swal.service';
import { GestUserService } from '../../services/gest-user.service';

@Component({
  selector: 'app-sell-page',
  templateUrl: './sell-page.component.html',
  styleUrl: './sell-page.component.css'
})
export class SellPageComponent implements OnInit {

  formVenderCoche: FormGroup;
  years: number[] = [];
  usuarioLogueado: Usuario | null = null;
  selectedFiles: Array<{ file: File | null; url: string }> = [];
  cuadrados: number[] = Array.from({ length: 8 }, (_, i) => i);

  constructor(private fb: FormBuilder, private authService: AuthService,
    private swalService: SwalService, private gestUserService: GestUserService) {
    this.formVenderCoche = this.fb.group({
      marca: '',
      carroceria: '',
      modelo: '',
      anio: '',
      color: '',
      cambio: '',
      kilometros: '',
      autonomia: '',
      potencia: '',
      descripcion: '',
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });

    if (this.usuarioLogueado) {
      this.formVenderCoche.controls['nombre'].disable();
      this.formVenderCoche.controls['email'].disable();
    }
  }

  ngOnInit(): void {
    this.authService.usuario$.subscribe(usuario => {
      this.usuarioLogueado = usuario;
      this.patchDatosUsuario();
    });

    const currentYear = new Date().getFullYear();
    for (let year = 2000; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

  enviarFormulario(): void {
    if (this.formVenderCoche.valid) {
      if (this.formVenderCoche.controls['nombre'].disabled && this.formVenderCoche.controls['nombre'].disabled) {
        this.formVenderCoche.controls['nombre'].enable();
        this.formVenderCoche.controls['email'].enable();
      }

      const formData = new FormData();
      const formValues = this.formVenderCoche.value;
      console.log(formValues)

      for (const key in formValues) {
        if (formValues[key] !== null && formValues[key] !== undefined) {
          formData.append(key, formValues[key]);
        }
      }
      const archivosValidos = this.selectedFiles.filter(item => item.file !== null);
      archivosValidos.forEach((item) => {
        formData.append('imagenes[]', item.file!, item.file!.name);
      });

      this.gestUserService.enviarFormVenta(formData).subscribe(() => {
        this.swalService.mostrarMensaje('Éxito', 'Formulario enviado. Recibirá una copia del mismo en su correo personal', 'success');
        this.resetForm();
        this.selectedFiles = [];
      }, () => {
        this.swalService.mostrarMensaje('Error', 'Hubo un problema al enviar el formulario, inténtalo de nuevo', 'error');
      })
    } else {
      this.swalService.mostrarMensaje('Error', 'Es necesario especificar Nombre y Email para enviar el formulario', 'error');
    }
  }

  resetForm() {
    this.formVenderCoche.reset();
    this.patchDatosUsuario();
  }

  elegirArchivo(index: number) {
    if (!this.selectedFiles[index]?.url) {
      const input = document.getElementById(`imagen${index}`) as HTMLInputElement;
      input.click();
    }
  }

  eliminarImg(index: number, event: Event) {
    event.stopPropagation();
    this.selectedFiles.splice(index, 1);
  }

  onFileSelected(event: Event, index: number) {
    const archivos = event.target as HTMLInputElement;
    if (archivos.files && archivos.files.length > 0) {
      const archivo = archivos.files[0];

      if (this.selectedFiles.length >= 8) {
        this.swalService.mostrarMensaje('Error', 'Se ha alcanzado el límite de 8 imágenes', 'error');
        return;
      }

      const fileExiste = this.selectedFiles.some(
        (selectedFile) => selectedFile.file?.name === archivo.name
      );

      if (fileExiste) {
        this.swalService.mostrarMensaje('Error', 'La imagen ya ha sido seleccionada', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedFiles[index] = { file: archivo, url: e.target?.result as string };
      };
      reader.readAsDataURL(archivo);
    }
  }

  patchDatosUsuario() {
    if (this.usuarioLogueado) {
      this.formVenderCoche.patchValue({
        nombre: this.usuarioLogueado.nombre,
        email: this.usuarioLogueado.email,
      });
      this.formVenderCoche.controls['nombre'].disable();
      this.formVenderCoche.controls['email'].disable();
    }
  }
}
