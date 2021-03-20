#! /bin/bash

set -ex

if [ "$INCOMING_WEBHOOK" = "" ] ; then
  echo "Insuffcient parameters."
  exit 1
fi

gcloud functions deploy notify-cloudbuild-slack \
  --entry-point notifyCloudbuildSlack \
  --region asia-northeast2 \
  --memory 128MB \
  --runtime nodejs12 \
  --trigger-topic cloud-builds \
  --set-env-vars INCOMING_WEBHOOK=$INCOMING_WEBHOOK
  