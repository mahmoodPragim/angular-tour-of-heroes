// tree.component.ts
import { Component, Input } from '@angular/core';

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
export class AppComponent {
  data: recur[] = [{value: 'A',children: [{ value: 'B' },{ value: 'C', children: [{ value: 'D' }, { value: 'E' }] }]},{ value: 'F' }
  ];
}
interface recur{
  value: string;
  children?:recur[]
}
