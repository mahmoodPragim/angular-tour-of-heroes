import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-site2',
  templateUrl: './site2.component.html',
  styleUrls: ['./site2.component.css']
})
export class Site2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('site2')
  }

}
