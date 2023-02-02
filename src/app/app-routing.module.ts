import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteComponent } from './site/site.component';
import { Site2Component } from './site2/site2.component';

const routes: Routes = [
  {path:'site',component:SiteComponent},
  {path:'site2',component:Site2Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
