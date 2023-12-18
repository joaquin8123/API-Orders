import createOrderEntity from "../entities/createOrderEntity";
import createOrderUseCase from "./orders/createOrderUseCase";

const createOrder = createOrderUseCase({
  dependencies: {
    createOrderEntity,
  },
});

export { createOrder };
