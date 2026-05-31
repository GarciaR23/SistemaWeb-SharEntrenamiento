import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../../layouts/header/header.component";

@Component({
    selector: 'app-instructor',
    imports: [RouterOutlet, HeaderComponent],
    templateUrl: './instructor.html',
    styleUrl: './instructor.scss',
})
export class Instructor {

}
