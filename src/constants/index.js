const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[^\w\s]).{8,}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const ERRORS_CODES = {
  INVALID_CREDENTIALS: "LTL01",
  UNSUCCESS_SIGN_UP: "LTL02",
  VALIDATION_FAILED_USER: "LTL03",
  USER_ALREADY_EXISTS: "LTL04",
};

const ERRORS_MESSAGES = {
  MISSING_USER: "Unable to find an active user.",
  INVALID_CREDENTIALS: "Invalid credentials.",
  INVALID_USERNAME_OR_PASSWORD: "Incorrect username or password.",
  DYNAMO_ALREADY_EXISTS_KEY_ERROR: "The conditional request failed",
  USER_ALREADY_EXISTS: "Error: there is already a user with this username.",
};

module.exports = {
  ERRORS_MESSAGES,
  EMAIL_REGEX,
  PASSWORD_REGEX,
  ERRORS_CODES,
};
