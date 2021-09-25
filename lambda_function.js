var aws = require("aws-sdk");

const successResponse = {
    "statusCode": 200,
    "headers": {
        "Content-Type": "application/json",
    },
    "body": JSON.stringify({ message: ":)" }),
    "isBase64Encoded": false
};

const errorResponse = {
    "statusCode": 500,
    "headers": {
        "Content-Type": "application/json",
    },
    "body": JSON.stringify({ message: "something bad happen, check logs" }),
    "isBase64Encoded": false
};

exports.handler = async(event, context, callback) => {
    aws.config.update({region: 'eu-west-1'});
    const requestBody = event.body;
    const request = JSON.parse(requestBody);
    console.log(request);
    const sendToEmail = "YOUR_EMAIL_ADDRESSzxcid8nn56h@gmail.com";

    const params = {
        Destination: {
            ToAddresses: [sendToEmail]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `
                    <body>
                    <p>${request.message}</p>
                    <pre>${JSON.stringify(request, undefined, 2)}</pre>
                    </body>
                    `
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: [request._subject]
            }
        },
        Source: `${request.name || "Name unknown"} <your_address@gmail.com>`,
        ReplyToAddresses: [request._replyTo]
    };

    const sendPromise = new aws.SES()
        .sendEmail(params)
        .promise();

    await sendPromise
        .then(data => {
            console.log(`E-mail sent to ${sendToEmail}`);
            console.log(successResponse);
            callback(null, successResponse);
        })
        .catch(err => {
            console.log("E-mail NOT sent", err);
            console.log(errorResponse);
            callback(errorResponse);
        });
};
