import express from 'express'
import logger from 'morgan'
import wga from 'wga'

let app = express()
app.use(logger('dev', {
  skip: (req, res) => res.statusCode < 400
}))

let config = {
  totalPosts: 200
}
let concurrencyCount = 0

function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms))
}

app.get('/posts', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  let posts = []
  for (let i = 0; i < config.totalPosts; i++) {
    posts.push('/posts/' + (i + 1))
  }
  res.send(JSON.stringify(posts, null, 2))
})

app.get('/posts/:postid', wga(async (req, res) => {
  let id = parseInt(req.params.postid)
  concurrencyCount++
  if (id >= 1 && id <= config.totalPosts) {
    let sleepMs = parseInt((Math.random() * 10000000) % 1000)
    console.log(`current concurrency: ${concurrencyCount}, url: ${req.url}, sleep ${sleepMs}`)
    await sleep(sleepMs)
    res.send('Best article in the world, no: ' + req.params.postid)
  } else {
    res.status(404).send('post not found')
  }
  concurrencyCount--
}))

export default app
