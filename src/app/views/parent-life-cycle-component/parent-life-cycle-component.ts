import { Component } from '@angular/core';
import { LifeCycleComponent } from '../life-cycle-component/life-cycle-component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-parent-life-cycle-component',
  imports: [LifeCycleComponent, FormsModule],
  templateUrl: './parent-life-cycle-component.html',
  styleUrl: './parent-life-cycle-component.css',
})
export class ParentLifeCycleComponent {
  username: string = 'username';

  childReply: string = '';  

  handleReply(message: string) {
    this.childReply = message;
  }
}
