// types.ts
export interface Department {
    id?: number;
    name: string;
    manager_id: number;
  }
  
  export interface User {
    id?: number;
    name: string;
    email: string;
    department_id: number;
    password: string;
  }
  
  
  export interface Post {
    id?: number;
    title: string;
    content: string;
    author_id: number;
    created_at: Date;
  }

  export interface Author {
    id?: number;
    name: string;
  }