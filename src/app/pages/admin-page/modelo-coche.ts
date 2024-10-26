export interface Marca {
  id: number;
  nombre: string;
}

export interface Carroceria {
  id: number;
  nombre: string;
}

export interface Coche {
  id: number;
  marca: Marca;
  carroceria: Carroceria;
  modelo: string;
  anio: number;
  color: string;
  precio: number;
  kilometros: number;
  cilindrada: number;
  potencia: number;
  descripción: string;
}
