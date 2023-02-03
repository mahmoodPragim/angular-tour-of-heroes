// tree.component.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Observable, retry } from 'rxjs';

@Component({
  selector: 'app-tree',
  template: `
    <ul *ngFor="let node of nodes">
      <li>{{ node.value }}</li>
      <app-tree [nodes]="node.children"></app-tree>
    </ul>
  `
})
export class TreeComponent {
  @Input() nodes?: recur[];
}

// app.component.ts
@Component({
  selector: 'app-root',
  template: `
      <app-tree [nodes]="data"></app-tree>
  `
})
export class AppComponent implements OnInit{
  
  constructor(public services:Services){}
  ngOnInit(): void {
    this.services.getTree().subscribe(x=>{
      
      this.data=x
    })
  }
  data: recur[] ;
}
interface recur{
  value: string;
  children?:recur[]
}
@Injectable({
  providedIn: 'root'
}) 
export class Services{
  constructor(private http: HttpClient){}
  getTree():Observable<recur[]>{
   const headers = new HttpHeaders({
    'Content-Type': 'application/json',
          Accept: 'application/json',
   });
    return this.http.get<recur[]>("https://localhost:7150/api/Weather/tree");
  }
}