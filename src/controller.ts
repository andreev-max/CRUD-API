import { v4 } from "uuid";
import { User } from "./interfaces";
import { UUID_REGEXP } from "./constants";

const users: User[] = [];

export function getAllUsers() {
  try {
    return {
      statusCode: 200,
      data: users,
    };
  } catch {
    return {
      statusCode: 500,
      message: "Something went wrong on the server",
    };
  }
}

export function createUser(reqData: string) {
  try {
    const userData = reqData ? JSON.parse(reqData) : {};

    if (
      typeof userData?.age === "number" &&
      typeof userData?.username === "string" &&
      typeof userData?.hobbies === "object"
    ) {
      const createdUser = { ...userData, id: v4() };
      users.push(createdUser);
      return { statusCode: 201, data: createdUser };
    } else {
      return {
        statusCode: 400,
        message: "Incorrect Data for creating new user",
      };
    }
  } catch {
    return {
      statusCode: 500,
      message: "Something went wrong on the server",
    };
  }
}

export function getUserById(uuid: string) {
  try {
    if (uuid.match(UUID_REGEXP)) {
      const foundUser = users.find((user) => user.id === uuid);
      if (foundUser) {
        return {
          statusCode: 200,
          data: foundUser,
        };
      } else {
        return {
          statusCode: 404,
          message: "User with this id does not exist",
        };
      }
    } else {
      return { statusCode: 400, message: "User's id is invalid - not uuid" };
    }
  } catch {
    return {
      statusCode: 500,
      message: "Something went wrong on the server",
    };
  }
}

export function updateUserById(uuid: string, reqData: string) {
  try {
    const userData = reqData ? JSON.parse(reqData) : {};

    if (
      typeof userData?.age === "number" &&
      typeof userData?.username === "string" &&
      typeof userData?.hobbies === "object"
    ) {
      if (uuid.match(UUID_REGEXP)) {
        const foundUser = users.find((user) => user.id === uuid);
        const foundUserIndex = users.findIndex((user) => user.id === uuid);
        if (foundUser) {
          users.splice(foundUserIndex, 1, { ...foundUser, ...userData });
          return {
            statusCode: 200,
            data: { ...foundUser, ...userData },
          };
        } else {
          return {
            statusCode: 404,
            message: "User with this id does not exist",
          };
        }
      } else {
        return { statusCode: 400, message: "User's id is invalid - not uuid" };
      }
    } else {
      return {
        statusCode: 400,
        message: "Incorrect Data for creating new user",
      };
    }
  } catch {
    return {
      statusCode: 500,
      message: "Something went wrong on the server",
    };
  }
}

export function deleteUserById(uuid: string) {
  try {
    if (uuid.match(UUID_REGEXP)) {
      const foundUserIndex = users.findIndex((user) => user.id === uuid);
      if (foundUserIndex > -1) {
        users.splice(foundUserIndex, 1);
        return {
          statusCode: 204,
          message: "User with this id has been deleted from database",
        };
      } else {
        return {
          statusCode: 404,
          message: "User with this id does not exist",
        };
      }
    } else {
      return { statusCode: 400, message: "User's id is invalid - not uuid" };
    }
  } catch {
    return {
      statusCode: 500,
      message: "Something went wrong on the server",
    };
  }
}
