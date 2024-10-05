console.log("hello");
let currentSong = new Audio(); // Current playing song
let currentSongIndex = 0; // Track the index of the currently playing song
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Function to toggle play/pause for the current song
const playmusic = (audio) => {
    if (audio.paused) {
        audio.play();
        play.src = "pause.png"; // Switch to pause icon
    } else {
        audio.pause();
        play.src = "play.png"; // Switch to play icon
    }
};

// Fetch song list from the server and clean up song names
async function getSongs(folder = "songs/f1") { // Default folder is 'songs/f1'
    currfolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let songName = decodeURIComponent(
                element.href.substring(element.href.lastIndexOf("/") + 1)
            ).replace(/(\.mp3|[\(\)\-\_])/g, " ").trim();

            // Clean up the song name
            songName = songName
                .replace(/\bPagal( ?World)?\b/gi, "") // Remove variations of "Pagal World"
                .replace(/\.com|\.in|Copy\s*\d*/gi, "") // Remove ".com", ".in", "Copy" followed by a number
                .replace(/\.so|\.sb/gi, "") // Remove ".so", ".sb" patterns
                .replace(/\s+/g, " ") // Replace multiple spaces with a single space
                .trim(); // Trim any extra spaces

            // Use the correct path to the song
            songs.push({ url: element.href, name: songName });
        }
    }

    let songul = document.querySelector(".allplay ul");
    songul.innerHTML = ""; // Clear any existing content

    // Add each song to the playlist and set up event listeners
    songs.forEach((song, index) => {
        let li = document.createElement("li");
        li.classList.add("playlist");

        li.innerHTML = `
            <img src="music symbol.png" alt="liked songs" height="48px" style="border-radius: 4px;">
            <div class="playtitle">
                <p class="song-name">${song.name}</p>
                <p>Playlist . Username</p>
            </div>
        `;

        // Add click event to play the clicked song
        li.addEventListener("click", () => {
            currentSongIndex = index; // Track the current song index
            playSelectedSong(song.url); // Play the selected song
        });

        songul.appendChild(li); // Append the song to the playlist
    });

    return songs;
}


// Function to handle the song playing when clicking on a song card
function playSelectedSong(songUrl) {
    currentSong.src = songUrl; // Set the new song URL
    currentSong.play(); // Play the selected song
    play.src = "pause.png"; // Update the play button to show the pause icon
    alimg.src = "music symbol.png"; // Update the album image
    
    // Extract the song name from the URL
    let songName = decodeURI(songUrl.split('/').pop()) // Extract the last part of the URL
                    .replace(/(\.mp3|\.so|\.sb|PagalWorld|\.com|\.in|Copy\s*\d*)/gi, '') // Remove unwanted parts
                    .trim(); // Clean up extra spaces

    // Update the song name in the UI
    document.querySelector(".songname").innerHTML = songName;
    document.querySelector(".playlistname").innerHTML = "Playlist . Username";

    // Reset playtime info
    document.querySelector(".playtime").innerHTML = "00:00 / 00:00";
}



async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let album = document.querySelector(".album")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            album.innerHTML = album.innerHTML + ` <div data-folder="${folder}" class="card" style="position: relative;">
                    <img src="/songs/${folder}/cover.png" alt="album cover" height="160px" width="180px" style="border-radius: 4px;">
                    <img class="inner_play" src="inner_play.png" alt="play album button" height="32px" width="32px" >
                    <h4>${response.title}</h4>
                    <p class="desc">${response.description}</p>
                </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playmusic(songs[0])

        })
    })
}



// Main function to populate the playlist and add event listeners
async function main() {
    songs = await getSongs();
    console.log(songs);

    displayAlbums()


    // Handle global play/pause button
    play.addEventListener("click", () => {
        playmusic(currentSong); // Toggle play/pause for the current song
    });

    // time update
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".playtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //seekbar
    document.querySelector(".bigrec").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //previous button
    prev.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        
        // Extract the current song filename (last part of the URL)
    let currentSongFilename = currentSong.src.split("/").pop();

    // Find the index of the current song in the songs array
    let index = songs.findIndex(song => song.url.split("/").pop() === currentSongFilename);

    // If index becomes less than 0, set it to the last song in the array
    if ((index - 1) < 0) {
        index = 0; // Retain the last song
    } else {
        index = index - 1; // Move to the previous song
    }

    // Play the selected song (either previous or last song if index was less than 0)
    playSelectedSong(songs[index].url, 'My Playlist');

    })

    //next button
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("next clicked")
        
        // Extract the current song filename (last part of the URL)
    let currentSongFilename = currentSong.src.split("/").pop();

    // Find the index of the current song in the songs array
    let index = songs.findIndex(song => song.url.split("/").pop() === currentSongFilename);

    // If index becomes less than 0, set it to the last song in the array
    if ((index + 1) > songs.length-1) {
        index = songs.length-1; // Retain the last song
    } else {
        index = index + 1; // Move to the previous song
    }

    // Play the selected song (either previous or last song if index was less than 0)
    playSelectedSong(songs[index].url, 'My Playlist');

    })

    //volume
    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100;
    });
    
    
    
    


}

main();
