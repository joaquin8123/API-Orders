const getTimeStamp = () => {
  return new Date().toISOString();
};

const info = ({ message, metadata = null }) => {
  if (metadata) {
    console.log(`[${getTimeStamp()}] [INFO] ${message}`, metadata);
  } else {
    console.log(`[${getTimeStamp()}] [INFO] ${message}`);
  }
};

const warn = (namespace, message, object = null) => {
  if (object) {
    console.log(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`, object);
  } else {
    console.log(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`);
  }
};

const error = (namespace, message, object = null) => {
  if (object) {
    console.log(
      `[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`,
      object
    );
  } else {
    console.log(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`);
  }
};

const debug = (namespace, message, object = null) => {
  if (object) {
    console.log(
      `[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`,
      object
    );
  } else {
    console.log(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`);
  }
};

module.exports = {
  info,
  warn,
  error,
  debug,
};
