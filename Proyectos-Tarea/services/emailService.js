import users from '../models/users.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Generar código de 6 dígitos
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendResetEmail = async (email) => {

  // const code = generateResetCode();
  // // guardamos el código en la BD
  // await users.findOneAndUpdate(
  //   { email },
  //   { token: code, resetCodeExpires: Date.now() + 10 * 60 * 1000 }
  // );

  console.log(process.env.EMAIL_USER);
  console.log(email);
  
  const options = () => {
    return {
      from: process.env.EMAIL_USER,
      to: "migueldulceyd@gmail.com",
      subject: "prueba",
      text: "holahola",
    };
  };

  // Send email
  await transporter.sendMail(options(), (error, info) => {

    
    if (error) {

      return error;
    } else {
      
    }
  })
  }