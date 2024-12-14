import { inject} from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.usuario$.pipe(
    map(usuario => {
      if (usuario && usuario.rol === 'admin') {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
}
