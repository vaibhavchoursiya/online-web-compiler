import { editor } from "./oc";

console.log("edior");
const themeData = [
  "dracula",
  "merbivore",
  "tomorrow",
  "xcode",
  "terminal",
  "cobalt",
];

const setTheme = () => {
  editor.setTheme(`ace/theme/dracula`);
};
setTheme();

const selectElement = document.querySelector(".theme-dropdown");

themeData.forEach((element) => {
  const optionElement = document.createElement("option");
  optionElement.setAttribute("value", element);
  optionElement.innerText = element;
  selectElement.appendChild(optionElement);
});

selectElement.addEventListener("change", (e) => {
  const selectedOptionValue = e.target.value.toLowerCase();
  editor.setTheme(`ace/theme/${selectedOptionValue}`);
});

// ---------------------------------------------------
// let darkMode = localStorage.getItem("darkMode");

// const themeButton = document.querySelector(".btn-theme");

// const enableDarkMode = () => {
//   localStorage.setItem("darkMode", "enable");
//   editor.setTheme("ace/theme/monokai");
// };

// const disableDarkMode = () => {
//   localStorage.setItem("darkMode", null);
//   editor.setTheme("ace/theme/dawn");
// };

// themeButton.addEventListener("click", () => {
//   darkMode = localStorage.getItem("darkMode");
//   if (darkMode !== "enable") {
//     enableDarkMode();
//   } else {
//     disableDarkMode();
//   }
// });
