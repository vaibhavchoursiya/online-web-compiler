const { logEvent } = require("./logEvent");
const errorHandler = (err, req, res, next) => {
  logEvent(`${err.name}\t${err.message}`, "errlog.txt");
  console.log(err.stack);
  res.status(500).send(err.message);
};

module.exports = { errorHandler };
