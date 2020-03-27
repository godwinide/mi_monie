// btn click

const form = document.querySelector("form");
const form_btn = document.querySelector("form .input-group button");

form.onsubmit = () => {
    form_btn.setAttribute("disabled", "true");
}
