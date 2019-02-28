# wiga-youtube-rest
Download and convert youtube videos into MP3. Infra using docker composer


```
docker compose up
```

```
 POST http://localhost:8080/convert?url=https://www.youtube.com/watch?v=4ftVtxVkXuw
```
## Response JSON

```
{
  "data": {
    "full_title": "pamba ganapathi parinte adhipathi 🎶🎶DhaneshHD🎶🎶",
    "thumbnail": "https://i.ytimg.com/vi/4UK-ACxPD6o/maxresdefault.jpg",
    "duration": "00:05:12",
    "file_name": "http://localhost:8080/static/4UK-ACxPD6o.mp3"
  }
}

```
