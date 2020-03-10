const axios = require("axios").default;

const baseUrl = "https://api.intercom.io";
const usersUrl = `${baseUrl}/users`;

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

function lookupUser(email) {
  const headers = getHeaders();
  const url = `${usersUrl}?email=${email}`;

  return axios.get(url, { headers });
}

exports.handler = async function(event, context, callback) {
  const { body } = event;
  const { email, name, tag } = JSON.parse(body);

  try {
    let response = await lookupUser(email);
    const lookupResponse = await response.data;
    let tags = null;

    if (
      lookupResponse.total_count &&
      lookupResponse.users[0].custom_attributes &&
      lookupResponse.users[0].custom_attributes.tags
    ) {
      tags = JSON.parse(lookupResponse.users[0].custom_attributes.tags);

      if (tags.indexOf(tag) === -1) {
        tags.push(tag);
      } else {
        console.log(`Tag ${tag} is already registered`);
      }
    } else {
      tags = [tag];
    }

    const custom_attributes = {
      is_advisor: true,
      tags: JSON.stringify(tags)
    };

    const data = {
      email,
      name,
      custom_attributes
    };

    await createOrUpdateUser(data);

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ status: "OK" })
    });
  } catch (error) {
    console.warn(error);

    if (error.response) {
      callback(null, {
        statusCode: error.response.status,
        body: JSON.stringify({ status: error.response.statusText })
      });
    }
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ status: "Service unavailable" })
    });
  }
};
