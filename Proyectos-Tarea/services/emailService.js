
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const sendResetEmail = async (email, token)=>{
   const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
 
  await transporter.sendMail({
    from: '"Tu App" <no-reply@tudominio.com>',
    to: email,
    subject: 'Restablecimiento de contraseña',
    html: `Haga clic <a href="${resetLink}">aquí</a> para restablecer su contraseña.`
  });
}