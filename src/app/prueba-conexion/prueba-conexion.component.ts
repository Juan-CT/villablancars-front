import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prueba-conexion',
  templateUrl: './prueba-conexion.component.html',
  styleUrl: './prueba-conexion.component.css'
})
export class PruebaConexionComponent implements OnInit {

  message: string | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<{ message: string }>('http://localhost:8000/api/prueba') // Reemplaza con la URL de tu API
      .subscribe({
        next: (response) => {
          this.message = response.message; // Almacena el mensaje en la variable
        },
        error: (error) => {
          console.error('Error al hacer la petición:', error);
        }
      });
  }

}
