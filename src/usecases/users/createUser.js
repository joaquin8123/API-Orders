import { ERRORS_CODES, ERRORS_MESSAGES } from '../../constants';

const makeCreateUserUsecase = ({ dependencies }) => async ({ params }) => {
  const { clientsModel, clientsEntity } = dependencies;
  const { username, email, company, tx = '', mainTx = '', accountId = '' } = params;

  const commonLogAttributes = { tx, mainTx, accountId };
  logger.logInfo({
    ...commonLogAttributes,
    message: 'Proceed to validate create-client params.',
    metadata: { username, email, company },
  });
  try {
    const clientRecord = clientsEntity({ params });
    logger.logInfo({
      ...commonLogAttributes,
      message: 'Client validated ok',
      metadata: { username, email, company },
    });
    const response = await clientsModel.createIfNotExists(clientRecord, 'username');
    return response;
  } catch (error) {
    throwCustomError(error, dependencies);
  }
};

export default makeCreateUserUsecase;

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
