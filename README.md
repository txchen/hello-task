# Hello Task > Hello World

Every programming language has hello world, but it is usually useless. To evaluate a language, we need something more complex.

This repository contains examples for a few languages and they are doing the exact same thing:

* Get http://localhost:10000/posts, it will return a json array in body, which is the list of all posts.
* For each post, get http://localhost:10000/posts/id, it will return the post content in body.
* md5 hash the content of each post, concat all the hashes together order by post id, and hash the 'all hashes' again with md5.
* To make it faster, client can get posts in parallel, but parallelism cannot be too high (default = 10), otherwise server will throw error.

That's it - 'Hello Task'

### Server side

You must run an http server before run the clients. Server is written in nodejs, to start it:

```
$ cd server
$ npm install
$ npm run server
# it will listen on http://localhost:10000
```

### Hello task collection

* [Go](clients/go)
* [Node](clients/node)
* [Python](clients/python)
* [Ruby](clients/ruby)
* [C#](clients/csharp)
* [Rust](clients/rust) - Not finished
* [Nim](clients/nim) - Not finished
