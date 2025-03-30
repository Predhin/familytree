import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FamilyTreeComponent } from "./family-tree/family-tree.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FamilyTreeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'familytree';
}
