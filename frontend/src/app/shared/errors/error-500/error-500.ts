import { Component } from '@angular/core';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-error-500',
  imports: [],
  templateUrl: './error-500.html',
  styleUrls: ['../errors.scss'],
})
export class Error500 {
  constructor(public errorHandler: ErrorHandlerService) { }
}
