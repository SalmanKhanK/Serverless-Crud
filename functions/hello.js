// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const faunadb=require('faunadb');
q=faunadb.query;

const handler = async (event,context) => {
  try {
    var client = new faunadb.Client({ secret: "fnAD92ORUHACB-5Rlv7tS-tNSyVyreWPPP20141u" });
    // var result = await client.query(
    //   q.Get(q.Ref(q.Collection('messages'),"285995303843136007"))
    // );

    var result= await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index("all_messages"))),
        q.Lambda('x', q.Get(q.Var('x')))
      )
    )
    console.log(result.data.map(x => x.data.details));

    // const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify(result.data),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    console.log(error)
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
