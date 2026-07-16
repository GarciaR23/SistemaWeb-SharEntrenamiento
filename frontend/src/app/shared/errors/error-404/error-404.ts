import { Component } from '@angular/core';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-error-404',
  imports: [],
  templateUrl: './error-404.html',
  styleUrls: ['../errors.scss'],
})
export class Error404 {
  constructor(public errorHandler: ErrorHandlerService) { }
}