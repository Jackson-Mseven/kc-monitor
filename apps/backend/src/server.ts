import app from './app'

app.listen({ port: Number(process.env.PORT), host: process.env.HOST }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`Server listening on http://localhost:${process.env.PORT}`)
})
