import { Component, OnInit } from '@angular/core';
import { TaskService } from './../../../Services/task.service';
import { Task } from './../../../utils/types';
import { Subscription } from 'rxjs';
import { TaskEventService } from '../../../Services/task-event.service';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
})
export class TaskTableComponent implements OnInit {
  public data: Task[] = [];
  public filteredTasks: Task[] = [];
  public currentFilter: string = 'pending';
  private taskAddedSubscription!: Subscription;

  constructor(private taskService: TaskService, private taskEventService: TaskEventService) { }

  ngOnInit(): void {
    this.loadTasks();
    this.applyFilter();

    // estar pendiente al obserbable cuando un form se guarde
    this.taskAddedSubscription = this.taskEventService.taskAdded$.subscribe(() => {
      this.loadTasks();
    });
  }

  loadTasks(): void {
    const taskData = this.getTaskData();
    if (taskData) {
      this.data = taskData;
      this.applyFilter();
    }
  }

  getTaskData(): Task[] | null {
    return this.taskService.getAllTasks();
  }

  toggleTaskCompletion(task: Task): void {
    task.completed = !task.completed;
    this.taskService.updateTaskData(task);

    this.loadTasks();
  }

  applyFilter(): void {
    if (this.currentFilter === 'completed') {
      this.filteredTasks = this.data.filter(task => task.completed);
    } else {
      this.filteredTasks = this.data.filter(task => !task.completed);
    }
  }

  filterTasks(filter: string): void {
    this.currentFilter = filter;
    this.applyFilter();
  }
}
