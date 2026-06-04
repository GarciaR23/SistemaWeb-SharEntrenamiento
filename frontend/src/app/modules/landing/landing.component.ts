import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { HeroComponent } from './components/hero/hero.component';
import { HeaderComponent } from '../../layouts/header/header.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { ProblemComponent } from './components/problem/problem.component';
import { SolutionComponent } from './components/solution/solution.component';
import { CommunityComponent } from './components/community/community.component';
import { BenefitsComponent } from './components/benefits/benefits.component';
import { FaqComponent } from './components/faq/faq.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    HeaderComponent,
    TestimonialsComponent,
    ProblemComponent,
    SolutionComponent,
    CommunityComponent,
    BenefitsComponent,
    FaqComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        this.scrollToSection(fragment);
      }
    });

    this.route.url.subscribe((segments) => {
      const path = segments[0]?.path;
      if (path) {
        this.scrollToSection(path);
      }
    });
  }

  private scrollToSection(sectionId: string) {
    setTimeout(() => {
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

  // ✅ NUEVO: Redirigir según rol
  irAPanel(rol: 'tutor' | 'instructor'): void {
    const token = localStorage.getItem(`authToken_${rol}`);

    if (token) {
      this.router.navigate([`/${rol}/inicio`]);
    } else {
      this.router.navigate(['/login']);
    }
  }
}