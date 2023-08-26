#!/bin/sh
docker-compose up -d postgres

echo "waiting to accept connections..."
WAIT_FOR_PG_ISREADY="while ! pg_isready; do sleep 1; done;"
docker-compose exec postgres bash -c "$WAIT_FOR_PG_ISREADY"
echo "test postgresdb is ready."

echo "setting environment variables..."
export API_URL=''
export PORT=''
export JWT_SECRET=''
export JWT_EXPIRATION_MINUTES=''
export GOOGLE_MAPS_API_KEY=''
export SHARED_SERVICES_TOKEN=''
export GATEWAY_TOKEN=''
export TWILIO_SID=''
export TWILIO_AUTH_TOKEN=''
export TWILIO_MESSAGING_SERVICE_SID=''
export BUGSNAG_API_KEY=''
export STRIPE_PK=''
export APP_URL=''
export AWS_ACCESS_KEY=''
export AWS_SECRET_KEY=''
export AWS_BUCKET=''
export AWS_REGION=''
export AWS_S3=''
export NODE_ENV=test
export SQL_HOST=localhost
export SQL_DATABASE_TEST=reservationsLocalTest
export SQL_PORT=2345
export PGPASSWORD=password
export PGUSER=postgres
export VAPID_PRIVATE_KEY=''
export VAPID_PUBLIC_KEY=''
export SUPPORT_WEBMASTER=''
export NEW_RELIC_APP_NAME=''
export NEW_RELIC_LICENSE_KEY=''
export NEW_RELIC_LOG=''
export NEW_RELIC_NO_CONFIG_FILE=''
export MAX_ROWS_FOR_DOWNLOAD=1
export FLAGSMITH_SECRET_KEY=''
export SLACK_WEBHOOK_URL=''

echo "start migration and seeding..."
sequelize db:migrate
sequelize db:seed:all
echo "migration and seeding complete."

echo "running all tests..."
jest --verbose --runInBand --detectOpenHandles --forceExit
testExitCode=$?
echo "tests done running..."

# tear down db and any other containers or network used
echo "tearing down all containers..."
docker-compose down -v --remove-orphans

# exit with failure if any test fails
if [ $testExitCode -eq 1 ]
  then
    exit 1
fi
