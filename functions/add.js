
const faunadb=require('faunadb');
q=faunadb.query;

const handler = async (event,context) => {
  try {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
      }
    var client = new faunadb.Client({ secret: process.env.Faunadb_secret });
    let reqObj = JSON.parse(event.body);

    var result = await client.query(
        q.Create(
          q.Collection('messages'),
          { data: { details: reqObj.details} },
        )
      );
    // const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify({ id: `${result.ref.id}` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }

