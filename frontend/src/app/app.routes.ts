import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { statusGuard } from './core/guards/status.guard';

import { LandingComponent } from './features/landing/landing.component';
import { Login } from './features/auth/login/login';
import { RecuperarContrasena } from './features/auth/recuperar-contrasena/recuperar-contrasena';
import { TokenContrasena } from './features/auth/token-contrasena/token-contrasena';
import { RestaurarContrasena } from './features/auth/restaurar-contrasena/restaurar-contrasena';
import { Perfil } from './features/instructor/perfil/perfil';
import { Certificado } from './features/instructor/certificado/certificado';
import { Cuenta } from './features/instructor/cuenta/cuenta';
import { SeleccionRolComponent } from './features/auth/seleccion-rol/seleccion-rol';

import { ReporteInstructor } from './features/admin/reporte-instructor/reporte-instructor';
import { ReportePaciente } from './features/admin/reporte-paciente/reporte-paciente';
import { Inicio as AdminInicio } from './features/admin/inicio/inicio';
import { Inicio as InstructorInicio } from './features/instructor/inicio/inicio';
import { Inicio as TutorInicio } from './features/tutor/inicio/inicio';
import { Solicitud } from './features/admin/solicitud/solicitud';
import { Admin } from './features/admin/admin';
import { Sede } from './features/instructor/sede/sede';
import { Bitacora } from './features/instructor/bitacora/bitacora';
import { Pago } from './features/instructor/pago/pago';
import { Instructor } from './features/instructor/instructor';
import { Tutor } from './features/tutor/tutor';
import { CatalogoInstructor } from './features/tutor/catalogo-instructor/catalogo-instructor';
import { Sesion } from './features/tutor/sesion/sesion';
import { Progreso } from './features/tutor/progreso/progreso';
import { FormularioTutor } from './features/tutor/formulario-tutor/formulario-tutor';

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