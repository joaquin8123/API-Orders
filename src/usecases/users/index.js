const { getUserUsecase } = require("./getUser");
const userModel = require("../../models/user");
const logging = require("../../config/logging");
// import makeVerifyPasswordHashUsecase from './verifyPasswordHash';
// import { decrypt } from '../../helpers/cryptoHelpers';
// import createUserUsecase from "./createUser";
import { crea } from "../../entities/clients";

const getUser = getUserUsecase({
  dependencies: {
    userModel,
    logging,
  },
});

const createUser = createUserUsecase({
  dependencies: {
    clientsModel,
    clientsEntity,
  },
});

const verifyPasswordHash = makeVerifyPasswordHashUsecase({
  dependencies: {
    decrypt,
  },
});

module.exports = { createUser };
