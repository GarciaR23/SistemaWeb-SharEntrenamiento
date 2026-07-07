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
import { BitacoraComponent } from './features/instructor/pages/bitacora/bitacora.component';
import { PagoComponent } from './features/instructor/pages/pago/pago.component';
import { Instructor } from './features/instructor/instructor';
import { Tutor } from './features/tutor/tutor';
import { CatalogoInstructor } from './features/tutor/pages/catalogo-instructor/catalogo-instructor.component';
import { ReservaSesion} from './features/tutor/pages/reserva-sesion/reserva-sesion.component';
import { Sesion } from './features/tutor/pages/sesion-paciente/sesion-paciente.component';
import { Progreso } from './features/tutor/pages/progreso-paciente/progreso-paciente.component';
import { FormularioTutor } from './features/tutor/pages/formulario-tutor/formulario-tutor.component';
import { Error403 } from './shared/errors/error-403/error-403';
import { Error404 } from './shared/errors/error-404/error-404';
import { Error500 } from './shared/errors/error-500/error-500';
import { ErrorConnection } from './shared/errors/error-connection/error-connection';
import { PerfilInstructorComponent } from './features/tutor/pages/perfil-instructor/perfil-instructor.component';

export const routes: Routes = [
  { path: '', component: LandingComponent, title: 'Inicio | SharEntrenamiento' },
  { path: 'metodologia', component: LandingComponent, title: 'Metodología | SharEntrenamiento' },
  { path: 'testimonios', component: LandingComponent, title: 'Testimonios | SharEntrenamiento' },
  { path: 'seguridad', component: LandingComponent, title: 'Seguridad | SharEntrenamiento' },
  { path: 'soporte', component: LandingComponent, title: 'Soporte | SharEntrenamiento' },

  {
    path: '',
    canActivate: [statusGuard],
    children: [
      { path: 'login', component: Login, title: 'Iniciar Sesión | SharEntrenamiento' },
      { path: 'seleccion-rol', component: SeleccionRolComponent, title: 'Selección de Rol | SharEntrenamiento' },
      { path: 'recuperar-contrasena', component: RecuperarContrasena, title: 'Recuperar Contraseña | SharEntrenamiento' },
      { path: 'token-contrasena', component: TokenContrasena, title: 'Verificar Token | SharEntrenamiento' },
      { path: 'restaurar-contrasena', component: RestaurarContrasena, title: 'Restaurar Contraseña | SharEntrenamiento' },
      { path: 'formulario', component: Perfil, title: 'Perfil de Instructor | SharEntrenamiento' },
      { path: 'certificado', component: Certificado, title: 'Certificado | SharEntrenamiento' },
      { path: 'cuenta', component: Cuenta, title: 'Configuración de Cuenta | SharEntrenamiento' },
      { path: 'formulario-tutor', component: FormularioTutor, title: 'Perfil de Tutor | SharEntrenamiento' },

      {
        path: 'admin',
        component: Admin,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'inicio', pathMatch: 'full' },
          { path: 'inicio', component: AdminInicio, title: 'Dashboard Admin | SharEntrenamiento' },
          { path: 'solicitud-instructor', component: Solicitud, title: 'Solicitudes de Instructores | SharEntrenamiento' },
          { path: 'reporte-instructor', component: ReporteInstructor, title: 'Reportes de Instructores | SharEntrenamiento' },
          { path: 'reporte-paciente', component: ReportePaciente, title: 'Reportes de Pacientes | SharEntrenamiento' }
        ]
      },

      {
        path: 'instructor',
        component: Instructor,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'inicio', pathMatch: 'full' },
          { path: 'inicio', component: InstructorInicio, title: 'Dashboard Instructor | SharEntrenamiento' },
          { path: 'sede', component: Sede, title: 'Gestión de Sedes | SharEntrenamiento' },
          { path: 'bitacora', component: BitacoraComponent, title: 'Bitácora de Sesiones | SharEntrenamiento' },
          { path: 'pago', component: PagoComponent, title: 'Pagos | SharEntrenamiento' }
        ]
      },

      {
        path: 'tutor',
        component: Tutor,
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'inicio', pathMatch: 'full' },
          { path: 'inicio', component: TutorInicio, title: 'Dashboard Tutor | SharEntrenamiento' },
          { path: 'catalogo-instructor', component: CatalogoInstructor, title: 'Catálogo de Instructores | SharEntrenamiento' },
          { path: 'perfil-instructor/:idInstructor', component: PerfilInstructorComponent },
          { path: 'reserva-sesion', component: ReservaSesion, title: 'Reserva Sesión | SharEntrenamiento' },
          { path: 'sesion', component: Sesion, title: 'Sesiones | SharEntrenamiento' },
          { path: 'progreso', component: Progreso, title: 'Progreso del Paciente | SharEntrenamiento' }
        ]
      },

      {
        path: 'error',
        children: [
          { path: '403', component: Error403, title: 'Acceso Denegado | SharEntrenamiento' },
          { path: '404', component: Error404, title: 'Página no encontrada | SharEntrenamiento' },
          { path: '500', component: Error500, title: 'Error Interno | SharEntrenamiento' },
          { path: 'connection', component: ErrorConnection, title: 'Error de Conexión | SharEntrenamiento' },
        ]
      },
    ]
  },

  { path: '**', component: Error404, title: 'Página no encontrada | SharEntrenamiento' }
];
