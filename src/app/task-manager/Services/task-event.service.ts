// src/app/services/task-event.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskEventService {
  private taskAddedSource = new Subject<void>();

  // Observable para que otros componentes se suscriban
  taskAdded$ = this.taskAddedSource.asObservable();

  // Método para notificar que se ha añadido una tarea
  notifyTaskAdded(): void {
    this.taskAddedSource.next();
  }
}
