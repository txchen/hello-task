import time
import requests
import hashlib
# multiprocessing.dummy uses threads, multiprocessing uses processes
from multiprocessing.dummy import Pool

def md5Hash(input):
    md5 = hashlib.md5()
    md5.update(input)
    return md5.hexdigest()

def getPostMd5(url):
    response = requests.get('http://localhost:10000' + url)
    return md5Hash(response.text)

def main():
    start = time.time()
    response = requests.get('http://localhost:10000/posts')
    posts = response.json()
    print('there are %d posts in all.' % len(posts))

    pool = Pool(10)
    result = pool.map(getPostMd5, posts)
    print('final md5: %s' % md5Hash(''.join(result)))
    print('time elapsed: %s' % int((time.time() - start) * 1000))

if __name__ == '__main__':
    main()
