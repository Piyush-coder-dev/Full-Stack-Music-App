import express from "express"
import cors from "cors"
import fs from "fs/promises"
import fsn from "fs"
import path from "path"
const app = express()
const PORT = 5000;

// app.use(express.static("songs"))
app.use(cors())

const files = await fs.readdir("songs");
// fs.readdir("songs") not given the full path of songs folder because server.js and songs folder are in the same folder. so it could acced it
const songFiles = files.filter(file => file.endsWith(".m4a") || file.endsWith(".mp3"))
const songsPath = songFiles.map(song => `/Backend/songs/${song}`) // full_path of song like /Backend/songs/1.m4a

app.get("/api", (req, res) => {
    res.json({songs: songsPath})
})

app.listen(PORT, ()=> {
    console.log(`server is listening at localhost:${PORT}`)
})