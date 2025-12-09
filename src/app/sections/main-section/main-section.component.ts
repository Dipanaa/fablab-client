import { Component } from '@angular/core';

import { CarrouselOwnComponent } from './components/carrousel-own/carrousel-own.component';
import { HierarchyTreeComponent } from './components/hierarchy-tree/hierarchy-tree.component';
import { ForUsCardsComponent } from './components/for-us-cards/for-us-cards.component';
import { ProyectsComponent } from './components/projects/pages/best-projects/projects.component';
import { FormsRegisterComponent } from "./components/forms-register/forms-register.component";

@Component({
  selector: 'app-main-section',
  imports: [
    CarrouselOwnComponent,
    HierarchyTreeComponent,
    ForUsCardsComponent,
],
  templateUrl: './main-section.component.html',
})
export class MainSectionComponent {}
