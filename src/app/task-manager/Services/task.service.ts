import { Injectable } from '@angular/core';
import { Task } from './../utils/types';  // Importar la interfaz Task

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private storageKey = 'taskData'; // Clave para almacenar las tareas en localStorage
  private idKey = 'taskIdCounter'; // Clave para almacenar el último ID usado en localStorage

  constructor() { }

  // Método para guardar una nueva tarea en localStorage
  saveTaskData(taskData: Task): void {
    const existingTasks: Task[] = this.getAllTasks() || [];  // Recuperar tareas existentes o inicializar array vacío
    taskData.id = this.generateUniqueId();  // Asignar ID único y consecutivo a la nueva tarea
    existingTasks.push(taskData);  // Agregar la nueva tarea al array de tareas existentes
    localStorage.setItem(this.storageKey, JSON.stringify(existingTasks));  // Guardar el array actualizado en localStorage
  }

  // Método para recuperar todas las tareas de localStorage
  getAllTasks(): Task[] | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) as Task[] : null;
  }

  // Método para actualizar una tarea existente en localStorage
  updateTaskData(updatedTask: Task): void {
    let tasks = this.getAllTasks();
    if (tasks) {
      const index = tasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        tasks[index] = updatedTask;  // Actualiza la tarea en la posición correcta
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));  // Guarda el array actualizado en localStorage
      }
    }
  }

  // Método para generar un ID único y consecutivo
  private generateUniqueId(): number {
    const currentId = localStorage.getItem(this.idKey);
    let newId = currentId ? parseInt(currentId, 10) + 1 : 1;
    localStorage.setItem(this.idKey, newId.toString());
    return newId;
  }
}
