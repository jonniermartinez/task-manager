import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators,  } from '@angular/forms';
import { TaskService } from './../../../Services/task.service';
import { Task } from './../../../utils/types';  // Importar interfaces
import { TaskEventService } from './../../../Services/task-event.service';  // Importar el servicio de comunicación

@Component({
  selector: 'app-task-form',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  public myForm: FormGroup;

  constructor(private fb: FormBuilder, private taskService: TaskService, private taskEventService: TaskEventService) {
    this.myForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      limitDate: ['', [Validators.required]],
      associatedPersons: this.fb.array([])
    });
  }

  ngOnInit(): void {}

  // Método para obtener el FormArray de personas asociadas
  get associatedPersons(): FormArray {
    return this.myForm.get('associatedPersons') as FormArray;
  }

  // Método para crear una nueva persona con validaciones en la edad (18-80 años)
  createPerson(): FormGroup {
    return this.fb.group({
      fullName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18), Validators.max(80)]],
      skills: this.fb.array([])
    });
  }

  // Método para agregar una nueva persona al FormArray
  addPerson() {
    this.associatedPersons.push(this.createPerson());
  }

  // Método para eliminar una persona del FormArray
  removePerson(index: number) {
    this.associatedPersons.removeAt(index);
  }

  // Método para obtener el FormArray de habilidades de una persona
  getSkills(personIndex: number): FormArray {
    return this.associatedPersons.at(personIndex).get('skills') as FormArray;
  }

  // Método para agregar una habilidad a una persona
  addSkill(personIndex: number) {
    this.getSkills(personIndex).push(this.fb.control('', Validators.required));
  }

  // Método para eliminar una habilidad de una persona
  removeSkill(personIndex: number, skillIndex: number) {
    this.getSkills(personIndex).removeAt(skillIndex);
  }

  // Validación de campos generales
  isValidField(field: string): boolean | null {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
  }

  // Validación de campos dentro de FormArray
  isValidArrayField(arrayName: string, index: number, field: string): boolean | undefined {
    const formArray = this.myForm.get(arrayName) as FormArray;
    const control = formArray?.at(index)?.get(field);

    return control?.errors !== null && control?.touched ;
  }


  // Obtener mensaje de error para campos del FormArray
  getArrayFieldError(arrayName: string, index: number, field: string): string | null {
    const control = (this.myForm.get(arrayName) as FormArray).at(index).get(field);
    if (!control) return null;
    const errors = control.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'min':
          return `La edad debe ser mayor a 18 años`;
        case 'max':
          return `La edad debe ser menor de 80 años`;
      }
    }
    return 'Este campo es requerido';
  }

  getFieldError(field: string): string | null {
    if (!this.myForm.controls[field]) return null;
    const errors = this.myForm.controls[field].errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
      }
    }
    return 'Este campo es requerido';
  }

  async onSave(): Promise<void> {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    console.log(this.myForm.value);

    const taskData: Task = {
      ...this.myForm.value,
      id: 0,
      completed: false
    };


    this.taskService.saveTaskData(taskData);
    this.taskEventService.notifyTaskAdded();
    // alert('Datos guardados ');
    this.myForm.reset();
  }
}
