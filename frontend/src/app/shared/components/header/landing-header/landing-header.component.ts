import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './landing-header.component.html',
  styleUrls: ['./landing-header.component.scss']
})
export class HeaderComponent {
  @Input() modo: 'landing' | 'admin' | 'instructor' | 'tutor' = 'landing';
  @Output() logoutClick = new EventEmitter<void>();

  isMenuOpen = false;
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
