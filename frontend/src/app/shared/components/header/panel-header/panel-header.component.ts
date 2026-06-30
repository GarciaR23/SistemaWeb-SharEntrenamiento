import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-panel-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './panel-header.component.html',
    styleUrls: ['./panel-header.component.scss']
})
export class PanelHeaderComponent {
    @Input() modo: 'admin' | 'instructor' | 'tutor' = 'admin';
    @Output() logoutClick = new EventEmitter<void>();

    showDropdown = false;

    constructor(private elementRef: ElementRef) { }

    toggleDropdown(event: Event): void {
        event.stopPropagation();
        this.showDropdown = !this.showDropdown;
    }

    emitLogout(): void {
        this.showDropdown = false;
        this.logoutClick.emit();
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.showDropdown = false;
        }
    }
}