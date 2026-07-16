import { Component } from '@angular/core';

interface Problem {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-problem',
  standalone: true,
  imports: [],
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent {
}
