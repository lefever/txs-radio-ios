import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CapsulaPlayerPage } from './capsula-player.page';

const routes: Routes = [
  {
    path: '',
    component: CapsulaPlayerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CapsulaPlayerPage]
})
export class CapsulaPlayerPageModule {}
