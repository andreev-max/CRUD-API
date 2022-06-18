import supertest from "supertest";
import { v4 } from "uuid";

import { server } from "../src";

const mockUpdateUser = {
  username: "Alina",
  age: 18,
  hobbies: ["basketball"],
};

const mockUserUuid = v4();

describe(" Scenario 2 : all unsuccessful requests ", () => {
  test("should return expected message and 404 status for wrong route", async () => {
    const { statusCode, body } = await supertest(server).get("/api/heroes");

    expect(body.message).toBe("Unfortunatelly, route not found");
    expect(statusCode).toBe(404);
  });

  test("should return expected message and 404 status for get wrong user", async () => {
    const { statusCode, body } = await supertest(server).get(
      `/api/users/${mockUserUuid}`
    );

    expect(body.message).toBe("User with this id does not exist");
    expect(statusCode).toBe(404);
  });

  test("should return expected message and 404 status for update wrong user", async () => {
    const { statusCode, body } = await supertest(server)
      .put(`/api/users/${mockUserUuid}`)
      .send(mockUpdateUser);

    expect(body.message).toBe("User with this id does not exist");
    expect(statusCode).toBe(404);
  });

  test("should return expected message and 404 status for delete wrong user", async () => {
    const { statusCode, body } = await supertest(server).delete(
      `/api/users/${mockUserUuid}`
    );

    expect(body.message).toBe("User with this id does not exist");
    expect(statusCode).toBe(404);
  });

  test("should return an empty array again after all manipulations", async () => {
    const { statusCode, body } = await supertest(server).get("/api/users");

    expect(body.data).toStrictEqual([]);
    expect(statusCode).toBe(200);
  });
});
