import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.usuario$.pipe(
    take(1), // Se limita la verificación del estado de autenticación
    map(usuario => { // Se toma el valor emitido por usuario$
      if (usuario) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  )
};
