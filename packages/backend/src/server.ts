import { ENV } from './constants/env'

import app from './app'

app.listen({ port: ENV.PORT, host: ENV.HOST }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`Server listening on ${address}`)
})
