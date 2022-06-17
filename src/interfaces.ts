export interface DataForNewUser {
  username: string;
  age: number;
  hobbies: string[];
}

export interface ExistingUser extends DataForNewUser {
  id: string;
}
