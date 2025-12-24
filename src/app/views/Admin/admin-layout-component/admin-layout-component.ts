import { Component } from '@angular/core';
import { AdminSideBar } from "../admin-side-bar/admin-side-bar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout-component',
  imports: [AdminSideBar, RouterOutlet],
  templateUrl: './admin-layout-component.html',
  styleUrl: './admin-layout-component.css',
})
export class AdminLayoutComponent {

}
