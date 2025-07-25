import nodemailer, { Transporter } from 'nodemailer'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyInstance {
    mailer: Transporter
  }
}

export default fp(async (fastify) => {
  const mailer = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await mailer.verify()

  fastify.decorate('mailer', mailer)
})
