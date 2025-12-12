import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BigRequest {
  http = inject(HttpClient);

  fetchData() : Observable<any> {
    return forkJoin({
      users: this.http.get<any>('https://dummyjson.com/users'),
      posts: this.http.get<any>('https://dummyjson.com/posts'),
      comments: this.http.get<any>('https://dummyjson.com/comments'),
      products: this.http.get<any>('https://dummyjson.com/products'),
      todos: this.http.get<any>('https://dummyjson.com/todos')
    });
  }
}
