#! /bin/sh

INCOMING_WEBHOOK=$1
source .env

gcloud functions deploy notifyToSlack \
  --runtime nodejs8 \
  --trigger-topic cloud-builds \
  --set-env-vars INCOMING_WEBHOOK=$INCOMING_WEBHOOK
  