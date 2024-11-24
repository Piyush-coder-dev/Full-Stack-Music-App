import React, { useEffect, useRef, useState } from 'react'
import "./App.css"
import Vinyl_disc from "./assets/vinyl_disc.png"

const App = () => {

  const [musicList, setMusicList] = useState();
  const [sidebarList, setSidebarList] = useState();
  const [musicIndex, setMusicIndex] = useState(0)
  const [query, setQuery] = useState({ value: "" })
  const [currentTime, setCurrentTime] = useState("0:00")
  const [duration, setDuration] = useState("0:00")
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const mainAudio = useRef();
  const progressBox = useRef();
  const progressBar = useRef();

  const getMusic = async () => {
    let response = await fetch("http://localhost:5000/api");
    let data = await response.json()
    return data;
  }

  useEffect(() => {
    (async function () {
      let data = await getMusic()
      setMusicList(data.songs)
      // console.log(data, data.songs)
      let arr = data.songs.map(item => {
        return {
          name: item,
          display: true,
          id: data.songs.indexOf(item)
        }
      })
      setSidebarList(arr);
      // let x = Math.floor(Math.random() * musicList.length) // this will not work
      // because state takes time in changing so here musiclist is not changed it will
      // take time therefore used data.songs.length;
      let x = Math.floor(Math.random() * data.songs.length)
      setMusicIndex(x);
    })()
  }, [])

  const handleChange = (e) => {
    setQuery({ ...query, value: e.target.value })
    handleSearch(e.target.value);
    // console.log(musicList)
  }

  const handleSearch = (e) => {
    let arr = sidebarList;
    if (e.trim().length > 1) {
      sidebarList.forEach(element => {
        if (element.name.toLowerCase().indexOf(e.toLowerCase()) > 1) {
          // console.log(element.name)
          arr[arr.indexOf(element)].display = true
        }
        else {
          arr[arr.indexOf(element)].display = false;
        }
      });
      setSidebarList(arr)
    }
    else {
      let arr = musicList.map(item => {
        return {
          name: item,
          display: true,
          id: musicList.indexOf(item)
        }
      })
      setSidebarList(arr);
    }
  }

  const handleClick = (e) => {
    // Use currentTarget to ensure we're getting the data-id from the <li>
    const dataId = e.currentTarget.dataset.id;
    setMusicIndex(dataId)
  };

  const PlayMusic = () => {
    if (mainAudio.current && (mainAudio.current.paused || mainAudio.current.currentTime <= 0)) {
      mainAudio.current.play()
    }
    else {
      mainAudio.current.pause()
    }
  }

  const PlayMusic_ = () => {
    if (mainAudio.current) {
      mainAudio.current.play();
    }
  }


  const NextMusic = async () => {
    // Calculate the next index
    let nextIndex = musicIndex + 1;
    if (nextIndex >= musicList.length) {
      nextIndex = 0; // If we reach the end of the list, loop back to the start
    }
    setMusicIndex(nextIndex); // Update the music index state
  }

  const NextMusic_ = async () => {
    // Calculate the next index
    if (!shuffle && !repeat) {
      let nextIndex = musicIndex + 1;
      if (nextIndex >= musicList.length) {
        nextIndex = 0; // If we reach the end of the list, loop back to the start
      }
      setMusicIndex(nextIndex); // Update the music index state
    }
    else if (shuffle) {
      let index = Math.floor(Math.random() * musicList.length);
      setMusicIndex(index)
    }
    else if (repeat) {
      if (mainAudio.current) {
        mainAudio.current.currentTime = 0;
        mainAudio.current.play();
      }
    }
  }

  const PrevMusic = () => {
    setMusicIndex(e => e - 1)
    if (musicIndex < 0) {
      setMusicIndex(musicList.length)
    }
  }

  const timestampC = () => {
    let Min = Math.floor(mainAudio.current.currentTime / 60);
    let Sec = Math.floor(mainAudio.current.currentTime % 60);
    // console.log(Min)
    if (Sec < 10) {
      Sec = `0${Sec}`
      // console.log(Sec)
    }
    setCurrentTime(`${Min}:${Sec}`)
    progressBar.current.style.width = `${(mainAudio.current.currentTime / mainAudio.current.duration) * 100}%`
  }

  const handleLoaded = () => {
    let Min = Math.floor(mainAudio.current.duration / 60);
    let Sec = Math.floor(mainAudio.current.duration % 60);
    if (Sec < 10) {
      Sec = `0${Sec}`
    }
    setDuration(`${Min}:${Sec}`)
  }

  const handleSeek = (e) => {
    let totalWidth = e.currentTarget.clientWidth;
    let clickedPoint = e.nativeEvent.offsetX;
    mainAudio.current.currentTime = (clickedPoint / totalWidth) * mainAudio.current.duration;
  }

  useEffect(() => {
    if (mainAudio.current) {
      mainAudio.current.play()
    }
  }, [musicIndex])


  return (
    <>
      {musicList ? (
        <>
          <div className="sidebar">
            <div>
              <h1 className="title">
                <span className='dot'></span>Musics
              </h1>
              <div className="search-box">
                <i className="bx bx-search"></i>
                <input value={query.value} type="text" onChange={handleChange} placeholder='Search a Music.' />
              </div>
              <hr className='line' />
            </div>
            <ul className="list">
              {sidebarList.map(item => {
                return <li key={item.id} data-id={item.id} className={`music ${item.display ? "" : "hide"}`} onClick={handleClick}>
                  <p className="rank">#</p>
                  <div className="name-artist">
                    <p className="name">{item.name.split("/")[item.name.split("/").length - 1]}</p>
                  </div>
                </li>
              })}
            </ul>
          </div>
          <div className='player'>
            <div className="music-cover">
              <img src={Vinyl_disc} alt="" />
            </div>
            <div className="name-artist">
              <p className="name">{musicList[musicIndex].split("/")[musicList[musicIndex].split("/").length - 1].split(".")[0]}</p>
              <p className="artist">null</p>
            </div>
            <audio
              onTimeUpdate={timestampC}
              onLoadedData={handleLoaded}
              onEnded={NextMusic_}
              ref={mainAudio}
              src={musicList[musicIndex]}
            ></audio>
            <div className="progress-time">
              <h3 className="current-time">
                {currentTime}
              </h3>
              <div onClick={handleSeek} className="progress-box" ref={progressBox}>
                <div className="progress-bar" ref={progressBar}></div>
              </div>
              <h3 className="duration">{duration}</h3>
            </div>
            <div className="btns">
              {
                repeat ?
                  <button onClick={() => {
                    setRepeat(!repeat)
                    setShuffle(false)
                    }} className="ext-btn repeat repeat-active">
                    <i className="bx bx-repeat"></i>
                  </button> : <button onClick={() => {
                    setRepeat(!repeat)
                    setShuffle(false)
                    }} className="ext-btn repeat">
                    <i className="bx bx-repeat"></i>
                  </button>
              }

              <button onClick={PrevMusic} className="previous">
                <i className="bx bx-chevron-left"></i>
              </button>
              <button onClick={PlayMusic} className="play-pause">
                <i className="bx bx-play"></i>
              </button>
              <button onClick={NextMusic} className="next">
                <i className="bx bx-chevron-right"></i>
              </button>
              {
                shuffle ?
                  <button onClick={() => {
                    setShuffle(!shuffle)
                    setRepeat(false)
                    }} className='ext-btn shuffle-active'>
                    <i className="bx bx-shuffle"></i>
                  </button> : <button onClick={() => {
                    setShuffle(!shuffle)
                    setRepeat(false)
                    }} className='ext-btn'>
                    <i className="bx bx-shuffle"></i>
                  </button>
              }
            </div>

          </div>
        </>
      ) : "Loading"
      }
    </>
  )
}

export default App
