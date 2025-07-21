import { Component } from '@angular/core';
import { DescriptionComponent } from '../description/description.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DescriptionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
