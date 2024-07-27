const { ERRORS_MESSAGES } = require("../../constants");

const getUserUsecase =
  ({ dependencies }) =>
  async ({ params }) => {
    const { userModel, logging } = dependencies;
    const { username, type } = params;
    logging.info({ message: "Proceed to fetch user", metadata: { username } });
    const user = await userModel.getUser({ username, type });
    console.log("User", user);
    if (!user[0] || !user[0].active)
      throw new Error(ERRORS_MESSAGES.MISSING_USER);
    logging.info({
      message: "User has been fetched ok",
      metadata: { username },
    });
    return user;
  };

module.exports = { getUserUsecase };
