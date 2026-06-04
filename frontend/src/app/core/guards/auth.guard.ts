import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(): boolean {
        const roles = ['admin', 'tutor', 'instructor'];

        for (const rol of roles) {
            const token = localStorage.getItem(`authToken_${rol}`);
            if (token) {
                return true;
            }
        }

        this.router.navigate(['/login']);
        return false;
    }
}