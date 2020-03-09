const axios = require("axios").default;

function intercomHelper(url, data) {
  const token = process.env.INTERCOM_ACCESS_TOKEN;
  if (!token) {
    console.warn("No Intercom token found");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  return axios.post(url, data, { headers });

  // return fetch(url, {
  //   method,
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     Accept: "application/json",
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify(data)
  // });
}

exports.handler = async function(event, context, callback) {
  const { body } = event;
  const { email, name } = JSON.parse(body);
  const usersUrl = "https://api.intercom.io/users";

  try {
    const data = { email, name };
    const response = await intercomHelper(usersUrl, data);

    // if (!response.ok) {
    //   callback(null, {
    //     statusCode: response.status,
    //     body: JSON.stringify({ status: response.statusText, data })
    //   });
    // }

    const user = await response.json();

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(user)
    });
  } catch (error) {
    console.error(error);
    callback(null, {
      statusCode: error.response.status,
      body: JSON.stringify({ status: "Service unavailable" })
    });
  }
};
