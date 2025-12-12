import { Pipe } from '@angular/core';

@Pipe({
  name: 'addDash',
})
export class CustomPipe {
  transform(value: string): string {
    return value.split(' ').join('-');
  }
}
