document.addEventListener("DOMContentLoaded", () => {
  let getOC_LT = "";
  getOC_LT = localStorage.getItem("oc_lt");

  const getCurrentUser = async (getOC_LT) => {
    const userName = document.querySelector(".username");

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
          userName.innerText += currentUser.user.username;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getPrograms = async (getOC_LT) => {
    const programField = document.querySelector(".program-field");
    const response = await fetch("/auth/user/programs", {
      method: "POST",
      headers: {
        authorization: `Bearer ${getOC_LT}`,
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({}),
    });
    const programs = await response.json();
    programs.data.forEach((program) => {
      const element = document.createElement("a");
      element.classList.add("btn");
      element.setAttribute("href", `${program._id}`);
      element.innerText += program.program_name;
      programField.appendChild(element);
    });
    console.log(programs);
  };

  getCurrentUser(getOC_LT);
  getPrograms(getOC_LT);

  const logoutButton = document.querySelector(".logout");

  logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    // Clear all data stored in localStorage
    localStorage.removeItem("oc_lt");
    // Refresh the window
    window.location.href = "/";
  });
});
