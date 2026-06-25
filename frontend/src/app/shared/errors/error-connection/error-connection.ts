import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-error-connection',
  standalone: true,
  templateUrl: './error-connection.html',
  styleUrls: ['../errors.scss'],
})
export class ErrorConnection implements OnInit {
  constructor(public errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    window.addEventListener('online', () => this.errorHandler.volverAlInicio());
  }
}