import customExceptionInstance from '../../exceptions';
import makeSignInController from './signIn';
import { getUser, createUser, verifyPasswordHash } from '../../usecases/users';
import { generateTokens } from '../../usecases/sessions';
import makeSignUpController from './signUp';

const signIn = makeSignInController({
  dependencies: {
    getUser,
    verifyPasswordHash,
    generateTokens,
    customExceptionInstance,
  },
});

const signUp = makeSignUpController({
  dependencies: {
    createUser,
    customExceptionInstance,
  },
});

export { signIn, signUp };
