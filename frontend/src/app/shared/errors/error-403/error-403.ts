import { Component } from '@angular/core';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-error-403',
  imports: [],
  templateUrl: './error-403.html',
  styleUrls: ['../errors.scss'],
})
export class Error403 {
  constructor(public errorHandler: ErrorHandlerService) { }
}
