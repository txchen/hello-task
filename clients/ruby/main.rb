require 'pmap'
require 'unirest'
require 'digest'

def digest_md5(input)
  md5 = Digest::MD5.new
  md5.update input
  return md5.hexdigest
end

def get_post_md5(url)
  response = Unirest.get "http://localhost:10000" + url
  return digest_md5 response.raw_body
end

start_time = Time.new()
response = Unirest.get "http://localhost:10000/posts"
puts 'there are %d posts in all.' % response.body.length
md5s = response.body.pmap(10) {|p| get_post_md5(p)}
puts "final md5: " + digest_md5(md5s.join(''))
puts "time elapsed: %d" % ((Time.new() - start_time) * 1000)
