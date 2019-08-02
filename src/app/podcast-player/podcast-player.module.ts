import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PodcastPlayerPage } from './podcast-player.page';

const routes: Routes = [
  {
    path: '',
    component: PodcastPlayerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PodcastPlayerPage]
})
export class PodcastPlayerPageModule {}
