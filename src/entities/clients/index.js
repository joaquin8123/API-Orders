import ValidatorHelper from "../../helpers/validator/index";
import clientEntity from "./clientEntity";
import { encrypt } from "../../helpers/cryptoHelpers";

const clientsEntity = clientEntity({
  dependencies: {
    Validator: new ValidatorHelper(),
    encrypt,
  },
});

export { clientsEntity };
