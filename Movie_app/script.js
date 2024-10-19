const APIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const searchInput = document.querySelector(".searchinput")
const main = document.querySelector(".main")
const card = document.querySelector(".moviecard")
const searchForm = document.querySelector(".search-form");
const searchButton = document.querySelector(".ssvg");

getMovies(APIURL);

async function getMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();

    console.log(respData);

    showMovies(respData.results);
}

function showMovies(movies) {

    main.innerHTML = "";

    movies.forEach(movie => {
        const { poster_path, title, vote_average, overview } = movie;

        let stitle = truncateTitle(title);
        let svote = truncatevote(vote_average);
        const cardel = document.createElement("div")
        cardel.classList.add("moviecard")

        cardel.innerHTML = `
            <img class="poster" src="${IMGPATH + poster_path}" alt="${title}" height="200px" width="150px">
            <img class="about" src="about.svg" alt="about" height="16px" width="16px">
            <div class="desc">
                <p class="title">${stitle}</p>
                <div class="rating">
                    <p class="number">${svote}</p>
                </div>
                
            </div>
        `

        const aboutButton = cardel.querySelector(".about");
        aboutButton.addEventListener("click", () => {
            // Replace button with cross SVG
            const crossSVG = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0,0,256,256">
            <g fill="#fcfcfc" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M25,2c-12.681,0 -23,10.319 -23,23c0,12.681 10.319,23 23,23c12.681,0 23,-10.319 23,-23c0,-12.681 -10.319,-23 -23,-23zM33.71,32.29c0.39,0.39 0.39,1.03 0,1.42c-0.2,0.19 -0.45,0.29 -0.71,0.29c-0.26,0 -0.51,-0.1 -0.71,-0.29l-7.29,-7.29l-7.29,7.29c-0.2,0.19 -0.45,0.29 -0.71,0.29c-0.26,0 -0.51,-0.1 -0.71,-0.29c-0.39,-0.39 -0.39,-1.03 0,-1.42l7.29,-7.29l-7.29,-7.29c-0.39,-0.39 -0.39,-1.03 0,-1.42c0.39,-0.39 1.03,-0.39 1.42,0l7.29,7.29l7.29,-7.29c0.39,-0.39 1.03,-0.39 1.42,0c0.39,0.39 0.39,1.03 0,1.42l-7.29,7.29z"></path></g></g>
            </svg>`;

            cardel.innerHTML = `
                <div class="overview">
                    ${overview}
                    <button class="close-btn">${crossSVG}</button>
                </div>
            `;

            // Close button event listener
            const closeButton = cardel.querySelector(".close-btn");
            closeButton.addEventListener("click", () => {
                cardel.innerHTML = `
                    <img class="poster" src="${IMGPATH + poster_path}" alt="${title}" height="200px" width="150px">
                    <img class="about" src="about.svg" alt="about" height="16px" width="16px">
                    <div class="desc">
                        <p class="title">${stitle}</p>
                        <div class="rating">
                            <p class="number">${svote}</p>
                        </div>
                    </div>
                `;
            });
        });


        const aboutButtons = document.querySelectorAll('.about');

        aboutButtons.forEach((aboutBtn) => {
            aboutBtn.addEventListener('click', function () {
                const movieCard = this.closest('.moviecard');
                const desc = movieCard.querySelector('.desc');

                // Check if the card is already showing the overview or not
                if (!this.classList.contains('active')) {
                    cardel.innerHTML = `
                <div class="overview">
                ${overview}
                <button class="close-btn">${crossSVG}</button>
                </div>
                `;
                    this.classList.add('active');
                } else {
                    desc.innerHTML = `
                <p class="title">${movieCard.dataset.title}</p>
                <div class="rating">
                    <p class="number">${movieCard.dataset.vote}</p>
                </div>`;
                    this.innerHTML = 'About';  // Change back to original content
                    this.classList.remove('active');
                }
            });
        });

        main.appendChild(cardel)

        changeVoteBg(vote_average, cardel.querySelector('.number'));
    });

}

function truncateTitle(title) {
    if (title.length > 12) {
        return title.substring(0, 12) + "...";
    } else {
        return title;
    }
}

function truncatevote(vote_average) {
    return vote_average.toFixed(1);
}

function changeVoteBg(vote, voteDiv) {

    if (vote >= 8) {
        voteDiv.style.backgroundColor = "green";
    } else if (vote >= 5) {
        voteDiv.style.backgroundColor = "orange";
    } else {
        voteDiv.style.backgroundColor = "red";
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value;
    if (searchTerm) {
        getMovies(SEARCHAPI + searchTerm);
        searchInput.value = "";
    }
});

searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value;
    if (searchTerm) {
        getMovies(SEARCHAPI + searchTerm);
        searchInput.value = "";
    }
});
