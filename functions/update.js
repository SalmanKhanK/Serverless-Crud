// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const faunadb=require('faunadb');
q=faunadb.query;

const handler = async (event,context) => {
  try {
    var client = new faunadb.Client({ secret: "fnAD92ORUHACB-5Rlv7tS-tNSyVyreWPPP20141u" });
    let reqObj = JSON.parse(event.body);
    console.log(reqObj)
     var result=await client.query(
        q.Update(
            q.Ref(q.Collection('messages'), reqObj.id),
            { data: { details:reqObj.details} },
          )
     )
    console.log("all the entries " + result.data.details)

    // const subject = event.queryStringParameters.name || 'World'
    return {
      statusCode: 200,
      body: JSON.stringify({message:`${result}`}),
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
