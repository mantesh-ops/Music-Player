let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");

closeBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  menuBtnChange();//calling the function
});

searchBtn.addEventListener("click", () => { // Sidebar open when you click on the search iocn
  sidebar.classList.toggle("open");
  menuBtnChange(); //calling the function
});

// following are the code to change sidebar button
function menuBtnChange() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");//replacing the iocns class
  }
}

// Select the necessary HTML elements
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const songList = document.querySelector("#song-list");
const audioPlayer = document.querySelector("#audio-player");
const errorMessage = document.querySelector("#error-message");
const main = document.querySelector("main");

// Set up the necessary variables for authenticating with the Spotify API
const CLIENT_ID = "YOUR_CLIENT_ID";
const CLIENT_SECRET = "YOUR_CLIENT_SECRET";
const AUTH_URL = "https://accounts.spotify.com/api/token";
const API_URL = "https://api.spotify.com/v1/search?type=track&q=";
// const API_URL = "https://api.spotify.com/v1/search?type=track&q=limit=5&market=US";

let accessToken = "";

// Function to get the access token from the Spotify API
const getAccessToken = async () => {
  try {
    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
      },
      body: "grant_type=client_credentials",
    });
    if (response.ok) {
      const data = await response.json();
      accessToken = data.access_token;
      console.log("accessToken ====> ", accessToken);
    } else {
      throw new Error("Error getting access token");
    }
  } catch (error) {
    console.error(error);
    errorMessage.innerText = "Error getting access token";
  }
};

let currentTrack = null;

const searchForTracks = async (query) => {

  try {
    const response = await fetch(API_URL + query, {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken },
    });
    if (response.ok) {
      const data = await response.json();
      const tracks = data.tracks.items;
      console.log(tracks);
      const filteredTracks = tracks.filter((track) =>
        track.name.toLowerCase().includes(query.toLowerCase())
      );
      songList.innerHTML = "";
      filteredTracks.forEach((track) => {

        const img = document.createElement("img");
        img.classList.add('track_img');
        img.src = track.album.images[0].url;
        img.alt = "Album Cover";
        img.justifyContent = 'right';
        img.width = 50;
        img.height = 50;

        // Function to play audio

        const li = document.createElement("li");
        li.innerText = track.name + ' ' + '-' + ' ' + track.artists[0].name;

        const playOrPauseAudio = (src, li) => {
          if (src) {
            if (audioPlayer.src === src) {
              if (audioPlayer.paused) {
                // If the same track was paused, resume playback
                audioPlayer.play();
                li.classList.add('playing');
              } else {
                // If the same track was playing, pause playback
                audioPlayer.pause();
                li.classList.remove('playing');
              }
            } else {
              // If a new track was selected, stop current playback and start new playback
              audioPlayer.src = src;
              audioPlayer.play();
              li.classList.add('playing');
              if (currentTrack) {
                currentTrack.classList.remove('playing');
                currentTrack = null;
              }
              currentTrack = li;
            }
          } else {
            errorMessage.innerText = "No preview available";
          }
        };

        li.addEventListener("click", () => {
          playOrPauseAudio(track.preview_url);
        });

        let search_len = document.querySelector("#search-input").value;
        if (search_len.length > 0) {
          main.style.display = 'block';
        }
        else {
          main.style.display = 'none';
        }
        /////
        // if (searchInput.length < 0) {
        //   main.style.display = 'none';
        // }
        // else {
        //   main.style.display = 'block';
        // }
        ////
        li.style.display = "flex";
        songList.appendChild(li);
        li.appendChild(img);
        songList.appendChild(li);
        ////

        ////
        main.style.backgroundColor = 'rgba(255, 255, 255, .2)';
        main.style.color = 'white';
        searchInput.style.backgroundColor = '#5b639c';
      });
      if (filteredTracks.length === 0) {
        errorMessage.innerText = "";
      }
    } else {
      throw new Error("Error searching for tracks");
    }
  } catch (error) {
    console.error(error);
    errorMessage.innerText = "Error searching for tracks";
  }
};


// Function to play audio


// const playAudio = (src) => {
//   if (src) {
//     audioPlayer.src = src;
//     audioPlayer.play();
//     errorMessage.innerText = "";
//   } else {
//     errorMessage.innerText = "No preview available";
//   }
// };

// Call the getAccessToken function to start the app
getAccessToken();

searchInput.addEventListener("input", () => {
  const query = searchInput.value;
  if (query.trim() !== "") {
    searchForTracks(query);
  }
});

searchInput.addEventListener("click", () => {
  searchInput.placeholder = 'Search for a song';
});