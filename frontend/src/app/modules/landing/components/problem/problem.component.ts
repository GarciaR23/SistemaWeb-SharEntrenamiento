import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Problem {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-problem',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})
export class ProblemComponent {
}