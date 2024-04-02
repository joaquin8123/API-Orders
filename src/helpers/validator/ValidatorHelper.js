const { DEFAULT_ERRORS } = require('./constants');
const { sameMembers } = require('./array');

module.exports = class ValidatorHelper {
  constructor() {
    this.errors = DEFAULT_ERRORS;
  }

  /**
   * This method concatenates a set of validator functions
   * @param data value by itself
   * @param field name of the property/attribute to validate
   * @param validators set of validator functions to concatenate
   * @returns param.data
   * @example {
   *      data: '45456521',
   *      field: 'requestId',
   *      validators: [
   *      {
            name: 'isValidString',
            params: {},
          },
          {
            name: 'maxLength',
            params: { size: 8 },
          }]
   * }
   */
  chainValidators({ data, field, validators }) {
    for (let validator of validators) {
      const { params, name } = validator;
      this[name]({ data, field, ...params });
    }
    return data;
  }

  /**
   * Verifies whether received value is a valid date or datetime
   * @param param
   * @param param.data value by itself
   * @param param.field name of the property/attribute to validate
   * @param param.msg optional message error when validator exception is thrown
   * @returns param.data

   */

  isValidDateTime(param) {
    const { data = 'invalid', field, msg } = this.defaultParams(param);
    const isValidDate = Date.parse(data);
    if (!isValidDate) {
      const { text, name } = this.errors.invalidDate({ field, msg });

      this.customException({ text, name });
    }

    return data;
  }

  /**
   * Verifies whether received value is a string or not
   * @param param
   * @param param.data value by itself
   * @param param.field name of the property/attribute to validate
   * @param param.empty boolean flag that indicates whether received data can be empty/null. If true, indicates property allows null values. Default value: false
   * @param param.msg optional message error when validator exception is thrown
   * @returns param.data
   * @example {
   *     data: 'foo',
   *     field: 'name'
   *    }
   */

  isValidString(param) {
    const { data, field, msg, empty } = this.defaultParams(param);

    const validate =
      typeof data === 'string' || (empty && !data && typeof data !== 'number');

    if (!validate || (data && data.trim() === '')) {
      const { text, name } = this.errors.invalidString({ field, msg });
      this.customException({ text, name });
    }

    return data;
  }
  /**
   * Verifies whether received value is a boolean or not
   * @param param
   * @param param.data value by itself
   * @param param.field name of the property/attribute to validate
   * @param param.msg optional message error when validator exception is thrown
   * @returns param.data
   */

  isValidBoolean(param) {
    const { data, field, msg } = this.defaultParams(param);
    const validate = typeof data === 'boolean';

    if (!validate) {
      const { text, name } = this.errors.invalidBoolean({ field, msg });
      this.customException({ text, name });
    }

    return data;
  }

  /**
   * Verifies whether received value is an object or not
   * @param param
   * @param param.data value by itself
   * @param param.field name of the property/attribute to validate
   * @param param.msg optional message error when validator exception is thrown
   * @returns param.data
   */
  isValidObject(param) {
    const { data, field, msg } = this.defaultParams(param);
    const validate = typeof data === 'object';

    if (!data || !validate) {
      const { text, name } = this.errors.invalidObject({ field, msg });
      this.customException({ text, name });
    }

    return data;
  }

  /**
   * Verifies whether received object has exactly the same desired keys
   * @param param
   * @param param.data value by itself
   * @param param.field name of the property/attribute to validate
   * @param param.msg optional message error when validator exception is thrown
   * @param param.expectedKeys collection of all expected keys
   * @returns param.data
   * @example {
   *    data: myObject,
   *    field: 'metadata',
   *    expectedKeys: ['foo', 'bar']
   *  }
   */
  hasObjectCorrectKeys(param) {
    const { data, field, msg } = this.defaultParams(param);
    const { expectedKeys } = param;
    const keys = Object.keys(data);
    const validate = sameMembers(keys, expectedKeys);
    if (!validate) {
      const { text, name } = this.errors.invalidObjectKeys({ field, msg });
      this.customException({ text, name });
    }

    return data;
  }

  /**
   * Verifies whether received value is a valid number
   * @param param
   * @param param.data value by itself
   * @param param.field name of the property/attribute to validate
   * @param param.msg optional message error when validator exception is thrown
   * @param param.empty boolean flag that indicates whether received data can be empty/null. If true, indicates property allows null values. Default value: false
   * @returns param.data
   */

  isValidNumber(param) {
    const { data, field, msg, empty } = this.defaultParams(param);
    const validate = typeof data === 'number' || (!data && empty);

    if (!validate) {
      const { text, name } = this.errors.invalidNumber({ field, msg });
      this.customException({ text, name });
    }
    return data;
  }

  /**
   * Verifies whether received value satisfies the maximum desired length
   * @param param
   * @param param.data value by itself
   * @param param.field name of the property/attribute to validate
   * @param param.msg optional message error when validator exception is thrown
   * @param param.empty boolean flag that indicates whether received data can be empty/null. If true, indicates property allows null values. Default value: false
   * @param param.size maximum desired length
   * @returns param.data
   * @example {
   *    data: myVar,
   *    field: 'metadata',
   *    size: 16
   *  }
   */
  maxLength(param) {
    const { data, field, size, msg, empty = false } = param;
    const validate = data.length <= size || (!data && empty);

    if (!validate) {
      const { text, name } = this.errors.maxLength({ field, msg });
      this.customException({ text, name });
    }

    return data;
  }

  /**
   * Verifies whether received value satisfies the minimum desired length
   * @param param
   * @param param.data value by itself
   * @param param.field name of the property/attribute to validate
   * @param param.msg optional message error when validator exception is thrown
   * @param param.empty boolean flag that indicates whether received data can be empty/null. If true, indicates property allows null values. Default value: false
   * @param param.size minimum desired length
   * @returns param.data
   * @example {
   *    data: myVar,
   *    field: 'metadata',
   *    size: 16
   *  }
   */

  minLength(param) {
    const { data, field, size, msg, empty = false } = param;
    const validate = data.length >= size || (!data && empty);

    if (!validate) {
      const { text, name } = this.errors.minLength({ field, msg });
      this.customException({ text, name });
    }

    return data;
  }

  /**
   * Verifies whether received value satisfies the exact desired length
   * @param param
   * @param param.data value by itself
   * @param param.field name of the property/attribute to validate
   * @param param.msg optional message error when validator exception is thrown
   * @param param.empty boolean flag that indicates whether received data can be empty/null. If true, indicates property allows null values. Default value: false
   * @param param.size minimum desired length
   * @returns param.data
   * @example {
   *    data: myVar,
   *    field: 'metadata',
   *    size: 16
   *  }
   */

  fixedLength(param) {
    const { data, field, size, msg, empty = false } = param;
    const validate = data.length === size || (!data && empty);

    if (!validate) {
      const { text, name } = this.errors.invalidLength({ field, msg, size });
      this.customException({ text, name });
    }

    return data;
  }

  /**
   * Verifies whether received value is not null, undefined, empty string, empty object or empty array
   * @param param
   * @param param.data value by itself
   * @param param.field name of the property/attribute to validate
   * @param param.msg optional message error when validator exception is thrown
   * @returns param.data
   */
  isNotEmpty(param) {
    const { data, field, msg } = this.defaultParams(param);
    const validate = data !== undefined && data !== null && data !== '';
    const isEmptyObject =
      !!data && typeof data === 'object' && Object.keys(data).length === 0;
    const isEmptyArray = !!data && Array.isArray(data) && data.length === 0;
    if (!validate || isEmptyObject || isEmptyArray) {
      const { text, name } = this.errors.empty({ field, msg });
      this.customException({ text, name });
    }

    return data;
  }

  /**
   * Verifies whether received value matches with a desired regular expression
   * @param param
   * @param param.data value by itself
   * @param param.field name of the property/attribute to validate
   * @param param.msg optional message error when validator exception is thrown
   * @param param.regex expected regex to match to
   * @returns param.data
   */
  isValidRegex(param) {
    const { data, field, msg } = this.defaultParams(param);
    const { regex } = param;
    if (!regex.test(data)) {
      const { text, name } = this.errors.regex({ field, msg });
      this.customException({ text, name });
    }
    return data;
  }

  /**
   * Verifies whether received value is an array
   * @param param
   * @param param.data value by itself
   * @param param.field name of the property/attribute to validate
   * @param param.msg optional message error when validator exception is thrown
   * @returns param.data
   */

  isValidArray(param) {
    const { msg, field, data } = this.defaultParams(param);
    if (!Array.isArray(data)) {
      const { text, name } = this.errors.array({ field, msg });
      this.customException({ text, name });
    }
    return data;
  }

  /**
   * Verifies whether received value is an array and contains specified types
   * @param param
   * @param param.data value by itself
   * @param param.field name of the property/attribute to validate
   * @param param.msg optional message error when validator exception is thrown
   * @param param.elementyType expected type of every array elements
   * @returns param.data
   * @example {
   *      data: myArray,
   *      field: 'identifiers',
   *      elementType: 'string' | 'number' | 'boolean'| etc
   * }
   */
  isValidArrayOf(param) {
    const { elementType } = param;
    this.isValidArray(param);
    const { data, field, msg } = this.defaultParams(param);
    const validate = data.some((elem) => typeof elem !== elementType);
    if (validate) {
      const { text, name } = this.errors.arrayOfType({
        field,
        elementType,
        msg,
      });
      this.customException({ text, name });
    }
    return data;
  }

  /**
   * Verifies whether received value is an object or a string
   * @param param
   * @param param.data value by itself
   * @param param.field name of the property/attribute to validate
   * @param param.msg optional message error when validator exception is thrown
   * @returns param.data
   */

  isValidObjectOrString(param) {
    const { data, field, msg } = this.defaultParams(param);
    const valid = typeof data === 'object' || typeof data === 'string';
    if (!valid) {
      const { text, name } = this.errors.objectOrString({ field, msg });
      this.customException({ text, name });
    }
    return data;
  }

  /**
   * Verifies whether received value is a valid string and normalizes it
   * @param param
   * @param param.data value by itself
   * @param param.field name of the property/attribute to validate
   * @param param.empty boolean flag that indicates whether received data can be empty/null. If true, indicates property allows null values. Default value: false
   * @param param.msg optional message error when validator exception is thrown
   * @returns param.data
   * @example {
   *     data: 'foo',
   *     field: 'name'
   *    }
   */

  isValidNormalizedWord(param) {
    const word = this.isValidString(param);
    if (!word) return word;
    return word
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/'/g, '')
      .replace(/ {2,}/g, ' ');
  }

  /**
   * Verifies whether received value is part of the expected enum
   * @param param
   * @param param.data value by itself
   * @param param.field name of the property/attribute to validate
   * @param param.msg optional message error when validator exception is thrown
   * @param param.enumObj expected enum object which element must be part of
   * @returns param.data
   * @example
   *      const myEnum = {
   *        FOO: 'foo',
   *        BAR: 'bar'
   *      };
   *
   *      const validator = new ValidatorHelper();
   *      validator.isValidEnumValue({
   *          data: 'test',
   *          enumObj: myEnum,
   *      });
   *
   *    // In this situation, function will throw an error because 'test' is not a value of expected enum
   *
   *
   */
  isValidEnumValue(param) {
    const { data, field, enumObj, msg } = param;
    let aux = data;
    if (typeof data === 'string') aux = enumObj[data.toUpperCase()];

    const isValidData = Object.values(enumObj).indexOf(aux) > -1;
    if (!isValidData) {
      const { text, name } = this.errors.validValue({ field, msg });
      this.customException({ text, name });
    }
    return data;
  }

  defaultParams(param) {
    const keys = Object.keys(param);
    let field = keys[0];
    let msg = null;
    let data = param[keys[0]];
    let empty = false;

    if (keys.length > 1) {
      const {
        data: dataField = data,
        msg: errorMsg = msg,
        field: fieldName = field,
        empty: emptyOption = empty,
      } = param;
      field = fieldName;
      msg = errorMsg;
      data = dataField;
      empty = emptyOption;
    }
    return { data, field, msg, empty };
  }

  customException({ text, name }) {
    const error = new Error(text);
    error.code = name;
    error.status = 400;
    throw error;
  }
};
