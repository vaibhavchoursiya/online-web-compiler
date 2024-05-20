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
    const p_error = document.querySelector(".password-error");

    p_error.innerText = "";
    p_error.classList.remove("display-error");

    try {
      const response = await fetch("/auth/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data),
      });
      const getData = await response.json();
      if (getData.status === "Failed") {
        p_error.classList.add("display-error");
        p_error.innerText += getData.message;
      } else {
        // store the token and redirect to oc.html;
        // Set the token in local storage
        console.log(getData);

        await localStorage.setItem("oc_lt", getData.token);
        window.location.href = "/";
      }
    } catch (e) {
      console.log(e);
    }
  };

  const validateForm = (data) => {
    if (data.email && data.password) {
      submitData(data);
    } else {
    }
  };

  const sendSignUpData = async () => {
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value.trim();
    data = {
      email: email,
      password: password,
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
