const path = require("path");
const UserProgramModel = require("../models/userProgram");

const fsPromises = require("fs").promises;
const { getExt, removeRandomFile } = require(path.join(
  __dirname,
  "..",
  "helper",
  "helper.js"
));
const { spawn, exec } = require("child_process");

const timeLimitForContainer = async (containerName) => {
  setTimeout(() => {
    // try {}
    const stc = exec(`docker stop ${containerName}`);
  }, 5 * 60 * 1000);
};

const stopContainer = (containerName) => {
  // call a async process to remove file
  const stopContainer = spawn("docker", ["stop", `${containerName}`]);
  console.log(`${containerName} is Stopped`);

  stopContainer.stdout.on("data", (data) => {
    console.log(`stopContaienr stdout: ${data}`);
  });

  stopContainer.stderr.on("data", (data) => {
    console.error(`stopContaienr stderr: ${data}`);
  });

  stopContainer.on("close", (code) => {
    console.log(`stopContaienr child process exited with code ${code}`);
    if (code === 0) {
      removeContainer(containerName);
    }
  });
};

const includeInputInCommandList = (inputList, commandList) => {
  const cList = commandList.map((x) => x);
  if (inputList[0] !== "") {
    inputList.forEach((element) => {
      if (element !== "") {
        cList.push(element);
      }
    });
  }

  return cList;
};

const listenContainer = (container, containerName, res) => {
  let output = "";
  let errorOutput = "";

  container.stdout.on("data", (data) => {
    output += data.toString();
    console.log(`stdout: ${data}`);
  });
  container.stderr.on("data", (data) => {
    errorOutput += data.toString();
    console.error(`stderr: ${data}`);
  });
  container.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    if (code === 0) {
      stopContainer(containerName);
      res.json({
        output: output,
      });
    } else {
      stopContainer(containerName);
      res.json({
        output: errorOutput,
      });
    }
    // console.log(output);
  });
};

const twoStepProcessForCppCodeExecution = (
  containerName,
  compilerName,
  randomfileName,
  listOfInput,
  res
) => {
  let output = "";
  let errorOutput = "";
  const executableFileContainer = spawn("docker", [
    "exec",
    `${containerName}`,
    `${compilerName}`,
    `${randomfileName}`,
    `-o`,
    "/cppfile",
  ]);
  executableFileContainer.stdout.on("data", (data) => {
    output += data.toString();
    console.log(`stdout: ${data}`);
  });

  executableFileContainer.stderr.on("data", (data) => {
    errorOutput += data.toString();
    console.error(`stderr: ${data}`);
  });

  executableFileContainer.on("close", (code) => {
    console.log(`execTFC child process exited with code ${code}`);

    if (code === 0) {
      let exeCppCommandList = ["exec", `${containerName}`, "/cppfile"];
      exeCppCommandList = includeInputInCommandList(
        listOfInput,
        exeCppCommandList
      );
      const container = spawn("docker", exeCppCommandList);

      listenContainer(container, containerName, res);
    } else {
      stopContainer(containerName);
      res.json({
        output: errorOutput,
      });
    }
  });
};

const twoStepProcessForJavaCodeExecution = (
  containerName,
  compilerName,
  randomfileName,
  listOfInput,
  res
) => {
  let output = "";
  let errorOutput = "";
  const firstPhase = spawn("docker", [
    "exec",
    `${containerName}`,
    "javac",
    `${randomfileName}`,
  ]);
  firstPhase.stdout.on("data", (data) => {
    output += data.toString();
    console.log(`stdout: ${data}`);
  });

  firstPhase.stderr.on("data", (data) => {
    errorOutput += data.toString();
    console.error(`stderr: ${data}`);
  });

  firstPhase.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    if (code === 0) {
      let exeJavaCommandList = ["exec", `${containerName}`, "java", "Main"];
      exeJavaCommandList = includeInputInCommandList(
        listOfInput,
        exeJavaCommandList
      );
      const secondPhase = spawn("docker", exeJavaCommandList);
      listenContainer(secondPhase, containerName, res);
    } else {
      stopContainer(containerName);
      res.json({
        output: errorOutput,
      });
    }
  });
};

const executeCodeInsideContaienr = (
  containerName,
  randomfileName,
  compilerName,
  listOfInput,
  res
) => {
  if (compilerName === "python3") {
    let execPythonCommandList = [
      "exec",
      `${containerName}`,
      `${compilerName}`,
      `/${randomfileName}`,
    ];
    execPythonCommandList = includeInputInCommandList(
      listOfInput,
      execPythonCommandList
    );

    console.log(`All COmmnad: --- ${execPythonCommandList}`);
    const container = spawn("docker", execPythonCommandList);
    listenContainer(container, containerName, res);
  } else if (compilerName === "g++" || compilerName === "gcc") {
    twoStepProcessForCppCodeExecution(
      containerName,
      compilerName,
      randomfileName,
      listOfInput,
      res
    );
  } else if (compilerName === "javac") {
    twoStepProcessForJavaCodeExecution(
      containerName,
      compilerName,
      randomfileName,
      listOfInput,
      res
    );
  }
};

