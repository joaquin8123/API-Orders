const { ERRORS_CODES, ERRORS_MESSAGES } = require("../../constants");

const createUserUsecase =
  ({ dependencies }) =>
  async ({ params }) => {
    const { clientsModel, clientsEntity } = dependencies;
    const { username, email } = params;

    logger.logInfo({
      message: "Proceed to validate create-client params.",
      metadata: { username, email },
    });
    try {
      const clientRecord = clientsEntity({ params });
      logger.logInfo({
        message: "Client validated ok",
        metadata: { username, email },
      });
      const response = await clientsModel.createIfNotExists(
        clientRecord,
        "username"
      );
      return response;
    } catch (error) {
      throwCustomError(error, dependencies);
    }
  };

module.exports = { createUserUsecase };

const throwCustomError = (error, dependencies) => {
  const { customExceptionInstance } = dependencies;
  let { message } = error;
  let code = ERRORS_CODES.VALIDATION_FAILED_USER;

  if (error.message === ERRORS_MESSAGES.DYNAMO_ALREADY_EXISTS_KEY_ERROR) {
    message = ERRORS_MESSAGES.USER_ALREADY_EXISTS;
    code = ERRORS_CODES.USER_ALREADY_EXISTS;
  }

  throw customExceptionInstance.create({
    message,
    code,
  });
};
