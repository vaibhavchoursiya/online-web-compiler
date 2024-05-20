document.addEventListener("DOMContentLoaded", () => {
  const validateUsernameAndEmail = (getData) => {
    const ep_error = document.querySelector(".email-error");
    const up_error = document.querySelector(".username-error");

    ep_error.classList.remove("display-error");
    up_error.classList.remove("display-error");

    if (getData) {
      if (getData.exist === "email") {
        ep_error.classList.add("display-error");
        // message
      } else if (getData.exist === "username") {
        up_error.classList.add("display-error");

        // message
      } else if (getData.exist === "both") {
        ep_error.classList.add("display-error");
        up_error.classList.add("display-error");
        // message
      } else {
        window.location.href = "/user/login";
      }
    }
  };

  const submitData = async (data) => {
    console.log("submitData");
    const response = await fetch("/auth/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data),
    });
    const getData = await response.json();

    validateUsernameAndEmail(getData);

    console.log(getData);
  };

  const validateForm = (data) => {
    if (
      data.name &&
      data.email &&
      data.password &&
      data.confirm_password &&
      data.username
    ) {
      const p_error = document.querySelector(".password-error");
      if (data.password === data.confirm_password) {
        p_error.classList.remove("display-error");

        // fetch function call hoga.
        submitData(data);
      } else {
        p_error.classList.add("display-error");
      }
    }
  };

  const sendSignUpData = async () => {
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();
    const confirm_password = document
      .querySelector("#confirm_password")
      .value.trim();
    const username = document.querySelector("#username").value.trim();

    data = {
      name: name,
      email: email,
      password: password,
      confirm_password: confirm_password,
      username: username,
    };
    // Validater()
    validateForm(data);
    /* 1) all feild value are required 
    2) password and confirm password should match.
    3) username and email dont exits.
     */
  };

  const registerButton = document.querySelector(".register");
  const form = document.querySelector(".signup-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendSignUpData();
    console.log("clicked");
  });
});
