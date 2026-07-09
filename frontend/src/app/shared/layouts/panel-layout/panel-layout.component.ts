import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { PanelHeaderComponent } from '../../components/header/panel-header/panel-header.component';

@Component({
  selector: 'app-panel-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, PanelHeaderComponent],
  templateUrl: './panel-layout.component.html',
  styleUrls: ['./panel-layout.component.scss']
})
export class PanelLayoutComponent {
  modo: 'admin' | 'instructor' | 'tutor' = 'admin';
  isSidebarOpen = false;

  constructor(private router: Router) { }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebarOnMobile(): void {
    if (this.isSidebarOpen) {
      this.isSidebarOpen = false;
    }
  }

  handleLogout(): void {
    this.router.navigate(['/login']);
  }
}