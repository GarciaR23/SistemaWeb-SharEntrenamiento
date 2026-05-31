import { Component } from '@angular/core';
import { HeaderComponent } from "../../layouts/header/header.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-admin',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {

}