const copyFilesToTheContainer = (
  containerName,
  randomfileName,
  compilerName,
  listOfInput,
  res
) => {
  const absoulutePathOfFile = path.join(
    __dirname,
    "..",
    "tempfiles",
    randomfileName
  );
  const container = spawn("docker", [
    "cp",
    `${absoulutePathOfFile}`,
    `${containerName}:${randomfileName}`,
  ]);

  container.stdout.on("data", (data) => {
    console.log(`stdout in copyFilesToTheContainer: ${data}`);
  });

  container.stderr.on("data", (data) => {
    console.error(`stderr in copyFilesToTheContainer: ${data}`);
  });

  container.on("close", (code) => {
    console.log(
      `child process exited with code in copyFilesToTheContainer ${code}`
    );
    if (code === 0) {
      removeRandomFile(randomfileName);
      executeCodeInsideContaienr(
        containerName,
        randomfileName,
        compilerName,
        listOfInput,
        res
      );
    }
  });
};

const startContainer = (
  containerName,
  imageName,
  randomfileName,
  compilerName,
  listOfInput,
  res
) => {
  /*     */
  // const command = `run --name ${containerName} -d ${imageName}`;
  const container = spawn(`docker`, [
    "run",
    "--name",
    `${containerName}`,
    "-d",
    `${imageName}`,
  ]);

  container.stdout.on("data", (data) => {
    console.log(`StartContainer: stdout: ${data.toString()}`);
  });

  container.stderr.on("data", (data) => {
    console.error(`StartContainer: stderr: ${data.toString()}`);
  });

  container.on("close", (code) => {
    console.log(`StartContainer: child process exited with code ${code}`);
    if (code == 0) {
      copyFilesToTheContainer(
        containerName,
        randomfileName, //its not a full path.
        compilerName,
        listOfInput,
        res
      );
    }
  });
};

const removeContainer = (containerName) => {
  const removeContainer = spawn("docker", ["rm", `${containerName}`]);
  console.log(`removerContainer is successfull`);
};

const writeCodefile = async (code, langauge) => {
  const ext = getExt(langauge);
  const randomFileName = Math.floor(Math.random() * 99999 + 1);
  // const fileName = `${randomFileName}${ext}`;
  const fileName = `${randomFileName}${ext}`;
  await fsPromises.writeFile(
    path.join(__dirname, "..", "tempfiles", fileName),
    code
  );
  return fileName;
};

const executeCode = async (code, langauge, listOfInput, res) => {
  const langaugeCompilers = {
    c: "gcc",
    cpp: "g++",
    java: "javac",
    python: "python3",
    ruby: "java",
    // ruby extention dont know;
  };
  const randomfileName = await writeCodefile(code, langauge);
  console.log(`Randome File Name: ${randomfileName}`);
  const containerName = Math.floor(Math.random() * 10000 + 1);
  const imageName = `online_compilers_image`;
  const compilerName = langaugeCompilers[langauge.toLowerCase()];
  timeLimitForContainer(containerName);

  const startCon = startContainer(
    containerName,
    imageName,
    randomfileName,
    compilerName,
    listOfInput,
    res
  );

  // const addFilesCon = copyFilesToTheContainer(containerName, randomfileName);

  return startCon;
};

const getCode = (req, res) => {
  const { code, language, input } = req.body;
  console.log(code, language, input);
  const listOfInput = input.split("\n");
  console.log(listOfInput);
  console.log(listOfInput.join(" "));

  // console.log(listInput);

  const output = executeCode(code, language, listOfInput, res);
  // console.log(`this is output:${output}`);
};

const saveCode = async (req, res) => {
  const { program_name, language, code, lastOutput } = req.body;
  const listofPrograms = await UserProgramModel.find({
    username: req.user.username,
  });
  if (listenContainer.length < 15) {
    if ((program_name, language && code && lastOutput)) {
      try {
        const username = req.user.username;
        const programDoc = await UserProgramModel.findOne({
          program_name: program_name,
          username: username,
        });
        if (programDoc) {
          programDoc.code = code;
          programDoc.lastOutput = lastOutput;
          await programDoc.save();
        } else {
          const userProgramDoc = await UserProgramModel({
            program_name: program_name,
            username: username,
            language: language,
            code: code,
            lastOutput: lastOutput,
          });

          await userProgramDoc.save();
        }
        res.send({ status: "SuccessFul", message: "User code is saved" });
      } catch (error) {
        console.log(error);
      }
    } else {
      res.send({ status: "Failed", message: "All parameter are required." });
    }
  } else {
    res.send({ status: "Failed", message: "Your cannot save more files." });
  }
};

const sendProgramStructure = async (req, res) => {
  const { langauge } = req.body;
  try {
    const programStructure = await fsPromises.readFile(
      path.join(__dirname, "..", "program_structure", `${langauge}.txt`),
      {
        encoding: "utf8",
      }
    );

    res.json({
      programStructure: programStructure,
    });
  } catch (e) {
    res.json({
      programStructure: `Write Your ${language} Program Here!`,
    });
    console.log(e);
  }
};

module.exports = { getCode, saveCode, sendProgramStructure };
