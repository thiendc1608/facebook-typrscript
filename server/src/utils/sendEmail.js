import nodemailer from "nodemailer";

export const sendEmailService = (recipient_email, OTP) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });
    const mail_configs = {
      from: process.env.MY_EMAIL,
      to: recipient_email,
      subject: "SEND PASSWORD RECOVERY",
      html: `<!DOCTYPE html>
          <html lang="en" >
          <head>
            <meta charset="UTF-8">
            <title>OTP Email</title>
          </head>
          <body>
          <!-- partial:index.partial.html -->
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Send by Doan Cao Thien</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 1 minutes</p>
            <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
            <p style="font-size:0.9em;">Regards,<br />doanthien 16</p>
            <hr style="border:none;border-top:1px solid #eee" />
          </div>
            </div>
            <!-- partial -->
            </body>
            </html>`,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfully" });
    });
  });
};
