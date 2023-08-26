const fetch = require('node-fetch');

const { ssURL } = require('../config/vars');

export const ssPost = (path, content) => {
  const options = {
    method: 'post',
    body: JSON.stringify(content),
    headers: {
      'Content-Type': 'application/json',
      token: process.env.SHARED_SERVICES_TOKEN
    }
  };
  return fetch(`${ssURL}${path}`, options)
    .then(async res => {
      return res.json();
    })
    .catch(err => {
      return err;
    });
};

export const ssGet = path => {
  return fetch(`${ssURL}${path}`, {
    headers: {
      token: process.env.SHARED_SERVICES_TOKEN
    }
  }).then(async res => res.json());
};

export default {
  ssPost,
  ssGet
};
