import supertest from "supertest";
import { server } from "../src";

const mockNewUser = {
  username: "Max",
  age: 22,
  hobbies: ["soccer"],
};

const mockUpdateUser = {
  username: "Alina",
  age: 18,
  hobbies: ["basketball"],
};

describe(" Scenario 1 : all successful requests ", () => {
  let userUuid = "";

  test("should return an empty array", async () => {
    const { statusCode, body } = await supertest(server).get("/api/users");

    expect(body.data).toStrictEqual([]);
    expect(statusCode).toBe(200);
  });

  test("should return newly created user", async () => {
    const { statusCode, body } = await supertest(server)
      .post("/api/users")
      .send(mockNewUser);

    userUuid = body.data.id;

    expect(body.data.username).toBe(mockNewUser.username);
    expect(body.data.age).toBe(mockNewUser.age);
    expect(body.data.hobbies).toStrictEqual(mockNewUser.hobbies);
    expect(statusCode).toBe(201);
  });

  test("should return expected user", async () => {
    const { statusCode, body } = await supertest(server).get(
      `/api/users/${userUuid}`
    );

    expect(body.data.username).toBe(mockNewUser.username);
    expect(body.data.age).toBe(mockNewUser.age);
    expect(body.data.hobbies).toStrictEqual(mockNewUser.hobbies);
    expect(statusCode).toBe(200);
  });

  test("should return newly updated user", async () => {
    const { statusCode, body } = await supertest(server)
      .put(`/api/users/${userUuid}`)
      .send(mockUpdateUser);

    expect(body.data.username).toBe(mockUpdateUser.username);
    expect(body.data.age).toBe(mockUpdateUser.age);
    expect(body.data.hobbies).toStrictEqual(mockUpdateUser.hobbies);
    expect(statusCode).toBe(200);
  });

  test("should delete expected user successfully", async () => {
    const { statusCode } = await supertest(server).delete(
      `/api/users/${userUuid}`
    );

    expect(statusCode).toBe(204);
  });

  test("should return an empty array again after all manipulations", async () => {
    const { statusCode, body } = await supertest(server).get("/api/users");

    expect(body.data).toStrictEqual([]);
    expect(statusCode).toBe(200);
  });
});
