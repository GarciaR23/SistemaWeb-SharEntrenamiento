import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../../layouts/header/header.component";

@Component({
    selector: 'app-tutor',
    imports: [RouterOutlet, HeaderComponent],
    templateUrl: './tutor.html',
    styleUrl: './tutor.scss',
})
export class Tutor {

}
