import { Component, DoCheck } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomDirective } from '../../shared/directives/customDirective';
import { CustomPipe } from '../../shared/pipes/customPipe';

interface LocalInterface {
  id: number;
  name: string;
  secretItem: string;
}

@Component({
  selector: 'app-learning',
  imports: [FormsModule, CustomDirective, CustomPipe],
  templateUrl: './learning.html',
  styleUrl: './learning.css',
})
@Logger
export class Learning implements DoCheck {
  username: string = '';
  toggleDirectiveCondition: boolean = true;

  ngDoCheck(): void {
    console.log('Current username:', this.username);
  }

  publicCopy: Omit<LocalInterface, 'secretItem'> = {
    id: 1,
    name: 'Example Name',
  };

  semiCopy: Partial<LocalInterface> = {
    name: 'Partial Name',
  };

  selectedCopy: Pick<LocalInterface, 'id' | 'name'> = {
    id: 2,
    name: 'Picked Name',
  };

  toggle() {
    this.toggleDirectiveCondition = !this.toggleDirectiveCondition;
  }
}

type Message = string | number;

function logMessage(msg: Message) {
  if (typeof msg === 'string') {
    // narrowed to string
    console.log('String length:', msg.length);
  } else {
    // narrowed to number
    console.log('Number squared:', msg * 2);
  }
}

type Person = { name: string };
type Employee = { employeeId: number };

type EmployeePerson = Person & Employee;

const emp: EmployeePerson = {
  name: 'Madhav',
  employeeId: 101,
};

function Logger(constructor: Function) {
  console.log('Logging class:', constructor.name);
}

type User = { name: string; email: string };
type Admin = { name: string; adminCode: string };

function greet(person: User | Admin) {
  if ('adminCode' in person) {
    console.log('Hello Admin:', person.name);
  } else {
    console.log('Hello User:', person.name);
  }
}
