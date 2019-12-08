#! /bin/bash

set -ex

if [ "$INCOMING_WEBHOOK" = "" ] ; then
  echo "Insuffcient parameters."
  exit 1
fi

gcloud functions deploy notifyToSlack \
  --runtime nodejs8 \
  --trigger-topic cloud-builds \
  --set-env-vars INCOMING_WEBHOOK=$INCOMING_WEBHOOK
  