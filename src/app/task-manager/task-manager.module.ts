import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { TaskManagerRoutingModule } from './task-manager-routing.module';
import { RootComponent } from './pages/root/root.component';
import { TaskComponent } from './pages/components/task/task.component';
import { TaskTableComponent } from './pages/components/task-table/task-table.component';
import { TagComponent } from "../components/tag/tag.component";


@NgModule({
  declarations: [
    RootComponent,
    TaskComponent,
    TaskTableComponent
  ],
  imports: [
    CommonModule,
    TaskManagerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    TagComponent
]
})
export class TaskManagerModule { }
