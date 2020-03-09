import fetch from "node-fetch";

function intercomHelper(url, method = "GET", data = undefined) {
  const token = process.env.INTERCOM_ACCESS_TOKEN;
  if (!token) {
    console.warn("No Intercom token found");
  }

  return fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

exports.handler = async function(event, context, callback) {
  const { body } = event;
  const { email, name } = JSON.parse(body);
  const usersUrl = "https://api.intercom.io/users";

  try {
    const data = { email, name };
    const response = await intercomHelper(usersUrl, "POST", data);

    if (!response.ok) {
      callback(null, {
        statusCode: response.status,
        body: JSON.stringify({ status: response.statusText, data })
      });
    }

    const user = await response.json();

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(user)
    });
  } catch (e) {
    console.error(e);
    callback(null, {
      statusCode: 503,
      body: JSON.stringify({ status: "Service unavailable" })
    });
  }
};
