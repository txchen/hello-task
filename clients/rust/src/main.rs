extern crate hyper;
extern crate rustc_serialize;
extern crate crypto;
extern crate time;

use rustc_serialize::json::Json;
use std::io::Read;
use crypto::md5::Md5;
use crypto::digest::Digest;
use time::now;
use hyper::Client;

fn get_post(url: &str) -> String {
    let mut client = Client::new();
    let post_url = "http://localhost:10000".to_string() + url;
    let mut res = client.get(&post_url[..]).send().unwrap();

    let mut body = String::new();
    res.read_to_string(&mut body).unwrap();

    let mut md5 = Md5::new();
    md5.input(body.as_bytes());

    body
}

fn main() {
    let started = time::now();
    let mut client = Client::new();
    let mut res = client.get("http://localhost:10000/posts").send().unwrap();

    let mut body = String::new();
    res.read_to_string(&mut body).unwrap();

    let body_json = Json::from_str(&body).unwrap();
    let posts = body_json.as_array().unwrap();

    println!("there are {} posts in all", posts.len());

    for post in posts.iter() {
        println!("{}", get_post(post.as_string().unwrap()));
    }

    let elapsed = time::now() - started;
    println!("time elapsed: {}", elapsed);
}
