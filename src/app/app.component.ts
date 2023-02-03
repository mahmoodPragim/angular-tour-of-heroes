import { NestedTreeControl } from '@angular/cdk/tree';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Injectable, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
interface recur {
  value: string;
  children?: recur[];
}
@Injectable({
  providedIn: 'root'
}) 
export class Services{
  constructor(private http: HttpClient){}
  getTree():Observable<recur[]>{
    return this.http.get<recur[]>("https://localhost:7150/api/Weather/tree");
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'angular-tour-of-heroes';

   treeControl = new NestedTreeControl<recur>(node => node.children);
   dataSource = new MatTreeNestedDataSource<recur>();
  constructor(private services: Services) {
  }
  ngOnInit(): void {
      this.services.getTree().subscribe(x=>{
        this.dataSource.data = x;
        
      });
}
   hasChild = (_: number, node: recur) =>
    !!node.children && node.children.length > 0;
}
