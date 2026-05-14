import { Routes } from '@angular/router';
import { LandingComponent } from './modules/landing/landing.component';
import { Login } from './modules/auth/login/login';
import { Perfil } from './modules/instructor/perfil/perfil';
import { Certificado } from './modules/instructor/certificado/certificado';
import { Cuenta } from './modules/instructor/cuenta/cuenta';
import { Tutor } from './modules/tutor/tutor/tutor';
import { SeleccionRolComponent } from './modules/auth/seleccion-rol/seleccion-rol';
import { FormularioTutor } from './modules/tutor/formulario-tutor/formulario-tutor';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'metodologia',
    component: LandingComponent // Será reemplazado por metodologia component
  },
  {
    path: 'testimonios',
    component: LandingComponent // Será reemplazado por testimonios component
  },
  {
    path: 'seguridad',
    component: LandingComponent // Será reemplazado por seguridad component
  },
  {
    path: 'soporte',
    component: LandingComponent // Será reemplazado por soporte component
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'formulario',
    component: Perfil
  },
  {
    path: 'certificado',
    component: Certificado
  },
  {
    path: 'cuenta',
    component: Cuenta
  },
  {
  path: 'tutor',
  component: Tutor
},
{
  path: 'seleccion-rol',
  component: SeleccionRolComponent
},
{ path: 'formulario-tutor',
   component: FormularioTutor
}
];
