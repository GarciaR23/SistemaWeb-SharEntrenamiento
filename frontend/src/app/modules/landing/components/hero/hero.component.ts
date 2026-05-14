import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  imports: [CommonModule, RouterLink],
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  isMenuOpen = false;

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
