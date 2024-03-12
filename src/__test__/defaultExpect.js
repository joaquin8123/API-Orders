const { expect } = require("chai");

const defaultExpect = (params) => {
  const { response, isSuccess = true, code, msg } = params;
  expect(response).to.deep.equal({
    success: isSuccess,
    code,
    msg,
    data: response.data,
  });
};

module.exports = {
  defaultExpect,
};
