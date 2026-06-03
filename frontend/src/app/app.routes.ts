import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { statusGuard } from './core/guards/status.guard';

import { LandingComponent } from './modules/landing/landing.component';
import { Login } from './modules/auth/login/login';
import { RecuperarContrasena } from './modules/auth/recuperar-contrasena/recuperar-contrasena';
import { TokenContrasena } from './modules/auth/token-contrasena/token-contrasena';
import { RestaurarContrasena } from './modules/auth/restaurar-contrasena/restaurar-contrasena';
import { Perfil } from './modules/instructor/perfil/perfil';
import { Certificado } from './modules/instructor/certificado/certificado';
import { Cuenta } from './modules/instructor/cuenta/cuenta';
import { SeleccionRolComponent } from './modules/auth/seleccion-rol/seleccion-rol';

import { ReporteInstructor } from './modules/admin/reporte-instructor/reporte-instructor';
import { ReportePaciente } from './modules/admin/reporte-paciente/reporte-paciente';
import { Inicio as AdminInicio } from './modules/admin/inicio/inicio';
import { Inicio as InstructorInicio } from './modules/instructor/inicio/inicio';
import { Inicio as TutorInicio } from './modules/tutor/inicio/inicio';
import { Solicitud } from './modules/admin/solicitud/solicitud';
import { Admin } from './modules/admin/admin';
import { Sede } from './modules/instructor/sede/sede';
import { Bitacora } from './modules/instructor/bitacora/bitacora';
import { Pago } from './modules/instructor/pago/pago';
import { Instructor } from './modules/instructor/instructor';
import { Tutor } from './modules/tutor/tutor';
import { CatalogoInstructor } from './modules/tutor/catalogo-instructor/catalogo-instructor';
import { Sesion } from './modules/tutor/sesion/sesion';
import { Progreso } from './modules/tutor/progreso/progreso';
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
      { path: 'login', component: Login },
      { path: 'seleccion-rol', component: SeleccionRolComponent },
      { path: 'recuperar-contrasena', component: RecuperarContrasena },
      { path: 'token-contrasena', component: TokenContrasena },
      { path: 'restaurar-contrasena', component: RestaurarContrasena },
      { path: 'formulario', component: Perfil },
      { path: 'certificado', component: Certificado },
      { path: 'cuenta', component: Cuenta },
      { path: 'formulario-tutor', component: FormularioTutor },

      {
        path: 'admin',
        component: Admin,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'inicio', pathMatch: 'full' },
          { path: 'inicio', component: AdminInicio },
          { path: 'instructores', component: Solicitud },
          { path: 'reporte-instructor', component: ReporteInstructor },
          { path: 'reporte-paciente', component: ReportePaciente }
        ]
      },

      {
        path: 'instructor',
        component: Instructor,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'inicio', pathMatch: 'full' },
          { path: 'inicio', component: InstructorInicio },
          { path: 'sede', component: Sede },
          { path: 'bitacora', component: Bitacora },
          { path: 'pago', component: Pago }
        ]
      },

      {
        path: 'tutor',
        component: Tutor,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'inicio', pathMatch: 'full' },
          { path: 'inicio', component: TutorInicio },
          { path: 'catalogo-instructor', component: CatalogoInstructor },
          { path: 'sesion', component: Sesion },
          { path: 'progreso', component: Progreso }
        ]
      }
    ]
  },

  { path: '**', redirectTo: '' }
];