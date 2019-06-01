#! /bin/sh

webhook=$1

gcloud functions deploy notifyToSlack \
  --runtime nodejs8 \
  --trigger-topic cloud-builds \
  --set-env-vars INCOMING_WEBHOOK=$webhook