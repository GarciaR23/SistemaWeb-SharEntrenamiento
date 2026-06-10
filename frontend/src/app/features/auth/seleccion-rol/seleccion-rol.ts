import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from "../../../shared/components/header/header.component";

@Component({
  selector: 'app-seleccion-rol',
  standalone: true,
  imports: [RouterLink, HeaderComponent],
  templateUrl: './seleccion-rol.html',
  styleUrls: ['./seleccion-rol.scss']
})
export class SeleccionRolComponent {

  constructor(private router: Router) { }

  seleccionarRol(rol: string) {
    localStorage.setItem('rolSeleccionado', rol);

    if (rol === 'TUTOR') {
      this.router.navigate(['/formulario-tutor']);
    } else {
      this.router.navigate(['/formulario']);
    }
  }
}