// const { expect } = require("chai");
// const { before, after, describe, beforeEach, it } = require("mocha");
// const dbInstance = require("../../db");
// const { initalConfigs } = require("../../__test__/initalConfig");
// const { defaultExpect } = require("../../__test__/defaultExpect");
// const { makeFakeUserDb } = require("../../__test__/makeFakeDataDb");
// const { getAllUser, getUserById, updateUser } = require("../../controllers/users");

// before(async () => {
//   await dbInstance.connect();
// });

// after(async () => {
//   await dbInstance.close();
// });

// describe.skip("User Tests - Router", () => {
//   beforeEach(async () => {
//     await dbInstance.clearDatabase();
//     await initalConfigs({});
//   });

//   it("Should getAll user successfully", async () => {
//     const user1 = makeFakeUserDb({ id: 11 });
//     const user2 = makeFakeUserDb({ id: 22 });
//     await dbInstance.insert({
//       tableName: "user",
//       data: user1,
//     });
//     await dbInstance.insert({
//       tableName: "user",
//       data: user2,
//     });
//     const response = await getAllUser();
//     defaultExpect({
//       response,
//       code: 200,
//       msg: "GET_USERS",
//     });
//     expect(response.data.users.length).to.equal(2);
//   });

//   it("Should get user by id successfully", async () => {
//     const params = makeFakeUserDb();
//     await dbInstance.insert({
//       tableName: "user",
//       data: params,
//     });
//     const response = await getUserById({ params: { userId: params.id } });
//     defaultExpect({
//       response,
//       code: 200,
//       msg: "GET_USER",
//     });
//     expect(response.data.user.length).to.equal(1);
//   });

//   it("Should update user successfully", async () => {
//     const params = makeFakeUserDb();
//     await dbInstance.insert({
//       tableName: "user",
//       data: params,
//     });
//     const response = await updateUser({
//       body: { userId: params.id, active: false },
//     });

//     defaultExpect({
//       response,
//       code: 200,
//       msg: "UPDATE_ACTIVE_USERS",
//     });

//     const userUpdated = await dbInstance.getItem({
//       tableName: "user",
//       keyName: "id",
//       keyValue: params.id,
//     });
//     expect(userUpdated.active).to.equal(0);
//   });
// });
