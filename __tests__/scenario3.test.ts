import supertest from "supertest";

import { server } from "../src";

const mockNewUser = {
  name: "Max",
  age: 22,
  hobbies: ["soccer"],
};

const mockUpdateUser = {
  username: "Alina",
  age: 18,
  hobbies: ["basketball"],
};

const fakeUserUuid = "i2fu9823ufuh34fg82347fghiu34rhf322";

describe(" Scenario 3 : all incorrect requets ", () => {
  test("should return expected message and 400 status for create wrong user's data", async () => {
    const { statusCode, body } = await supertest(server)
      .post("/api/users")
      .send(mockNewUser);

    expect(body.message).toBe("Incorrect Data for creating new user");
    expect(statusCode).toBe(400);
  });

  test("should return expected message and 400 status for get wrong user's uuid", async () => {
    const { statusCode, body } = await supertest(server).get(
      `/api/users/${fakeUserUuid}`
    );

    expect(body.message).toBe("User's id is invalid - not uuid");
    expect(statusCode).toBe(400);
  });

  test("should return expected message and 400 status for update wrong user's uuid", async () => {
    const { statusCode, body } = await supertest(server)
      .put(`/api/users/${fakeUserUuid}`)
      .send(mockUpdateUser);

    expect(body.message).toBe("User's id is invalid - not uuid");
    expect(statusCode).toBe(400);
  });

  test("should return expected message and 400 status for delete wrong user's uuid", async () => {
    const { statusCode, body } = await supertest(server).delete(
      `/api/users/${fakeUserUuid}`
    );

    expect(body.message).toBe("User's id is invalid - not uuid");
    expect(statusCode).toBe(400);
  });

  test("should return an empty array again after all manipulations", async () => {
    const { statusCode, body } = await supertest(server).get("/api/users");

    expect(body.data).toStrictEqual([]);
    expect(statusCode).toBe(200);
  });
});
