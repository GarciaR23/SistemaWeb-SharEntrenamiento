import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';

@Component({
  selector: 'app-admin',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
})
export class Admin {

  constructor(
    private router: Router,
    private authApiService: AuthApiService
  ) { }

  logout(): void {
    const sesion = this.authApiService.getSesionActiva();

    if (sesion) {
      localStorage.removeItem(`authToken_${sesion.rol}`);
      localStorage.removeItem(`authUser_${sesion.rol}`);
    }

    this.router.navigate(['/']);
  }
}
