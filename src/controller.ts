import { users } from "./data";
import { v4 } from "uuid";
import { DataForNewUser } from "./interfaces";

export async function getUsers() {
  return new Promise((resolve, reject) => resolve(users));
}

export async function getUserById(uuid: string) {
  return new Promise((resolve, reject) => {
    const foundUser = users.find((user) => user.id === uuid);

    if (foundUser) {
      resolve(foundUser);
    } else {
      reject(`User with id ${uuid} not found`);
    }
  });
}

export async function createUser(newUser: DataForNewUser) {
  console.log(newUser);
  return new Promise((resolve, reject) => {
    if (
      typeof newUser?.age === "number" &&
      typeof newUser?.username === "string" &&
      typeof newUser?.hobbies === "object"
    ) {
      const createdUser = { ...newUser, id: v4() };
      users.push({ ...newUser, id: v4() });
      resolve(createdUser);
    } else {
      reject(false);
    }
  }).catch(() => {
    return false;
  });
}
