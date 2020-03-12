const signupForm = document.getElementById("signup-form");

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

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
    .then(handleErrors)
    .then(response => {
      console.debug(response);
      pieces = window.location.pathname.split("index");
      window.location.replace(pieces[0] + "thank-you" + pieces[1]);
    })
    .catch(error => {
      console.warn(error);
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
