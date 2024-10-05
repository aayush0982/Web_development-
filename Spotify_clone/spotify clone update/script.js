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
    const playButton = document.getElementById('play'); // Reference play button correctly
    if (audio.paused) {
        audio.play();
        playButton.src = "pause.png"; // Switch to pause icon
    } else {
        audio.pause();
        playButton.src = "play.png"; // Switch to play icon
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

    return songs;
}

// Play a song and automatically move to the next one when the current song ends
function playSelectedSong(songUrl) {
    currentSong.src = songUrl; // Set the new song URL
    currentSong.play(); // Play the selected song
    const playButton = document.getElementById('play'); // Reference play button correctly
    playButton.src = "pause.png"; // Update the play button to show the pause icon
    const alimg = document.getElementById("alimg"); // Get the album image element
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

// Play all songs sequentially when an album is clicked
function playAllSongsInFolder(songsArray) {
    songs = songsArray; // Store the songs globally
    currentSongIndex = 0; // Start with the first song
    playSelectedSong(songs[currentSongIndex].url); // Play the first song

    currentSong.addEventListener('ended', playNextSong); // Play next song when current one ends
}

function playNextSong() {
    currentSongIndex++;
    if (currentSongIndex < songs.length) {
        playSelectedSong(songs[currentSongIndex].url);
    } else {
        currentSongIndex = 0; // Loop back to the first song
        playSelectedSong(songs[currentSongIndex].url);
    }
}

function playPreviousSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1; // Loop back to the last song
    }
    playSelectedSong(songs[currentSongIndex].url);
}

async function displayAlbums() {
    console.log("displaying albums");
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let album = document.querySelector(".album");

    let songul = document.querySelector(".allplay ul");
    songul.innerHTML = ""; // Clear any existing content

    let array = Array.from(anchors);

    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0];

            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json(); 

            // Add album to the album display
            album.innerHTML += ` 
                <div data-folder="${folder}" class="card" style="position: relative;">
                    <img src="/songs/${folder}/cover.png" alt="album cover" height="160px" width="180px" style="border-radius: 4px;">
                    <img class="inner_play" src="inner_play.png" alt="play album button" height="32px" width="32px">
                    <h4>${response.title}</h4>
                    <p class="desc">${response.description}</p>
                </div>`;

            // Create the li element for each folder
            let li = document.createElement("li");
            li.classList.add("playlist");

            li.innerHTML = `
                <img src="/songs/${folder}/cover.png" alt="liked songs" height="48px" style="border-radius: 4px;">
                <div class="playtitle">
                    <p class="song-name">${response.title}</p>
                    <p>${response.description}</p>
                </div>
            `;
            songul.appendChild(li);

            // Add click event to li element for playing songs from the folder
            li.addEventListener("click", async () => {
                songs = await getSongs(`songs/${folder}`);
                playAllSongsInFolder(songs);
            });
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            // Check if the dataset.folder exists before trying to access it
            const folder = item.currentTarget.dataset.folder;
            if (folder) {
                console.log("Fetching Songs for folder: ", folder);
                songs = await getSongs(`songs/${folder}`);  
                
                // Update playlist (li elements) in the UI
                let songul = document.querySelector(".allplay ul");
                songul.innerHTML = ""; // Clear existing content before adding new songs
    
                songs.forEach((song) => {
                    let li = document.createElement("li");
                    li.classList.add("playlist");
                    
                    li.innerHTML = `
                        <img src="/songs/${folder}/cover.png" alt="song cover" height="48px" style="border-radius: 4px;">
                        <div class="playtitle">
                            <p class="song-name">${song.name}</p>
                            <p>${secondsToMinutesSeconds(currentSong.duration)}</p>
                        </div>
                    `;
    
                    // Add click event to each song in the playlist
                    li.addEventListener("click", () => {
                        playSelectedSong(song.url);
                    });
    
                    songul.appendChild(li);
                });
    
                playAllSongsInFolder(songs); // Play all songs automatically
            } else {
                console.error("No folder dataset found for album card.");
            }
        });
    });
    
}

// Main function to populate the playlist and add event listeners
async function main() {
    songs = await getSongs();
    console.log(songs);

    displayAlbums();

    // Handle global play/pause button
    const playButton = document.getElementById('play'); // Reference play button correctly
    playButton.addEventListener("click", () => {
        playmusic(currentSong); // Toggle play/pause for the current song
    });

    // Previous button
    const prevButton = document.getElementById('prev'); // Reference the previous button
    prevButton.addEventListener("click", playPreviousSong); // Bind to previous function

    // Next button
    const nextButton = document.getElementById('next'); // Reference the next button
    nextButton.addEventListener("click", playNextSong); // Bind to next function

    // time update
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".playtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // seekbar
    document.querySelector(".bigrec").addEventListener("click", (e) => {
        const seekTime = (e.offsetX / e.target.offsetWidth) * currentSong.duration;
        currentSong.currentTime = seekTime;
    });

    // Volume control
    document.querySelector(".volume").addEventListener("input", (e) => {
        document.querySelector(".bs").innerHTML = e.target.value;
        currentSong.volume = parseInt(e.target.value) / 100;
    });
}

main();
