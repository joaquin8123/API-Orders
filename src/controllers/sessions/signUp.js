import { ERRORS_CODES, USER_CREATED_OK } from '../../constants';

const makeSignUpController = ({ dependencies }) => async ({ params }) => {
  const { createUser, customExceptionInstance } = dependencies;

  try {
    await createUser({ params });
    return { response: { message: USER_CREATED_OK }, status: 201 };
  } catch (error) {
    throw customExceptionInstance.create({
      status: 400,
      message: error.message,
      code: error.code || ERRORS_CODES.UNSUCCESS_SIGN_UP,
    });
  }
};

export default makeSignUpController;
