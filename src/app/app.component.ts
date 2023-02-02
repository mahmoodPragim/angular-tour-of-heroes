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

  public treeControl = new NestedTreeControl<VehicleNode>(node => node.children);
public dataSource = new MatTreeNestedDataSource<VehicleNode>();
@ViewChild('saveName', {static: true}) 
public saveNameRef: ElementRef<HTMLInputElement>;
public errMsg = '';
public savedSelections: SavedSelection[] = [
  {
    name: "Infiniti Selections",
    selections: [{
      id: "infiniti",
      children: [
        {
          id: "g50",
          children: [ { id: 2 } ]
        },
        { id: "qx50" }
      ]
    }]
  },
  {
    name: "Full Selection",
    selections: [
      { id: "infiniti" },
      { id: "bmw" }
    ]
  },
  {
    name: "BMW Selections",
    selections: [
      {
        id: "bmw",
        children: [
          {
            id: "2series",
            children: [
              { id: 5 }
            ]
          },
          {
            id: "3series",
            children: [
              { id: 8 }
            ]
          }
        ]
      }
    ]
  }
];

constructor(private sanitizer: DomSanitizer) {
  this.dataSource.data = TREE_DATA;
  this.dataSource.data.forEach(node => {
    this.setParent(node);
  });
}

public hasChild = (_: number, node: VehicleNode) =>
  !!node.children && node.children.length > 0;

private setParent(node: VehicleNode, parent?: VehicleNode) {
  node.parent = parent;
  if (node.children) {
    node.children.forEach(childNode => {
      this.setParent(childNode, node);
    });
  }
}

private checkAllParents(node: VehicleNode) {
  if (node.parent) {
    const descendants = this.treeControl.getDescendants(node.parent);
    node.parent.selected = 
      descendants.every(child => child.selected);
    node.parent.indeterminate = 
      descendants.some(child => child.selected);
    this.checkAllParents(node.parent);
  }
}

 itemToggle(checked: boolean, node: VehicleNode) {
  node.selected = checked;
  if (node.children) {
    node.children.forEach(child => {
      this.itemToggle(checked, child);
    });
  }
  this.checkAllParents(node);
}

public save() {
  this.errMsg = '';
  const saveName = this.saveNameRef.nativeElement.value.trim();
  if (saveName === '') {
    this.errMsg = 'Please provide a save name.';
    this.saveNameRef.nativeElement.focus();
  } else {
    this.savedSelections.push({
      name: this.sanitizer.sanitize(SecurityContext.HTML, saveName) as string,
      selections: this.saveSelectedNodes(this.dataSource.data)
    });
  }
}

public loadSelection(index: number) {
  alert("Tune in next week for this feature!");
}

private saveSelectedNodes(vehicleNodes: VehicleNode[]): VehicleSelection[] {
  let vehicleSelections = [] as VehicleSelection[];

  vehicleNodes.forEach(node => {
    if (node.selected || node.indeterminate) { 
      const vehicleSelection: VehicleSelection = { id: node.id };
      if (node.children) {
        vehicleSelection.children = this.saveSelectedNodes(node.children);
      }
      console.log(vehicleSelection)
      vehicleSelections.push(vehicleSelection);
    }
  });
  return vehicleSelections;
}

private toggleSelectedNodes(
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
