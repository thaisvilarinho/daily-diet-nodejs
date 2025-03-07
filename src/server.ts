import { env } from './env'
import { app } from './app'

app.get('/hello', async () => {
  return 'Hello World'
})
app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running')
  })
