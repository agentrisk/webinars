const signupForm = document.getElementById("signup-form");

function processForm(form) {
  const formData = new FormData(form);
  var data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  fetch("/.netlify/functions/signup", {
    method: "POST",
    body: JSON.stringify(data)
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
    });
}

if (signupForm) {
  signupForm.addEventListener(
    "submit",
    e => {
      e.preventDefault();
      processForm(signupForm);
    },
    false
  );
}
