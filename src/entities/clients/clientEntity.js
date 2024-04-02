import { EMAIL_REGEX, PASSWORD_REGEX } from '../../constants/';

const clientEntity = ({ dependencies }) => ({ params }) => {
  const { Validator, encrypt } = dependencies;
  const { username, password, email, company, active = true, countryCode } = params;

  const plainPassword = Validator.isValidRegex({
    data: password,
    field: 'password',
    regex: PASSWORD_REGEX,
  });

  return Object.freeze({
    username: Validator.isValidString({ username }),
    password: encrypt(plainPassword),
    email: Validator.isValidRegex({
      data: email,
      field: 'email',
      regex: EMAIL_REGEX,
    }),
    company: Validator.isValidString({ company }),
    active: Validator.isValidBoolean({ active }),
    countryCode: Validator.chainValidators({
      data: countryCode,
      field: 'countryCode',
      validators: [
        {
          name: 'isValidString',
          params: {},
        },
        {
          name: 'fixedLength',
          params: { size: 2 },
        },
      ],
    }),
  });
};

export default clientEntity;
