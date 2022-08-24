import handler from '../util/handler';
import dynamoDb from '../util/dynamodb';

export const main = handler(async evt => {
  const params = {
    TableName: process.env.TABLE_NAME,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    Key: {
      userId: evt.requestContext.authorizer.iam.cognitoIdentity.identityId, // The id of the author
      noteId: evt.pathParameters.id, // The id of the note from the path
    },
  };

  const result = await dynamoDb.get(params);
  if (!result.Item) {
    throw new Error('Item not found.');
  }

  // Return the retrieved item
  return result.Item;
});