document.addEventListener("DOMContentLoaded", () => {
  let getOC_LT = "";
  getOC_LT = localStorage.getItem("oc_lt");

  const getCurrentUser = async (getOC_LT) => {
    const adminSection = document.querySelector(".admin-section");
    const currentUserSection = document.querySelector(".currentuser-section");
    const userName = document.querySelector(".username");

    adminSection.classList.remove("no-display");
    currentUserSection.classList.add("no-display");

    try {
      if (getOC_LT) {
        const response = await fetch("/auth/user/currentuser", {
          method: "POST",
          headers: {
            authorization: `Bearer ${getOC_LT}`,
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({}),
        });
        const currentUser = await response.json();
        console.log(currentUser);
        if (currentUser) {
          adminSection.classList.add("no-display");
          currentUserSection.classList.remove("no-display");
          userName.innerText += currentUser.user.username;
        }
      } else {
      }
    } catch (e) {
      console.log(e);
    }
  };
  getCurrentUser(getOC_LT);

  const getSpitedValue = () => {
    const para = document.querySelector(".logo > p");
    let list = para.innerText;
    language = list.split(" ");
    console.log(language);
    return language[0].toLowerCase();
  };

  /** change the language for editor */
  const setEditor = async () => {
    editor.setTheme("ace/theme/dracula");
    const langaugeName = getSpitedValue();

    switch (langaugeName) {
      case "c":
        editor.session.setMode("ace/mode/c_cpp");

        break;
      case "cpp":
        editor.session.setMode("ace/mode/c_cpp");

        break;
      case "java":
        editor.session.setMode("ace/mode/java");

        break;
      case "ruby":
        editor.session.setMode("ace/mode/ruby");

        break;
      case "python":
        editor.session.setMode("ace/mode/python");

        break;
      default:
        console.log("None of the above");
        break;
    }
    try {
      const response = await fetch("/api/program_structure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ langauge: langaugeName }),
      });

      const getProgramStructure = await response.json();
      editor.setValue(`${getProgramStructure.programStructure}`, -1);
    } catch (e) {
      editor.setValue(`Write Your ${langaugeName} Program Here!`, -1);
    }

    editor.getSession().setUseWrapMode(true);
  };

  const setOutputEditor = () => {
    output.setTheme("ace/theme/terminal");
    // output.session.setMode("ace/mode/plain-text");
    output.renderer.setOption("showGutter", false);
    output.getSession().setUseWrapMode(true);
    output.setReadOnly(true);
  };

  const setInputEditor = () => {
    input.setTheme("ace/theme/xcode");
    // input.session.setMode("ace/mode/plain-text");
    input.getSession().setUseWrapMode(true);
  };

  const writeOptions = (selectElement) => {
    const themeData = [
      "dracula",
      "merbivore",
      "tomorrow",
      "xcode",
      "terminal",
      "cobalt",
    ];

    themeData.forEach((element) => {
      const optionElement = document.createElement("option");
      optionElement.setAttribute("value", element);
      optionElement.innerText = element;
      selectElement.appendChild(optionElement);
    });
  };

  const clearInputAndOutput = (input, output) => {
    input.setValue("");
    output.setValue("");
  };

  const runCode = async (editor, language, output, input) => {
    const code = editor.getValue() || "";
    const inputValue = input.getValue() || "";

    const data = {
      code: code,
      language: language,
      input: inputValue,
    };
    const response = await fetch("/api/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    });
    const someValue = "notheing";
    const getOutput = await response.json();
    console.log(typeof getOutput.output);
    console.log(someValue);
    output.setValue(getOutput.output);
  };

  function getUserInput() {
    // Prompt the user for input
    var userInput = window.prompt("Enter Your Filename With Ext:");

    // Check if the user clicked "OK" or entered a value
    if (userInput !== null && userInput !== "") {
      console.log("Filename:", userInput);
      return userInput;
    } else {
      console.log("User canceled the input dialog.");
      return null;
    }
  }

  const saveCode = async (langauge, editor, output) => {
    try {
      if (getOC_LT) {
        const program_name = getUserInput();
        if (program_name) {
          const data = {
            program_name: program_name,
            language: langauge,
            code: editor.getValue(),
            lastOutput: output.getValue(),
          };
          console.log(data);
          const response = await fetch("/api/save", {
            method: "POST",
            headers: {
              authorization: `Bearer ${getOC_LT}`,
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data),
          });
          const objRes = await response.json();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  ////////////////////////////////////////
  const selectElementDesktop = document.querySelector(
    ".theme-dropdown-desktop"
  );
  const selectElement = document.querySelector(".theme-dropdown");
  const saveButton = document.querySelector(".save");
  const runButton = document.querySelector(".run");
  const clearButton = document.querySelector(".clear");

  const saveMButton = document.querySelector(".m-save");
  const runMButton = document.querySelector(".m-run");
  const clearMButton = document.querySelector(".m-clear");

  const loginButton = document.querySelector(".login");
  const signUpButton = document.querySelector(".signup");
  const logoutButton = document.querySelector(".logout");

  const editor = ace.edit("editor");
  const output = ace.edit("output");
  const input = ace.edit("input-editor");

  writeOptions(selectElementDesktop);
  writeOptions(selectElement);

  setEditor();
  setOutputEditor();
  setInputEditor();

  /** Event Listener */
  selectElementDesktop.addEventListener("change", (e) => {
    const selectedOptionValue = e.target.value.toLowerCase();
    editor.setTheme(`ace/theme/${selectedOptionValue}`);
  });

  selectElement.addEventListener("change", (e) => {
    const selectedOptionValue = e.target.value.toLowerCase();
    editor.setTheme(`ace/theme/${selectedOptionValue}`);
  });

  /** This section for navbar buttons */
  clearButton.addEventListener("click", (e) => {
    e.preventDefault();

    console.log(e.target);
    clearInputAndOutput(input, output);
  });
  clearMButton.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(e.target);
    clearInputAndOutput(input, output);
  });

  runButton.addEventListener("click", (e) => {
    e.preventDefault();
    // console.log(e.target);

    runCode(editor, getSpitedValue(), output, input);
  });
  runMButton.addEventListener("click", (e) => {
    e.preventDefault();

    runCode(editor, getSpitedValue(), output, input);
  });

  saveButton.addEventListener("click", (e) => {
    e.preventDefault();

    saveCode(getSpitedValue(), editor, output);
    console.log(e.target);
  });
  saveMButton.addEventListener("click", (e) => {
    e.preventDefault();
    saveCode(getSpitedValue(), editor, output);

    console.log(e.target);
  });

  logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    // Clear all data stored in localStorage
    localStorage.removeItem("oc_lt");
    // Refresh the window
    window.location.reload();
  });
});
// export { editor };
