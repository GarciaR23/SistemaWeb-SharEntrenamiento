import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface FooterDialogData {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-footer-info-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer-info-dialog.component.html',
  styleUrls: ['./footer-info-dialog.component.scss'],
})
export class FooterInfoDialogComponent {
  @Input() data: FooterDialogData | null = null;
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
}
