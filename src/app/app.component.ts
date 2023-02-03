import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, ElementRef, SecurityContext, ViewChild } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { DomSanitizer } from '@angular/platform-browser';
interface VehicleNode {
  name?: string;
  id: number | string;
  children?: VehicleNode[];
  selected?: boolean;
  indeterminate?: boolean;
  parent?: VehicleNode;
}

interface SavedSelection {
  name?: string;
  selections: VehicleSelection[];
}

interface VehicleSelection {
  id: number | string;
  children?: VehicleSelection[];
}

const TREE_DATA: VehicleNode[] = [
  {
    id: "infiniti",
    name: "Infiniti",
    children: [
      {
        id: "g50",
        name: "G50",
        children: [
          { name: "Pure AWD", id: 1 },
          { name: "Luxe", id: 2 }
        ]
      },
      {
        id: "qx50",
        name: "QX50",
        children: [
          { name: "Pure AWD", id: 3 },
          { name: "Luxe", id: 4 }
        ]
      }
    ]
  },
  {
    id: "bmw",
    name: "BMW",
    children: [
      {
        id: "2series",
        name: "2 Series",
        children: [
          { name: "Coupé", id: 5 },
          { name: "Gran Coupé", id: 6 }
        ]
      },
      {
        id: "3series",
        name: "3 Series",
        children: [
          { name: "Sedan", id: 7 },
          { name: "PHEV", id: 8 }
        ]
      }
    ]
  }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-tour-of-heroes';

   treeControl = new NestedTreeControl<VehicleNode>(node => node.children);
   dataSource = new MatTreeNestedDataSource<VehicleNode>();
   saveNameRef: ElementRef<HTMLInputElement>;
   errMsg = '';

  constructor(private sanitizer: DomSanitizer) {
    this.dataSource.data = TREE_DATA;
    this.dataSource.data.forEach(node => {
      this.setParent(node);
    });
  }

   hasChild = (_: number, node: VehicleNode) =>
    !!node.children && node.children.length > 0;

   setParent(node: VehicleNode, parent?: VehicleNode) {
    node.parent = parent;
    if (node.children) {
      node.children.forEach(childNode => {
        this.setParent(childNode, node);
      });
    }
  }


  itemToggle(checked: boolean, node: VehicleNode) {
    node.selected = checked;
    if (node.children) {
      node.children.forEach(child => {
        this.itemToggle(checked, child);
      });
    }
  }
   toggleSelectedNodes(
    vehicleSelections: VehicleSelection[],
    vehicleNodes: VehicleNode[]
  ) {
    vehicleSelections.forEach(selection => {
      const vehicleNode = vehicleNodes.find(
        vehicleNode => vehicleNode.id === selection.id
      );
      if (vehicleNode) {
        if (selection.children) {
          if (vehicleNode.children) {
            this.toggleSelectedNodes(
              selection.children,
              vehicleNode.children
            );
          } else {
            console.warn(`Node with id '${vehicleNode.id}' has no children.`)
          }
        } else {
          this.itemToggle(true, vehicleNode);
        }
      } else {
        console.warn(`Couldn't find vehicle node with id '${selection.id}'`)
      }
    });
  }
}
