const moment = require('moment')
const IncomingWebhook = require('@slack/client').IncomingWebhook;
const SLACK_WEBHOOK_URL = process.env.INCOMING_WEBHOOK
const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

moment.locale('ja')

// subscribe is the main function called by Cloud Functions.
module.exports.notifyToSlack = (event, callback) => {
  const build = eventToBuild(event.data);

  // Skip if the current status is not in the status list.
  // Add additional statues to list if you'd like:
  // QUEUED, WORKING, SUCCESS, FAILURE,
  // INTERNAL_ERROR, TIMEOUT, CANCELLED
  const status = ['SUCCESS', 'FAILURE', 'INTERNAL_ERROR', 'TIMEOUT'];
  if (status.indexOf(build.status) === -1) {
    return callback();
  }

  // Send message to Slack.
  const message = createSlackMessage(build);
  webhook.send(message, callback);
};

// eventToBuild transforms pubsub event message to a build object.
const eventToBuild = (data) => {
  return JSON.parse(new Buffer(data, 'base64').toString());
}

// createSlackMessage creates a message from a build object.
const createSlackMessage = (build) => {
  const startTime = new Date(build.startTime);
  const finishTime = new Date(build.finishTime);
  const createTime = moment(new Date(build.createTime))
  const buildTime = finishTime.getTime() - startTime.getTime();
  const buildMin = Math.floor(buildTime / (60 * 1000));
  const buildSec = Math.round((buildTime % (1000 * 60)) / 1000)
  const color = build.status === 'SUCCESS' ? '#0040FF' : '#FE2E2E'

  // Set timezone for ja
  createTime.add('hours', 9)

  return {
    mrkdwn: true,
    attachments: [
      {
        text: `Build ${build.source.repoSource.repoName}/${build.source.repoSource.branchName} started at ${createTime.format('YYYY/MM/DD HH:mm:ss')} finished with ${build.status} in ${buildMin} min ${buildSec} sec.
${build.logUrl}`,
        color,
      }
    ]
  };
}
