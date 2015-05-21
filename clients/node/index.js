var async = require('async')
var agent = require('superagent')
var utility = require('utility')

var postsUrl = 'http://localhost:10000/posts'
var baseUrl = 'http://localhost:10000'

var start = new Date()
agent.get(postsUrl)
  .end(function (err, res) {
    if (err) {
      console.log(err)
    } else {
      console.log('there are ' + res.body.length + ' posts in all.')
      downloadAllPost(res.body)
    }
})

function fetchAndHash(url, cb) {
  agent.get(baseUrl + url)
    .end(function (err, res) {
      if (err || !res.ok) {
        cb(err, null)
      } else {
        cb(null, utility.md5(res.text))
      }
    })
}

function downloadAllPost(posts) {
  async.mapLimit(posts, 10, fetchAndHash, function (err, result) {
    if (err) {
      console.log('failed to download all posts', err)
    } else {
      console.log('all posts downloaded.')
      console.log('final md5: ' + utility.md5(result.join('')))
      console.log('time elapsed: ' + (new Date() - start))
    }
  })
}
