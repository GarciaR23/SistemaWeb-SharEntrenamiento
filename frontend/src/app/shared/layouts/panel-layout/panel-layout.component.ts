import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { PanelHeaderComponent } from '../../components/header/panel-header/panel-header.component';

@Component({
  selector: 'app-panel-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, PanelHeaderComponent],
  templateUrl: './panel-layout.component.html',
  styleUrls: ['./panel-layout.component.scss']
})
export class PanelLayoutComponent {
  modo: 'admin' | 'instructor' | 'tutor' = 'admin';

  constructor(private router: Router) { }

  handleLogout(): void {
    this.router.navigate(['/login']);
  }
}