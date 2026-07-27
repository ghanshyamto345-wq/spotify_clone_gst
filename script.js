console.log("Let's write JavaScript");
let currentSong = new Audio();
let songs = [];
let currentIndex = 0;
let currFolder;
// ===========================
// GET SONGS
// ===========================
async function getSongs(folder) {
    try {
        currFolder = folder;
        let response = await fetch(`/${folder}/`);
        let text = await response.text();
        let div = document.createElement("div");
        div.innerHTML = text;
        let links = div.getElementsByTagName("a");
        let songList = [];
        for (let link of links) {
            if (link.href.endsWith(".mp3")) {
                let song = link.href.split(`/${folder}/`)[1];
                songList.push(decodeURIComponent(song));
            }
        }
        return songList;
    } catch (error) {
        console.log(error);
        return [];
    }
}



// ===========================
// PLAY SONG
// ===========================
function playMusic(track) {
currentSong.src =
`${currFolder}/${encodeURIComponent(songs[0])}`;
    currentIndex =
        songs.indexOf(track);
    document.querySelector(".songinfo").innerHTML =
        decodeURIComponent(track);
    document.querySelector(".songtime").innerHTML =
        "00:00 / 00:00";
    currentSong.play()
        .then(() => {
            document.getElementById("play").src =
                "img/pause.svg";
        })
        .catch(error => {
            console.log(error);
            document.getElementById("play").src =
                "img/play.svg";
        });
}
// ===========================
// FORMAT TIME
// ===========================
function formatTime(seconds) {
    if (isNaN(seconds))
        return "00:00";
    let min =
        Math.floor(seconds / 60);
    let sec =
        Math.floor(seconds % 60);
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}// ===========================
// MAIN
// ===========================
async function displayAlbums() {

    let response = await fetch("songs/albums.json");
    let albums = await response.json();

    let cardContainer = document.querySelector(".card-container");
    cardContainer.innerHTML = "";

    for (let album of albums) {

        cardContainer.innerHTML += `
        <div class="card" data-folder="${album.folder}">

            <div class="play-button">
                <svg width="48" height="48">
                    <circle cx="24" cy="24" r="24" fill="#1DB954"/>
                    <path d="M19 14v20l16-10z" fill="black"/>
                </svg>
            </div>

            <img src="songs/${album.folder}/cover.jpg">

            <h2>${album.title}</h2>

            <p>${album.description}</p>

        </div>`;
    }

    document.querySelectorAll(".card").forEach(card => {

        card.addEventListener("click", async () => {

            let folder = card.dataset.folder;

            songs = await getSongs(`songs/${folder}`);

            if (songs.length == 0) {
                console.log("No songs found");
                return;
            }

            let songul = document.querySelector(".songlist ul");
            songul.innerHTML = "";

            songs.forEach((song, index) => {

                songul.innerHTML += `
                <li>
                    <img class="music" src="img/music.svg">

                    <div class="info">
                        <div>${song}</div>
                        <div>Unknown Artist</div>
                    </div>

                    <img class="play" src="img/Start.svg">
                </li>`;
            });

            document.querySelectorAll(".songlist li").forEach((li, index) => {
                li.onclick = () => playMusic(songs[index]);
            });

            playMusic(songs[0]);

        });

    });

}



    // CARD CLICK EVENT

    document.querySelectorAll(".card")
    .forEach(card=>{


        card.addEventListener("click",async()=>{


            let folder =
            card.dataset.folder;


            console.log("Album:",folder);



            songs =
            await getSongs(`songs/${folder}`);



            console.log("Songs:",songs);



            if(songs.length===0)
            {
                console.log("No songs found");
                return;
            }



            let songul =
            document.querySelector(".songlist ul");


            songul.innerHTML="";



            songs.forEach((song,index)=>{


                songul.innerHTML += `

                <li>

                <img class="music" src="img/music.svg">

                <div class="info">

                <div>${song}</div>

                <div>Unknown Artist</div>

                </div>

                <img class="play" src="img/Start.svg">

                </li>

                `;


            });



            document.querySelectorAll(".songlist li")
            .forEach((li,index)=>{


                li.onclick=()=>{

                    playMusic(songs[index]);

                }


            });



            playMusic(songs[0]);


        });


    });



