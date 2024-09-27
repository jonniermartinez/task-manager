export interface Skill {
  name: string;
}

export interface Person {
  fullName: string;
  age: number;
  skills: Skill[];
}

export interface Task {
  completed: boolean;
  name: string;
  limitDate: string;
  id: number;
  associatedPersons: Person[];
}
