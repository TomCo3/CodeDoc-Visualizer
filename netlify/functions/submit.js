// /netlify/functions/submit.js

exports.handler = async function(event, context) {
    // Netlify automatically parses the incoming JSON request body.
    const data = JSON.parse(event.body);
    const base64Payload = data.payload; // This is the Base64 data sent from the frontend.

    // Print to the Netlify function logs.
    console.log("------[ PAYLOAD RECEIVED ]------");
    console.log("Raw Base64 Payload:", base64Payload);

    // Attempt to decode the Base64 string.
    if (base64Payload) {
        try {
            // Use Node.js's Buffer to decode.
            const decodedData = Buffer.from(base64Payload, 'base64').toString('utf8');
            console.log("------[ DECODED DATA ]------");
            console.log(decodedData);
            console.log("----------------------------");
        } catch (e) {
            console.error("Base64 Decoding Failed:", e.message);
        }
    }

    // A successful response must be returned, otherwise the frontend fetch will encounter an error.
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Data received successfully" })
    };
};
