import { Resend } from 'resend';
import nodemailer from 'nodemailer';

interface SendMailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailParams) {
  
  if(process.env.NEXT_MAILHOG && process.env.NEXT_MAILHOG === "true"){
    sendMailToMailhog({to, subject, html})
  }else{
    sendRealMail({to, subject, html})
  }
}

async function sendRealMail({to, subject, html}: SendMailParams){

  const resend = new Resend(process.env.RESEND_API_KEY);
    return resend.emails.send({
      from: 'Kairos <noreply@kairos.anthonyboschat.com>',
      to,
      subject,
      html,
  });

}

async function sendMailToMailhog({ to, subject, html }: SendMailParams) {
  const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
    secure: false,
  });

  return transporter.sendMail({
    from: 'test@example.com',
    to,
    subject,
    html,
  });
}