var aws = require("aws-sdk");

var ses = new aws.SES({ region: "us-east-2" });

exports.handler = async(event) => {
    console.log(event);
    console.log("hello");
    
    //const request = event;
    const request = JSON.parse(event.body);
    const sendToEmail = "YOUR_EMAIL@gmail.com";

    const params = {
        Message: {
            Body: {
                Text: { Data: request.message },
            },
            Subject: { Data: "Nouveau message de " + request.name },
        },
        Destination: {
            ToAddresses: [sendToEmail]
        },
        Source: sendToEmail,
        ReplyToAddresses: [request.replyTo]
    };

    return ses.sendEmail(params).promise();
};
