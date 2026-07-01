import { Component, Input, Output, EventEmitter, HostListener, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-panel-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './panel-header.component.html',
    styleUrls: ['./panel-header.component.scss']
})
export class PanelHeaderComponent implements OnInit {
    @Input() modo: 'admin' | 'instructor' | 'tutor' = 'admin';
    @Output() logoutClick = new EventEmitter<void>();

    showDropdown = false;
    fotoPerfil: string = 'assets/icons/default-avatar.png';

    constructor(
        private elementRef: ElementRef,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.cargarFotoPerfil();
    }

    cargarFotoPerfil(): void {
        const userJson = localStorage.getItem(`authUser_${this.modo}`);
        if (!userJson) return;

        const user = JSON.parse(userJson);

        switch (this.modo) {
            case 'instructor':
                const idInstructor = user.idInstructor;
                if (idInstructor) {
                    this.http.get<any>(`http://localhost:8080/api/instructores/${idInstructor}`)
                        .subscribe({
                            next: (data) => this.fotoPerfil = data.urlImagenPerfil || 'assets/icons/default-avatar.png',
                            error: () => this.fotoPerfil = 'assets/icons/default-avatar.png'
                        });
                }
                break;
            case 'tutor':
                const idPaciente = user.idPaciente;
                if (idPaciente) {
                    this.http.get<any>(`http://localhost:8080/api/pacientes/${idPaciente}`)
                        .subscribe({
                            next: (data) => this.fotoPerfil = data.urlImagenPaciente || 'assets/icons/default-avatar.png',
                            error: () => this.fotoPerfil = 'assets/icons/default-avatar.png'
                        });
                }
                break;
            default:
                this.fotoPerfil = 'assets/icons/admin-avatar.png';
        }
    }

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