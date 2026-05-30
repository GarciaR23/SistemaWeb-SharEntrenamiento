import { inject } from '@angular/core';
import { CanActivateFn} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export const statusGuard: CanActivateFn = async () => {
    const http = inject(HttpClient);

    const urlStatus = 'http://localhost:8080/api/public/status';

    try {
        await firstValueFrom(http.get(urlStatus));
        console.log("[ACTIVO] El Backend está operativo");
        return true;
    } catch (error) {
        console.log('[BLOQUEO] Se detectó interrupciones en el backend o la base de datos.', error);
        console.log('Servicio temporalmente no disponible');
        return false;
    }
};