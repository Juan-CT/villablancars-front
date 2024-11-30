import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarServiceService } from '../../../services/car-service.service';
import { Cambio, Carroceria, Coche, Marca } from '../modelo-coche';
import { SwalService } from '../../../shared/swal.service';

@Component({
  selector: 'app-coches',
  templateUrl: './coches.component.html',
  styleUrl: './coches.component.css'
})
export class CochesComponent implements OnInit {

  listarSelec: boolean = false;
  crearSelec: boolean = false;
  editarSelec: boolean = false;
  anios: number[] = [];
  cuadrados: number[] = Array.from({ length: 8 }, (_, i) => i);
  selectedFiles: Array<{ file: File | null; url: string }> = [];
  marcas: Marca[] = [];
  carrocerias: Carroceria[] = [];
  coches: Coche[] = [];
  cambios: Cambio[] = [
    { id: 1, tipo: 'Automático' },
    { id: 2, tipo: 'Manual' }
  ];

  formCrearCoche: FormGroup;

  constructor(private fb: FormBuilder, private carService: CarServiceService,
    private swalService: SwalService
  ) {
    const anioActual = new Date().getFullYear();

    this.formCrearCoche = this.fb.group({
      id: [null],
      marca: ['', Validators.required],
      carroceria: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: ['', [Validators.required, Validators.min(2000), Validators.max(anioActual)]],
      color: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      cambio: ['', [Validators.required]],
      kilometros: ['', [Validators.required, Validators.min(0), Validators.max(999999)]],
      autonomia: ['', [Validators.required, Validators.min(0), Validators.max(1500)]],
      potencia: ['', [Validators.required, Validators.min(0), Validators.max(2000)]],
      descripcion: ['', Validators.required],
      imagen: ['']
    });

    const currentYear: number = new Date().getFullYear();
    for (let anio = 2000; anio <= currentYear; anio++) {
      this.anios.push(anio);
    }
  }

  ngOnInit(): void {
    this.carService.obtenerMarcasCarrocerias().subscribe(
      (datos) => {
        this.marcas = datos.marcas;
        this.carrocerias = datos.carrocerias;
      }, (error) => {
        console.error('Error al obtener los datos', error);
      }
    );
  }

  mostrarCrear() {
    this.editarSelec = false;
    this.resetForm();
    this.selectedFiles = [];
    this.listarSelec = false;
    this.crearSelec = true;
  }

  mostrarListar() {
    this.listarSelec = true;
    this.crearSelec = false;
    this.obtenerCochesExistentes();
  }

  editarCoche(coche_id: number) {
    this.listarSelec = false;
    this.crearSelec = true;
    this.editarSelec = true;
    const cocheAEditar: Coche = this.coches.find((c) => c.id === coche_id)!;
    if (cocheAEditar) {
      this.formCrearCoche.patchValue({
        id: cocheAEditar.id,
        marca: cocheAEditar.marca_id,
        carroceria: cocheAEditar.carroceria_id,
        modelo: cocheAEditar.modelo,
        anio: cocheAEditar.anio,
        color: cocheAEditar.color,
        precio: Number(cocheAEditar.precio),
        cambio: cocheAEditar.cambio_id,
        kilometros: Number(cocheAEditar.kilometros),
        autonomia: Number(cocheAEditar.autonomia),
        potencia: Number(cocheAEditar.potencia),
        descripcion: cocheAEditar.descripcion
      });

      this.selectedFiles = [];
      cocheAEditar.imagenes?.forEach((imagen, index) => {
        if (index < 8) {
          this.selectedFiles[index] = { file: null, url: imagen.url };
        }
      });
    }
  }

  eliminarcoche(coche_id: number) {
    this.swalService.mostrarMensajeText(
      'Eliminar Coche', '¿Está seguro de que quiere eliminar el coche seleccionado?', 'info', true)
      .then((result) => {
        if (result.isConfirmed) {
          this.carService.eliminarCoche(coche_id).subscribe(
            () => {
              this.swalService.mostrarMensajeText('Éxito', 'Coche eliminado correctamente.', 'success');
              this.obtenerCochesExistentes();
            },
            () => this.swalService.mostrarMensajeText('Error', 'Ha surgido un error al eliminar el coche.', 'error')
          );
        }
      })
  }

  obtenerCochesExistentes() {
    this.editarSelec = false;
    this.carService.obtenerCoches().subscribe(
      (coches) => {
        this.coches = coches;
      }, (error) => {
        console.error('Error al obtener los coches existentes', error);
      }
    )
  }

