import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {ButtonModule} from "primeng/button";
import {DialogAddEditUserComponent} from "./dialog-add-edit-user/dialog-add-edit-user.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ButtonModule, DialogAddEditUserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  protected visible = true

  onToggleVisible = () => this.visible = !this.visible

}
