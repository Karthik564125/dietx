import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface ConsultationMailData {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
    activityLevel: string;
    bmi: number;
    dailyCalories: number;
  };
  payment: {
    orderId: string;
    paymentId: string;
    amount: number;
    date: string;
  };
}

export class MailService {
  static async sendConsultationMail(data: ConsultationMailData) {
    const { user, payment } = data;
    const receiver = process.env.SMTP_RECEIVER || 'nutriwithdietex@gmail.com';

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Consultation Purchase</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f7f6; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .content { padding: 30px; }
        .section { margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
        .section:last-child { border-bottom: none; }
        .section-title { font-size: 14px; font-weight: 900; color: #059669; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .info-item { margin-bottom: 10px; }
        .info-label { font-size: 11px; color: #999; font-weight: bold; text-transform: uppercase; }
        .info-value { font-size: 15px; color: #1f2937; font-weight: 600; }
        .payment-badge { display: inline-block; background: #ecfdf5; color: #065f46; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; margin-top: 10px; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; }
        .highlight { color: #10b981; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>DIET <span style="color: #fff; opacity: 0.8;">X</span> PREMIUM</h1>
          <p style="margin-top: 5px; font-weight: 500;">New Consultation Request</p>
        </div>
        <div class="content">
          <div class="section">
            <div class="section-title">Success Notification</div>
            <p>A new premium nutrition consultation has been successfully purchased. Here are the details for the dietician.</p>
            <div class="payment-badge">✓ Payment Verified (₹${payment.amount})</div>
          </div>

          <div class="section">
            <div class="section-title">Personal Profile</div>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" class="info-item">
                  <div class="info-label">Full Name</div>
                  <div class="info-value">${user.name}</div>
                </td>
                <td width="50%" class="info-item">
                  <div class="info-label">Age / Gender</div>
                  <div class="info-value">${user.age} yrs / ${user.gender}</div>
                </td>
              </tr>
              <tr>
                <td class="info-item">
                  <div class="info-label">Email Address</div>
                  <div class="info-value">${user.email}</div>
                </td>
                <td class="info-item">
                  <div class="info-label">Phone Number</div>
                  <div class="info-value">${user.phone}</div>
                </td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Health Biometrics</div>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="33%" class="info-item">
                  <div class="info-label">Height</div>
                  <div class="info-value">${user.height.toFixed(1)} cm</div>
                </td>
                <td width="33%" class="info-item">
                  <div class="info-label">Weight</div>
                  <div class="info-value">${user.weight.toFixed(1)} kg</div>
                </td>
                <td width="33%" class="info-item">
                  <div class="info-label">BMI</div>
                  <div class="info-value highlight">${user.bmi}</div>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="info-item">
                  <div class="info-label">Activity Level</div>
                  <div class="info-value">${user.activityLevel}</div>
                </td>
                <td class="info-item">
                  <div class="info-label">Daily Target</div>
                  <div class="info-value">${user.dailyCalories} kcal</div>
                </td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Transaction Details</div>
            <div class="info-item">
              <div class="info-label">Razorpay Payment ID</div>
              <div class="info-value" style="font-family: monospace; font-size: 13px;">${payment.paymentId}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Razorpay Order ID</div>
              <div class="info-value" style="font-family: monospace; font-size: 13px;">${payment.orderId}</div>
            </div>
            <div class="info-item">
              <div class="info-label">User ID</div>
              <div class="info-value" style="font-family: monospace; font-size: 12px; color: #999;">${user.id}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Purchase Date</div>
              <div class="info-value">${payment.date}</div>
            </div>
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Diet X Wellness. All rights reserved.<br>
          This is an automated notification for internal use only.
        </div>
      </div>
    </body>
    </html>
    `;

    const textFallback = `
      New Diet X Premium Consultation Purchase
      
      User Details:
      Name: ${user.name}
      Email: ${user.email}
      Phone: ${user.phone}
      Age: ${user.age}
      Gender: ${user.gender}
      
      Health Stats:
      BMI: ${user.bmi}
      Daily Calories: ${user.dailyCalories}
      
      Payment Details:
      Amount: ₹${payment.amount}
      Payment ID: ${payment.paymentId}
      Order ID: ${payment.orderId}
      Date: ${payment.date}
    `;

    const mailOptions = {
      from: '"Diet X Notifications" <' + process.env.SMTP_EMAIL + '>',
      to: receiver,
      subject: 'New Diet X Premium Consultation Purchase',
      text: textFallback,
      html: htmlContent,
      replyTo: user.email,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Consultation email sent successfully:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending consultation email:', error);
      throw error;
    }
  }
}