  guardarCoche() {
    const formValues = this.formCrearCoche.value;
    const formData = new FormData();

    formData.append('marca_id', Number(formValues.marca).toString());
    formData.append('carroceria_id', Number(formValues.carroceria).toString());
    formData.append('cambio_id', Number(formValues.cambio).toString());
    formData.append('modelo', formValues.modelo);
    formData.append('anio', Number(formValues.anio).toString());
    formData.append('color', formValues.color);
    formData.append('precio', formValues.precio.toString());
    formData.append('kilometros', formValues.kilometros.toString());
    formData.append('autonomia', formValues.autonomia.toString());
    formData.append('potencia', formValues.potencia.toString());
    formData.append('descripcion', formValues.descripcion);

    const archivosValidos = this.selectedFiles.filter(item => item.file !== null);
    archivosValidos.forEach((item) => {
      formData.append('imagenes[]', item.file!, item.file!.name);
    });

    this.swalService.mostrarMensajeCrearCoche(this.marcas, this.carrocerias, this.cambios, formValues)
      .then((result) => {
        if (result.isConfirmed) {
          this.carService.crearCoche(formData).subscribe(() => {
            this.swalService.mostrarMensajeText('Éxito', 'El coche ha sido guardado correctamente.', 'success');
            this.resetForm();
            this.mostrarListar();
          }, (error) => {
            if (error.status === 422) {
              this.swalService.mostrarMensajeText('Error', 'Uno o varios datos introducidos no cumplen la validación.', 'error');
            } else {
              this.swalService.mostrarMensajeText('Error', 'Ocurrió un problema al guardar el coche.', 'error');
            }
          });
        }
      });
  }

  modificarCoche() {
    const formValues = this.formCrearCoche.value;
    const cocheSinCambios = this.coches.find((c) => c.id === formValues.id)!;
    const formData = new FormData();

    formData.append('_method', 'PUT');
    formData.append('marca_id', Number(formValues.marca).toString());
    formData.append('carroceria_id', Number(formValues.carroceria).toString());
    formData.append('cambio_id', Number(formValues.cambio).toString());
    formData.append('modelo', formValues.modelo);
    formData.append('anio', Number(formValues.anio).toString());
    formData.append('color', formValues.color);
    formData.append('precio', formValues.precio.toString());
    formData.append('kilometros', formValues.kilometros.toString());
    formData.append('autonomia', formValues.autonomia.toString());
    formData.append('potencia', formValues.potencia.toString());
    formData.append('descripcion', formValues.descripcion);

    const archivosValidos = this.selectedFiles.filter(item => item.file !== null);
    archivosValidos.forEach((item) => {
      formData.append('imagenes[]', item.file!, item.file!.name);
    });

    this.swalService.mostrarMensajeEditarCoche(
      this.marcas, this.carrocerias, this.cambios, formValues, cocheSinCambios)
      .then((result) => {
        if (result.isConfirmed) {
          this.carService.editarCoche(formData, cocheSinCambios.id).subscribe(() => {
            this.swalService.mostrarMensajeText('Éxito', 'El coche ha sido guardado correctamente.', 'success');
            this.resetForm();
            this.mostrarListar();
          }, (error) => {
            if (error.status === 422) {
              this.swalService.mostrarMensajeText('Error', 'Uno o varios datos introducidos no cumplen la validación.', 'error');
            } else {
              this.swalService.mostrarMensajeText('Error', 'Ocurrió un problema al guardar el coche.', 'error');
            }
          });
        }
      });
  }

  resetForm() {
    this.formCrearCoche.reset();
  }

  getNombreMarca(marca_Id: number): string {
    const marca = this.marcas.find((m) => m.id === marca_Id);
    return marca ? marca.nombre : '-';
  }

  getNombreCarroceria(carroceria_Id: number): string {
    const carroceria = this.carrocerias.find((c) => c.id === carroceria_Id);
    return carroceria ? carroceria.nombre : '-';
  }

  getTipoCambio(cambio_Id: number): string {
    const cambio = this.cambios.find((c) => c.id === cambio_Id);
    return cambio ? cambio.tipo : '-';
  }

  elegirArchivo(index: number) {
    if (!this.selectedFiles[index]?.url) {
      const input = document.getElementById(`imagen${index}`) as HTMLInputElement;
      input.click();
    }
  }

  eliminarImg(index: number) {
    const urlImagen = this.selectedFiles[index].url;
    const urlAEliminar = urlImagen.replace('http://127.0.0.1:8000', '');

    this.swalService.mostrarMensajeText(
      'Eliminar imagen', '¿Está seguro de que quiere eliminar la imagen seleccionada?', 'info'
    ).then((result) => {
      if (result.isConfirmed) {
        this.carService.eliminarImagen(urlAEliminar).subscribe(() => {
          this.selectedFiles.splice(index, 1);
          this.swalService.mostrarMensajeText('Éxito', 'Imagen eliminada correctamente.', 'success');
        }, () => {
          this.swalService.mostrarMensajeText('Error', 'Ocurrió un problema al eliminar la imagen.', 'error');
        });
      }
    });
  }

  onFileSelected(event: Event, index: number) {
    const archivos = event.target as HTMLInputElement;
    if (archivos.files && archivos.files.length > 0) {
      const archivo = archivos.files[0];

      if (this.selectedFiles.length >= 8) {
        this.swalService.mostrarMensajeText('Error', 'Se ha alcanzado el límite de 8 imágenes.', 'error');
        return;
      }

      const fileExiste = this.selectedFiles.some(
        (selectedFile) => selectedFile.file?.name === archivo.name
      );

      if (fileExiste) {
        this.swalService.mostrarMensajeText('Error', 'La imagen ya ha sido seleccionada.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedFiles[index] = { file: archivo, url: e.target?.result as string };
      };
      reader.readAsDataURL(archivo);
    }
  }

}
