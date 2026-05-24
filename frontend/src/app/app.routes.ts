import { Routes } from '@angular/router';
import { statusGuard } from './core/guards/status.guard';

import { LandingComponent } from './modules/landing/landing.component';
import { Login } from './modules/auth/login/login';
import { RecuperarContrasena } from './modules/auth/recuperar-contrasena/recuperar-contrasena';
import { TokenContrasena } from './modules/auth/token-contrasena/token-contrasena';
import { RestaurarContrasena } from './modules/auth/restaurar-contrasena/restaurar-contrasena';
import { Perfil } from './modules/instructor/perfil/perfil';
import { Certificado } from './modules/instructor/certificado/certificado';
import { Cuenta } from './modules/instructor/cuenta/cuenta';
import { Tutor } from './modules/tutor/tutor/tutor';
import { SeleccionRolComponent } from './modules/auth/seleccion-rol/seleccion-rol';
import { FormularioTutor } from './modules/tutor/formulario-tutor/formulario-tutor';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'metodologia', component: LandingComponent },
  { path: 'testimonios', component: LandingComponent },
  { path: 'seguridad', component: LandingComponent },
  { path: 'soporte', component: LandingComponent },

  {
    path: '',
    canActivate: [statusGuard], 
    children: [
      // Autenticación
      { path: 'login', component: Login },
      { path: 'seleccion-rol', component: SeleccionRolComponent },
      { path: 'recuperar-contrasena', component: RecuperarContrasena },
      { path: 'token-contrasena', component: TokenContrasena },
      { path: 'restaurar-contrasena', component: RestaurarContrasena },

      // Perfiles y formularios de Instructores
      { path: 'formulario', component: Perfil },
      { path: 'certificado', component: Certificado },
      { path: 'cuenta', component: Cuenta },

      // Vistas y formularios de Tutores
      { path: 'tutor', component: Tutor },
      { path: 'formulario-tutor', component: FormularioTutor }
    ]
  },

  { path: '**', redirectTo: '' }
];