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

type postResult struct {
	content string
	index   int
}

var throttle = make(chan int, 10)
var results = make(chan postResult)

func main() {
	posts := getPostUrls()
	fmt.Printf("there are %d posts in all.\n", len(posts))
	start := time.Now()

	for i, p := range posts {
		index, url := i, p
		go func() {
			throttle <- 0
			results <- postResult{getPostMd5("http://localhost:10000" + url), index}
			<-throttle
		}()
	}

	md5Map := make(map[int]string)
	for i := 0; i < len(posts); i++ {
		res := <-results
		md5Map[res.index] = res.content
	}

	var md5s []string
	for i := 0; i < len(posts); i++ {
		md5s = append(md5s, md5Map[i])
	}

	allMd5 := strings.Join(md5s, "")
	fmt.Printf("final md5: %x\n", md5.Sum([]byte(allMd5)))
	fmt.Printf("time elapsed: %.0f\n", time.Since(start).Seconds()*1000)
}

func getPostMd5(url string) string {
	response, err := http.Get(url)
	if err != nil {
		fmt.Printf("failed to get post: %s", err)
		os.Exit(1)
	}
	defer response.Body.Close()
	body, _ := ioutil.ReadAll(response.Body)
	return fmt.Sprintf("%x", md5.Sum(body))
}

func getPostUrls() []string {
	response, err := http.Get("http://localhost:10000/posts")
	var data []string
	if err != nil {
		fmt.Printf("failed to get post list: %s", err)
		os.Exit(1)
	} else {
		defer response.Body.Close()
		body, _ := ioutil.ReadAll(response.Body)
		err = json.Unmarshal(body, &data)
		if err != nil {
			panic(err.Error())
		}
	}
	return data
}
