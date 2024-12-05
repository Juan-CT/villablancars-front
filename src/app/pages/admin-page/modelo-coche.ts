export interface Marca {
  id: number;
  nombre: string;
}

export interface Carroceria {
  id: number;
  nombre: string;
}

export interface Cambio {
  id: number;
  tipo: string;
}

export interface Coche {
  id: number;
  marca_id: number;
  carroceria_id: number;
  cambio_id: number;
  modelo: string;
  anio: number;
  color: string;
  precio: number;
  kilometros: number;
  autonomia: number;
  potencia: number;
  descripcion: string;
  imagenes?: Imagen[];
}

export interface Imagen {
  url: string;
}
