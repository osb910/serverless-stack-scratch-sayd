import util from 'util';
import AWS from 'aws-sdk';

let logs;

// Log AWS SDK calls
AWS.config.logger = {log: debug};

export default function debug() {
  logs.push({
    date: new Date(),
    string: util.format.apply(null, arguments),
  });
}

export const init = evt => {
  logs = [];

  // Log API event
  debug('API event', {
    body: evt.body,
    pathParameters: evt.pathParameters,
    queryStringParameters: evt.queryStringParameters,
  });
};

export const flush = err => {
  logs.forEach(({date, string}) => console.debug(date, string));
  console.error(err);
};
