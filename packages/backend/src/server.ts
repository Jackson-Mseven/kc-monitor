import app from './app'

app.listen({ port: Number(process.env.PORT), host: process.env.HOST }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`Server listening on ${address}`)
})
