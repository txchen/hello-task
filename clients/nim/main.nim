import httpclient, json, md5, threadpool, strutils, os, times

proc getPostMd5(url: string): string =
  # httpclient is not gcsafe, so far cannot used in spawn
  #let content = getContent("http://localhost:10000" & url)
  sleep(1)
  let content = url
  result = getMD5(content)

proc main() =
  let start = epochTime()
  let posts = parseJson(getContent("http://localhost:10000/posts"))
  echo("there are ", len(posts), " posts in all.")
  var digest = newSeq[string](len(posts))

  for i in 0..digest.high:
    digest[i] = ^spawn getPostMd5(getStr(posts[i]))

  sync()
  echo(getMD5(join(digest)))
  echo("time elapsed: ", (epochTime() - start) * 1000)

main()
