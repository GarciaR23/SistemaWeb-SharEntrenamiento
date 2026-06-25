import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { statusGuard } from './core/guards/status.guard';

import { LandingComponent } from './features/landing/landing.component';
import { Login } from './features/auth/login/login.component';
import { RecuperarContrasena } from './features/auth/recuperar-contrasena/recuperar-contrasena.component';
import { TokenContrasena } from './features/auth/token-contrasena/token-contrasena.component';
import { RestaurarContrasena } from './features/auth/restaurar-contrasena/restaurar-contrasena.component';
import { Perfil } from './features/instructor/pages/perfil/perfil.component';
import { Certificado } from './features/instructor/pages/certificado/certificado.component';
import { Cuenta } from './features/instructor/pages/cuenta/cuenta.component';
import { SeleccionRolComponent } from './features/auth/seleccion-rol/seleccion-rol.component';

import { ReporteInstructor } from './features/admin/pages/reporte-instructor/reporte-instructor.component';
import { ReportePaciente } from './features/admin/pages/reporte-paciente/reporte-paciente.component';
import { Inicio as AdminInicio } from './features/admin/pages/dashboard-admin/admin.component';
import { Inicio as InstructorInicio } from './features/instructor/pages/dashboard-instructor/instructor.component';
import { Inicio as TutorInicio } from './features/tutor/pages/dashboard-tutor/tutor.component';
import { Solicitud } from './features/admin/pages/solicitud-registro/solicitud.component';
import { Admin } from './features/admin/admin';
import { Sede } from './features/instructor/pages/sede/sede.component';
import { Bitacora } from './features/instructor/pages/bitacora/bitacora.component';
import { Pago } from './features/instructor/pages/pago/pago.component';
import { Instructor } from './features/instructor/instructor';
import { Tutor } from './features/tutor/tutor';
import { CatalogoInstructor } from './features/tutor/pages/catalogo-instructor/catalogo-instructor.component';
import { Sesion } from './features/tutor/pages/sesion-paciente/sesion-paciente.component';
import { Progreso } from './features/tutor/pages/progreso-paciente/progreso-paciente.component';
import { FormularioTutor } from './features/tutor/pages/formulario-tutor/formulario-tutor.component';
import { Error403 } from './shared/errors/error-403/error-403';
import { Error404 } from './shared/errors/error-404/error-404';
import { Error500 } from './shared/errors/error-500/error-500';
import { ErrorConnection } from './shared/errors/error-connection/error-connection';

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
          { path: 'solicitud-instructor', component: Solicitud },
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
      },

      {
        path: 'error',
        children: [
          { path: '403', component: Error403 },
          { path: '404', component: Error404 },
          { path: '500', component: Error500 },
          { path: 'connection', component: ErrorConnection },
        ]
      },
    ]
  },

  { path: '**', component: Error404 }
];