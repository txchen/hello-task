extern crate hyper;
extern crate rustc_serialize;

use rustc_serialize::json::Json;
use std::io::Read;

use hyper::Client;

fn main() {
    let mut client = Client::new();
    let mut res = client.get("http://localhost:10000/posts").send().unwrap();

    let mut body = String::new();
    res.read_to_string(&mut body).unwrap();

    let body_json = Json::from_str(&body).unwrap();
    let posts = body_json.as_array().unwrap();

    println!("there are {} posts in all", posts.len());
    for post in posts.iter() {
        println!("{}", post);
    }
}
