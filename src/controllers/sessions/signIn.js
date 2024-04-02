import { ERRORS_CODES, ERRORS_MESSAGES } from '../../constants';

const makeSignInController = ({ dependencies }) => async ({ params, hostUrl }) => {
  const {
    getUser,
    verifyPasswordHash,
    generateTokens,
    customExceptionInstance,
  } = dependencies;
  const { username, password, tx, mainTx, accountId } = params;
  const commonAttributes = { tx, mainTx, accountId };
  try {
    const user = await getUser({ params: { username, ...commonAttributes } });
    verifyPasswordHash({
      params: {
        user,
        passwordInput: password,
        ...commonAttributes,
      },
    });

    const tokens = generateTokens({
      params: {
        user,
        hostUrl,
        ...commonAttributes,
      },
    });
    return { response: tokens, status: 200 };
  } catch (error) {
    throw customExceptionInstance.create({
      status: 400,
      message: ERRORS_MESSAGES.INVALID_USERNAME_OR_PASSWORD,
      code: ERRORS_CODES.INVALID_CREDENTIALS,
    });
  }
};

export default makeSignInController;
