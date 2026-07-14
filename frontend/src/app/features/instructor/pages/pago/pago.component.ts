import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss'],
})
export class Pago implements OnInit {
  balanceTotal = 0;
  proximaLiquidacion = '';

  pagosRecibidos = 0;
  enProceso = 0;
  incidencias = 0;

  transacciones: any[] = [];

  ngOnInit(): void {
    // AQUÍ luego llamarás a tu API
    this.cargarDatos();
  }

  cargarDatos() {
    // Simula backend vacío
    this.transacciones = [];

    this.balanceTotal = 0;
    this.pagosRecibidos = 0;
    this.enProceso = 0;
    this.incidencias = 0;
    this.proximaLiquidacion = '';
  }
}
