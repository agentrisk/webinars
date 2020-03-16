const axios = require("axios").default;

const baseUrl = "https://api.intercom.io";
const usersUrl = `${baseUrl}/users`;
const tagsUrl = `${baseUrl}/tags`;
const webinarTag = "Webinar";

function getHeaders() {
  const token = process.env.INTERCOM_ACCESS_TOKEN;
  if (!token) {
    console.warn("No Intercom token found");
  }

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json"
  };
}

function createOrUpdateUser(data) {
  const headers = getHeaders();
  const url = usersUrl;

  return axios.post(url, data, { headers });
}

function tagUser(email, tagName) {
  const headers = getHeaders();
  const url = tagsUrl;
  const data = { name: tagName, users: [{ email }] };

  return axios.post(url, data, { headers });
}

exports.handler = async function(event, context, callback) {
  const { body } = event;
  const { email, name, tag } = JSON.parse(body);

  try {
    const data = {
      email,
      name,
      custom_attributes: { is_advisor: true }
    };

    await createOrUpdateUser(data);
    await tagUser(email, webinarTag);
    if (tag) {
      await tagUser(email, tag);
    }

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ status: "OK" })
    });
  } catch (error) {
    console.warn(error);

    if (error.response) {
      return callback(null, {
        statusCode: error.response.status,
        body: JSON.stringify({ status: error.response.statusText })
      });
    }

    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({ status: "Service unavailable" })
    });
  }
};
