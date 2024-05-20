const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const logEvent = async (message, filename) => {
  const dateTime = `${format(new Date(), "yyyy/MM/dd:\tHH:mm:ss")}`;
  const logItem = `${uuid()}\t${dateTime}\t${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", filename),
      message
    );
  } catch (e) {
    console.log(e);
  }
};

// MiddleWare Function
const logger = (req, res, next) => {
  logEvent(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqlog.txt");
  next();
};

module.exports = { logger, logEvent };
