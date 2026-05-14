import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-formulario-tutor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-tutor.html',
  styleUrl: './formulario-tutor.scss',
})
export class FormularioTutor {
  paso = 1;

  nombreTutor = '';
  nombrePaciente = '';
  condicion = '';
  gradoAutismo = '';
  genero = '';
  edad: number | null = null;

  protocoloEmergencia = '';
  sensibilidadesSeleccionadas: string[] = [];

  nombreContacto = '';
  telefonoContacto = '';
  relacionContacto = '';

  correo = '';
  contrasena = '';

  constructor(private router: Router) { }

  siguiente() {
    if (this.paso < 4) {
      this.paso++;
    } else {
      this.finalizar();
    }
  }

  atras() {
    if (this.paso > 1) {
      this.paso--;
    }
  }

  toggleSensibilidad(sensibilidad: string) {
    if (this.sensibilidadesSeleccionadas.includes(sensibilidad)) {
      this.sensibilidadesSeleccionadas =
        this.sensibilidadesSeleccionadas.filter(s => s !== sensibilidad);
    } else {
      this.sensibilidadesSeleccionadas.push(sensibilidad);
    }
  }

  estaSeleccionada(sensibilidad: string): boolean {
    return this.sensibilidadesSeleccionadas.includes(sensibilidad);
  }

  finalizar() {
    this.router.navigate(['/tutor']);
  }
}
