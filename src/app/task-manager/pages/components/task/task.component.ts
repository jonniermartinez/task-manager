import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TaskService } from './../../../Services/task.service';
import { Task } from './../../../utils/types';
import { TaskEventService } from './../../../Services/task-event.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task.component.html',
  styleUrls: []
})
export class TaskComponent implements OnInit {

  public myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private taskEventService: TaskEventService
  ) {
    this.myForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      limitDate: ['', [Validators.required]],
      associatedPersons: this.fb.array([], this.validateUniqueNamesAndSkills) // Aplicar validador personalizado
    });
  }

  ngOnInit(): void { }

  get associatedPersons(): FormArray {
    return this.myForm.get('associatedPersons') as FormArray;
  }

  createPerson(): FormGroup {
    return this.fb.group({
      fullName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18), Validators.max(80)]],
      skills: this.fb.array([], this.validateSkills) // Aplicar validador de habilidades
    });
  }

  addPerson() {
    this.associatedPersons.push(this.createPerson());
  }

  removePerson(index: number) {
    this.associatedPersons.removeAt(index);
  }

  getSkills(personIndex: number): FormArray {
    return this.associatedPersons.at(personIndex).get('skills') as FormArray;
  }

  addSkill(personIndex: number) {
    this.getSkills(personIndex).push(this.fb.control('', Validators.required));
  }

  removeSkill(personIndex: number, skillIndex: number) {
    this.getSkills(personIndex).removeAt(skillIndex);
  }

  validateUniqueNamesAndSkills(control: AbstractControl): ValidationErrors | null {
    const personsArray = control as FormArray;
    const names = personsArray.controls.map(person => person.get('fullName')?.value);
    const uniqueNames = new Set(names);

    if (uniqueNames.size !== names.length) {
      return { nonUniqueNames: 'Los nombres no pueden repetirse entre las personas asociadas a la tarea.' };
    }

    for (let i = 0; i < personsArray.controls.length; i++) {
      const person = personsArray.at(i);
      const skills = person.get('skills') as FormArray;
      if (skills.length === 0) {
        return { noSkills: `Cada persona debe tener al menos una habilidad.` };
      }
    }

    return null;
  }

  validateSkills(control: AbstractControl): ValidationErrors | null {
    const skillsArray = control as FormArray;
    if (skillsArray.length === 0) {
      return { noSkills: 'Cada persona debe tener al menos una habilidad.' };
    }
    return null;
  }

  isValidField(field: string): boolean | null {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
  }

  isValidArrayField(arrayName: string, index: number, field: string): boolean | undefined {
    const formArray = this.myForm.get(arrayName) as FormArray;
    const control = formArray?.at(index)?.get(field);

    return control?.errors !== null && control?.touched;
  }

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
        case 'noSkills':
          return 'Cada persona debe tener al menos una habilidad.';
        case 'nonUniqueNames':
          return 'Los nombres no pueden repetirse entre las personas asociadas a la tarea.';
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
      this.myForm.markAllAsTouched(); // Marca todos los controles como tocados
      console.log(this.myForm); // Revisa los errores en la consola
      return;
    }

    const taskData: Task = {
      ...this.myForm.value,
      id: 0,
      completed: false
    };

    this.taskService.saveTaskData(taskData);
    this.taskEventService.notifyTaskAdded();
    this.myForm.reset();
  }
}
