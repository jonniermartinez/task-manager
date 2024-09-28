import { Injectable } from '@angular/core';
import { Task } from './../utils/types';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private storageKey = 'taskData';
  private idKey = 'taskIdCounter';

  constructor() { }

  saveTaskData(taskData: Task): void {
    const existingTasks: Task[] = this.getAllTasks() || [];
    taskData.id = this.generateUniqueId();
    existingTasks.push(taskData);
    localStorage.setItem(this.storageKey, JSON.stringify(existingTasks));
  }

  getAllTasks(): Task[] | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) as Task[] : null;
  }

  updateTaskData(updatedTask: Task): void {
    let tasks = this.getAllTasks();
    if (tasks) {
      const index = tasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        tasks[index] = updatedTask;
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
      }
    }
  }

  private generateUniqueId(): number {
    const currentId = localStorage.getItem(this.idKey);
    let newId = currentId ? parseInt(currentId, 10) + 1 : 1;
    localStorage.setItem(this.idKey, newId.toString());
    return newId;
  }
}
