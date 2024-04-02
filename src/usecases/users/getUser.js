import { ERRORS_MESSAGES } from "../../constants";

const getUserUsecase =
  ({ dependencies }) =>
  async ({ params }) => {
    const { clientsModel } = dependencies;
    const { username } = params;
    logging.info({ message: "Proceed to fetch user", metadata: { username } });
    const user = await clientsModel.findOne({ key: { username } });
    if (!user || !user.active) throw new Error(ERRORS_MESSAGES.MISSING_USER);
    logger.logInfo({
      ...commonLogAttributes,
      message: "User has been fetched ok",
      metadata: { username },
    });
    return user;
  };

export default getUserUsecase;
