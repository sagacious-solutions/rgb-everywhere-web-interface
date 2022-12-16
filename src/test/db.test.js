import { connectToDb } from "../db/index";
const assert = require("chai").assert;

it("Can run a test", () => {
    expect(true).toBe(true);
});

it("Can connect to test Database", () => {
    const db = connectToDb(process.env.REACT_APP_TEST_DB_URL);

    assert.isNotNull(db, "Failed to connect to db");
});

it("Can't connect to fake Database", () => {
    const db = connectToDb("postgres://234123:sdfsdf@fake.site.com/sdf");

    assert.isNull(db, "It should return null");
});
