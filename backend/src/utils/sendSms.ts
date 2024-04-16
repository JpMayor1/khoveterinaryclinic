import https from "https";

export const sendSms = async (phoneNumber: string, code: string) => {
  const message = `Your reset password code is: ${code}`;

  const postData = JSON.stringify({
      messages: [
          {
              destinations: [{ to: phoneNumber }], // Admin's contact number
              from: process.env.SENDER_NAME, // Sender name
              text: message, // SMS message
          },
      ],
  });

  const options = {
      method: "POST",
      hostname: process.env.INFOBIP_HOST_NAME,
      path: process.env.INFOBIP_PATH,
      headers: {
          Authorization: `App ${process.env.INFOBIP_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
      },
  };

  const reqInfobip = https.request(options, (infobipRes) => {
      let chunks: Uint8Array[] = [];

      infobipRes.on("data", (chunk) => {
          chunks.push(chunk);
      });

      infobipRes.on("end", () => {
          const body = Buffer.concat(chunks);
          console.log(body.toString()); // Log the response body
      });

      infobipRes.on("error", (error) => {
          console.error(error); // Log any errors
      });
  });

  reqInfobip.write(postData);
  reqInfobip.end();
};