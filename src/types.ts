// types.ts
export interface Department {
  id?: number;
  name: string;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  department_id: number;
}