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

const expectThrowsAsync = async (method, errorMessage) => {
  try {
    const response = await method();
    expect(response).to.be.an("Error");
  } catch (error) {
    expect(error).to.be.an("Error");
    expect(error.message).to.equal(errorMessage);
  }
};

module.exports = {
  defaultExpect,
  expectThrowsAsync,
};
