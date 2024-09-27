import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { TaskManagerRoutingModule } from './task-manager-routing.module';
import { RootComponent } from './pages/root/root.component';
import { TemplateComponent } from './pages/template/template.component';
import { TaskComponent } from './pages/components/task/task.component';
import { TaskTableComponent } from './pages/components/task-table/task-table.component';


@NgModule({
  declarations: [
    RootComponent,
    TemplateComponent,
    TaskComponent,
    TaskTableComponent
  ],
  imports: [
    CommonModule,
    TaskManagerRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class TaskManagerModule { }
