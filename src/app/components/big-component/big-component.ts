import { Component, inject } from '@angular/core';
import { BigRequest } from '../../services/big-request';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-big-component',
  imports: [JsonPipe, NgIf],
  templateUrl: './big-component.html',
  styleUrl: './big-component.css',
})
export class BigComponent {
  private bigRequestService = inject(BigRequest);

  data: any = {};

  constructor() {
    console.log('BigComponent initialized');
    const start = performance.now();
    // Heavy fake data fetch
    this.data = this.bigRequestService.fetchData();
    console.log('BigComponent data:', this.data);
    console.log('BigComponent loaded slowly after:', performance.now() - start);
  }
}
