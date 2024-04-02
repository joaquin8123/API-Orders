import camelcaseKeys from 'camelcase-keys';
const keysToCamel = (hash) => camelcaseKeys(hash, { deep: true });

export { keysToCamel };
