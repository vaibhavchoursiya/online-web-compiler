const path = require("path");

const fsPromises = require("fs").promises;

const getExt = (languageName) => {
  //--------- language ext
  const langaugesExt = {
    c: ".c",
    cpp: ".cpp",
    java: ".java",
    python: ".py",
    ruby: ".rb",
    // ruby extention dont know;
  };

  return langaugesExt[languageName.toLowerCase()];
  // language ext-------------
};

const removeRandomFile = async (fileName) => {
  console.log("Enter RRF");
  await fsPromises.rm(path.join(__dirname, "..", "tempfiles", fileName));
  console.log(`Removed ${fileName}`);
};

module.exports = { getExt, removeRandomFile };
