// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const faunadb=require('faunadb');
q=faunadb.query;

const handler = async (event,context) => {
  try {
    var client = new faunadb.Client({ secret: process.env.Faunadb_secret });
    let reqObj = JSON.parse(event.body);
    var result = await client.query(
        q.Delete(
          q.Ref(q.Collection('messages'), reqObj)
        )
      )
  
    // const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify({ delId: `${result.ref.id}` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
