const Docker = require("dockerode");
const fs = require("fs");
const docker = new Docker(/* optional options object */);

// Define container options
const containerOptions = {
  Image: "online_compiler_docker_container", // Specify the image name or ID
  // Additional options as needed
  AttachStdout: true,
  AttachStderr: true,
  Tty: true,
  /* HostConfig: {
    Binds: [
      `${__dirname}/path/to/program/directory:/program`, // Mount program directory as a volume
    ],
  }, */
  //   WorkingDir: "/program", // Set the working directory inside the container
};
const execCodeContainer = (fileName) => {
  docker.createContainer(containerOptions, (err, container) => {
    if (err) {
      console.error("Error:", err);
    } else {
      console.log("Container created:", container.id);

      // Start the container
      container.start((err) => {
        if (err) {
          console.error("Error starting container:", err);
        } else {
          console.log("Container started:", container.id);

          // Define command to execute inside the container
          const command = ["python3", `${filename}`]; // Specify the program file name

          // Execute the command inside the container
          container.exec(
            {
              Cmd: command,
              AttachStdout: true, // Attach stdout
              AttachStderr: true, // Attach stderr
            },
            (err, exec) => {
              if (err) {
                console.error("Error executing command:", err);
              } else {
                console.log("Command executed, capturing output...");

                // Start the execution of the command
                exec.start((err, stream) => {
                  if (err) {
                    console.error("Error starting command:", err);
                  } else {
                    // Capture output from the command
                    container.modem.demuxStream(
                      stream,
                      process.stdout,
                      process.stderr,
                      () => {
                        console.log("Output stream finished.");
                        console.log(`${process.stdout}`);
                      }
                    );
                  }
                });
              }
            }
          );
        }
      });
    }
  });
};
// Create the container

module.exports = { execCodeContainer, containerOptions };
