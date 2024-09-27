import { Component, OnInit } from '@angular/core';
import { TaskService } from './../../../Services/task.service';
import { Task } from './../../../utils/types';
import { Subscription } from 'rxjs';
import { TaskEventService } from '../../../Services/task-event.service';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css']
})
export class TaskTableComponent implements OnInit {
  public data: Task[] = [];  // Almacena todas las tareas desde el localStorage
  public filteredTasks: Task[] = [];  // Almacena las tareas filtradas según el filtro aplicado
  public currentFilter: string = 'pending';  // Filtro inicial que muestra las tareas pendientes
  private taskAddedSubscription!: Subscription;

  constructor(private taskService: TaskService, private taskEventService: TaskEventService) { }

  ngOnInit(): void {
    this.loadTasks();  // Cargar tareas al iniciar el componente
    this.applyFilter();  // Aplicar filtro inicial

    this.taskAddedSubscription = this.taskEventService.taskAdded$.subscribe(() => {
      this.loadTasks();  // Cargar tareas nuevamente cuando se añada una nueva
    });
  }

  // Método para cargar todas las tareas desde el servicio
  loadTasks(): void {
    const taskData = this.getTaskData();
    if (taskData) {
      this.data = taskData;  // Asigna las tareas a la propiedad `data`
      this.applyFilter();  // Filtra las tareas según el filtro actual
    }
  }

  // Obtener los datos de tareas del servicio
  getTaskData(): Task[] | null {
    return this.taskService.getAllTasks();
  }

  // Método para cambiar el estado de completado de una tarea
  toggleTaskCompletion(task: Task): void {
    task.completed = !task.completed;  // Cambia el estado de completado (true/false)
    this.taskService.updateTaskData(task);  // Actualiza la tarea en localStorage

    // Vuelve a cargar las tareas para reflejar los cambios en la vista automáticamente
    this.loadTasks();
  }

  // Método para aplicar filtros según el estado de las tareas
  applyFilter(): void {
    // Aplica el filtro de acuerdo con el estado actual de `currentFilter`
    if (this.currentFilter === 'completed') {
      this.filteredTasks = this.data.filter(task => task.completed);  // Mostrar solo completadas
    } else {
      this.filteredTasks = this.data.filter(task => !task.completed);  // Mostrar solo pendientes
    }
  }

  // Método para filtrar las tareas según el botón seleccionado
  filterTasks(filter: string): void {
    this.currentFilter = filter;  // Actualizar el filtro actual
    this.applyFilter();  // Aplicar el filtro a las tareas
  }
}
