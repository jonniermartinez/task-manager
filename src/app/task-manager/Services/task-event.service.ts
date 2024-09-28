import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskEventService {
  private taskAddedSource = new Subject<void>();

  taskAdded$ = this.taskAddedSource.asObservable();

  notifyTaskAdded(): void {
    this.taskAddedSource.next();
  }
}
