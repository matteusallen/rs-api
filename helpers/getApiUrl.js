function getApiUrl(deploymentEnv) {
  let apiUrl = `http://localhost:${process.env.PORT}`;
  switch (deploymentEnv) {
    case 'pr_app':
      apiUrl = `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`;
      break;
    case 'dev':
    case 'staging':
      apiUrl = `https://open-stalls-api-${deploymentEnv}.herokuapp.com`;
      break;
    case 'production':
      apiUrl = `https://open-stalls-api-prod.herokuapp.com`;
      break;
  }
  return apiUrl;
}

// NOTE: For some reason Heroku scheduler dyno doesn't like ES6 exports, switching this back to commonjs module.exports
module.exports = getApiUrl;
