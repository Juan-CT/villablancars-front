import { Usuario } from "../../auth/usuario";
import { Coche } from "./modelo-coche";

export interface Cita {
  id: number;
  usuario: Usuario;
  coche: Coche;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  descripcion?: string;
}
