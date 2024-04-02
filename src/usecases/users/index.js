import getUserUsecase from './getUser';
import { clientsModel } from "../../models/dynamo";
// import makeVerifyPasswordHashUsecase from './verifyPasswordHash';
// import { decrypt } from '../../helpers/cryptoHelpers';
// import createUserUsecase from "./createUser";
// import { clientsEntity } from "../../entities/clients";

const getUser = getUserUsecase({
  dependencies: {
    clientsModel,
  },
});

// const createUser = createUserUsecase({
//   dependencies: {
//     clientsModel,
//     clientsEntity,
//   },
// });
// const verifyPasswordHash = makeVerifyPasswordHashUsecase({
//   dependencies: {
//     decrypt,
//   },
// });

export { getUser, createUser, verifyPasswordHash };
