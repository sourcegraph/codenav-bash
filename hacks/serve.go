package main

import (
	"io/ioutil"
	"log"
	"net/http"
)

func main() {
	m := http.NewServeMux()
	m.HandleFunc("/tree-sitter.js", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("/tree-sitter.js")
		b, _ := ioutil.ReadFile("tree-sitter-localhost.js")
		w.Header().Set("Content-Type", "text/javasript")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write([]byte(b))
	})
	m.HandleFunc("/tree-sitter.wasm", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("/tree-sitter.wasm")
		b, _ := ioutil.ReadFile("tree-sitter.wasm")
		w.Header().Set("Content-Type", "application/wasm")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write([]byte(b))
	})
	m.HandleFunc("/main.html", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("/main.html")
		b, _ := ioutil.ReadFile("index.html")
		w.Header().Set("Content-Type", "text/html")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write([]byte(b))
	})
	m.HandleFunc("/index.js", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("/index.js")
		b, _ := ioutil.ReadFile("index.js")
		w.Header().Set("Content-Type", "text/javascript")
		w.Write([]byte(b))
	})
	m.HandleFunc("/tree-sitter-bash.wasm", func(w http.ResponseWriter, r *http.Request) {
		log.Printf("/tree-sitter-bash.wasm")
		b, _ := ioutil.ReadFile("tree-sitter-bash.wasm")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/wasm")
		w.Write([]byte(b))
	})
	log.Printf("Listening on :8000")
	log.Fatal(http.ListenAndServe(":8000", m))
}