async function getSongs(folder) {

    currFolder = folder;

    try {

        let response = await fetch(`${folder}/songs.json`);

        songs = await response.json();

        return songs;

    }

    catch (err) {

        console.log(err);

        return [];

    }


    // SONG CLICK EVENT
    document.querySelectorAll(".songlist li")
        .forEach((li, index) => {
            li.addEventListener("click", () => {
                playMusic(songs[index]);
            });
        });
    // ===========================
    // PLAY PAUSE BUTTON
    // ===========================
    let play =
        document.getElementById("play");
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src =
                "img/pause.svg";
        }
        else {
            currentSong.pause();
            play.src =
                "img/play.svg";
        }
    });
    // ===========================
    // SONG TIMER
    // ===========================
    currentSong.addEventListener("timeupdate", () => {
        if (!isNaN(currentSong.duration)) {
            document.querySelector(".songtime")
                .innerHTML =
                `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
            document.querySelector(".circle")
                .style.left =
                (currentSong.currentTime /
                    currentSong.duration) * 100 + "%";
        }
    });
    // ===========================
    // SEEK BAR
    // ===========================
    document.querySelector(".seekbar")
        .addEventListener("click", (e) => {
            let bar =
                e.currentTarget.getBoundingClientRect();
            let percent =
                (e.clientX - bar.left) / bar.width;
            currentSong.currentTime =
                percent * currentSong.duration;
        });
    // NEXT BUTTON
    // ===========================
    document.getElementById("next")
        .addEventListener("click", () => {
            currentIndex++;
            if (currentIndex >= songs.length)
                currentIndex = 0;
            playMusic(songs[currentIndex]);
        });
    // PREVIOUS BUTTON
    document.getElementById("previous")
        .addEventListener("click", () => {
            currentIndex--;
            if (currentIndex < 0)
                currentIndex = songs.length - 1;
            playMusic(songs[currentIndex]);
        });
    // LOOP BUTTON
    let loop =
        document.getElementById("loop");
    let isLoop = false;
    loop.addEventListener("click", () => {
        isLoop = !isLoop;

        currentSong.loop = isLoop;
        loop.style.opacity =
            isLoop ? "1" : "0.5";
    });
    // AUTO NEXT SONG
    currentSong.addEventListener("ended", () => {
        if (currentSong.loop)
            return;
        currentIndex++;
        if (currentIndex >= songs.length)
            currentIndex = 0;
        playMusic(songs[currentIndex]);
    });
    // ===========================
    // HAMBURGER MENU
    // ===========================
    document.querySelector(".hamburger")
        .addEventListener("click", () => {
            document.querySelector(".left")
                .classList.add("active");
        });
    document.querySelector(".close")
        .addEventListener("click", () => {
            document.querySelector(".left")
                .classList.remove("active");
        });
    // ===========================
    // VOLUME CONTROL
    // ===========================
    let volumeSlider =
        document.getElementById("volumeSlider");
    let volumeIcon =
        document.getElementById("volumeIcon");
    currentSong.volume = 1;
    volumeSlider.addEventListener("input", () => {
        currentSong.volume =
            volumeSlider.value / 100;
    });
    volumeIcon.addEventListener("click", () => {
        if (currentSong.volume > 0) {
            currentSong.volume = 0;
            volumeSlider.value = 0;
            volumeIcon.src =
                "img/mute.svg";
        }
        else {
            currentSong.volume = 1;
            volumeSlider.value = 100;
            volumeIcon.src =
                "img/volume.svg";
        }
    });
}

main();