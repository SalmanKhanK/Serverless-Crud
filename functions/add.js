// // Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
// const handler = async (event) => {
//   try {
//     const subject = event.queryStringParameters.name || 'World'
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: `Hello ${subject}` }),
//       // // more keys you can return:
//       // headers: { "headerName": "headerValue", ... },
//       // isBase64Encoded: true,
//     }
//   } catch (error) {
//     return { statusCode: 500, body: error.toString() }
//   }
// }

// module.exports = { handler }

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const faunadb=require('faunadb');
q=faunadb.query;

const handler = async (event,context) => {
  try {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
      }
    var client = new faunadb.Client({ secret: "fnAD92ORUHACB-5Rlv7tS-tNSyVyreWPPP20141u" });
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

