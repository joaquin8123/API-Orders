const DEFAULT_ERRORS = {
  invalidDate: ({ msg, field = 'invalidDate' }) => {
    return {
      text: msg || `Error: ${field} must have a valid date.`,
      name: `${field}Error`,
    };
  },
  invalidString: ({ msg, field = 'invalidString' }) => {
    return {
      text: msg || `Error: ${field} must have a valid string.`,
      name: `${field}Error`,
    };
  },
  invalidBoolean: ({ msg, field = 'invalidBoolean' }) => {
    return {
      text: msg || `Error: ${field} must have a valid Boolean.`,
      name: `${field}Error`,
    };
  },
  invalidObject: ({ msg, field = 'invalidObject' }) => {
    return {
      text: msg || `Error: ${field} must have a valid Object.`,
      name: `${field}Error`,
    };
  },
  invalidObjectKeys: ({ msg, field = 'invalidObjectKeys' }) => {
    return {
      text: msg || `Error: ${field} object must have all correct keys.`,
      name: `${field}Error`,
    };
  },
  invalidNumber: ({ msg, field = 'invalidNumber' }) => {
    return {
      text: msg || `Error: ${field} must have a valid Number.`,
      name: `${field}Error`,
    };
  },
  empty: ({ msg, field = 'empty' }) => {
    return {
      text: msg || `Error: ${field} must have a not empty.`,
      name: `${field}Error`,
    };
  },
  objectOrString: ({ msg, field = 'invalidObjectOrString' }) => {
    return {
      text: msg || `Error: ${field} is neither an object nor a string.`,
      name: `${field}Error`,
    };
  },
  regex: ({ msg, field = 'regex' }) => {
    return {
      text: msg || `Error: ${field} doesn't pass regex function.`,
      name: `${field}Error`,
    };
  },
  array: ({ msg, field = 'array' }) => {
    return {
      text: msg || `Error: ${field} isn't an array.`,
      name: `${field}Error`,
    };
  },
  arrayOfType: ({ msg, field = 'arrayType', elementType }) => {
    return {
      text: msg || `Error: ${field} isn't an ${elementType} array.`,
      name: `${field}Error`,
    };
  },
  maxLength: ({ msg, field = 'maxLength' }) => {
    return {
      text: msg || `Error: ${field} maxLength invalid.`,
      name: `${field}Error`,
    };
  },
  minLength: ({ msg, field = 'minLength' }) => {
    return {
      text: msg || `Error: ${field} minLength invalid.`,
      name: `${field}Error`,
    };
  },
  invalidLength: ({ msg, size, field = 'fixedLength' }) => {
    return {
      text: msg || `Error: ${field} invalid length. Expected ${size}.`,
      name: `${field}Error`,
    };
  },
  validValue: ({ msg, field = 'validValue' }) => {
    return {
      text: msg || `Error: ${field} does not look like a valid value.`,
      name: `${field}Error`,
    };
  },
};

module.exports = { DEFAULT_ERRORS };
