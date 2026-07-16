import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  imports: [],
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  isMenuOpen = false;

  constructor(private router: Router) { }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  irAPanel(rol: 'tutor' | 'instructor'): void {
    const token = localStorage.getItem(`authToken_${rol}`);

    if (token) {
      this.router.navigate([`/${rol}/inicio`]);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
