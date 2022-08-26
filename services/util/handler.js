import * as debug from './debug';

const handler = lambda => {
  return async (evt, context) => {
    let body, statusCode;

    // Start debugger
    debug.init(evt);

    try {
      // Run the Lambda
      body = await lambda(evt, context);
      statusCode = 200;
    } catch (err) {
      // Print debug messages
      debug.flush(err);

      body = {error: err.message};
      statusCode = 500;
    }

    // Return HTTP response
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  };
};

export default handler;
