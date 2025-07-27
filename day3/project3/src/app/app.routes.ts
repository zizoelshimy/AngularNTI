import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactusComponent } from './contactus/contactus.component';
import { ProductComponent } from './product/product.component';
import { NotfoundpageComponent } from './notfoundpage/notfoundpage.component';

export const routes: Routes = [
  {path:'contactus', loadComponent:()=>import('./contactus/contactus.component').then(c=>c.ContactusComponent)},
  {path: '', redirectTo: 'day3/project3/src/app/home', pathMatch: 'full'},
  {path: 'day3/project3/src/app/home', component: HomeComponent},
  {path: 'day3/project3/src/app/aboutus', component: AboutusComponent},
  //{path: 'day3/project3/src/app/contactus', component: ContactusComponent},
  {path: 'day3/project3/src/app/product', component: ProductComponent},
  {path: '**', component: NotfoundpageComponent}
];
