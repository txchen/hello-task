package main

import (
	"crypto/md5"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"
)

func main() {
	start := time.Now()
	posts := getPostUrls()
	totalPost := len(posts)
	fmt.Printf("there are %d posts in all.\n", totalPost)

	res := make([]string, totalPost)
	sem := make(chan int, totalPost)
	throttle := make(chan int, 10)
	for i, p := range posts {
		go func(index int, url string) {
			throttle <- 0
			res[index] = getPostMd5("http://localhost:10000" + url)
			sem <- 0
			<-throttle
		}(i, p)
	}
	for i := 0; i < len(posts); i++ {
		<-sem
	}

	allMd5 := strings.Join(res, "")
	fmt.Printf("final md5: %x\n", md5.Sum([]byte(allMd5)))
	fmt.Printf("time elapsed: %.0f\n", time.Since(start).Seconds()*1000)
}

func getHTTPBody(url string) []byte {
	response, err := http.Get(url)
	if err != nil {
		fmt.Printf("failed to get url: %s, err: %s", url, err)
		os.Exit(1)
	}
	defer response.Body.Close()
	body, _ := ioutil.ReadAll(response.Body)
	return body
}

func getPostMd5(url string) string {
	return fmt.Sprintf("%x", md5.Sum(getHTTPBody(url)))
}

func getPostUrls() []string {
	body := getHTTPBody("http://localhost:10000/posts")
	var data []string
	if err := json.Unmarshal(body, &data); err != nil {
		panic(err.Error())
	}
	return data
}
