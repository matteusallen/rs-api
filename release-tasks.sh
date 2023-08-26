#!/bin/bash

if [ "$DEPLOYMENT_ENV" != "pr_app" ]; then
  echo RUNNING MIGRATIONS IN PROCFILE
  npm run db:migrate
fi
