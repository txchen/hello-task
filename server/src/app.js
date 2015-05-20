import express from 'express'
import logger from 'morgan'
import wga from 'wga'

let app = express()
app.use(logger('dev', {
  skip: (req, res) => res.statusCode < 400
}))

let config = {
  totalPosts: 200,
  maxConcurrency: 10,
  minWaitTime: 100,
  maxWaitTime: 200
}
let concurrencyCount = 0

function sleep(ms = 0) {
  return new Promise(r => setTimeout(r, ms))
}

app.get('/config', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(config, null, 2))
})

app.post('/config/:key/:value', (req, res) => {
  let intValue = parseInt(req.params.value)
  if (config.hasOwnProperty(req.params.key) && !isNaN(intValue)) {
    config[req.params.key] = intValue
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(config, null, 2))
  } else {
    res.status(401).send('bad request')
  }
})

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
  if (concurrencyCount == config.maxConcurrency) {
    res.status(429).send('max concurrency reached')
    return
  }
  concurrencyCount++
  if (id >= 1 && id <= config.totalPosts) {
    let sleepMs = parseInt(config.minWaitTime + Math.random() * (config.maxWaitTime - config.minWaitTime))
    console.log(`current concurrency: ${concurrencyCount}, url: ${req.url}, sleep ${sleepMs}`)
    await sleep(sleepMs)
    res.send('Best article in the world, no: ' + req.params.postid)
  } else {
    res.status(404).send('post not found')
  }
  concurrencyCount--
}))

export default app
