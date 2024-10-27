const form = document.querySelector(".form")
const search = document.querySelector(".search")
const card = document.querySelector(".card")
const main = document.querySelector(".main")

const APIURL = "https://api.github.com/users/";


async function getUser(username) {
    const resp = await fetch(APIURL + username);
    const respData = await resp.json();
    console.log(respData)
    createUserCard(respData);

    getRepos(username);
}

async function getRepos(username) {
    const resp = await fetch(APIURL + username + "/repos");
    const respData = await resp.json();

    addReposToCard(respData);
}

function createUserCard(user) {

    // const cardel = document.createElement("div");
    // cardel.classList.add("card");

    const cardel = `
    <div class="line"></div>
    <div class="card">
        <img class="gitdp" src="${user.avatar_url}" alt="${user.name}" height="180px" width="100">
            <div class="desc">
                <div class="u">
                <p class="username">${user.name}</p>
                <p class="bio">${user.bio}</p>
                </div>
               <ul class="icons">
                  <li><span><p class="ft">Followers : </p></span>${user.followers}</li>
                  <li><span><p class="ft">Following : </p></span>${user.following}</li>
                  <li><span><p class="ft">Repos : </p></span>${user.public_repos}</li>
              </ul>

              <div id="repos" class="repos"></div>

            </div>
    </div>
    `;


    main.innerHTML = cardel;

    // main.appendChild(cardel);
}

function addReposToCard(repos) {
    const reposEl = document.getElementById("repos");

    repos.forEach((repo) => {
        const repoEl = document.createElement("a");
        repoEl.classList.add("repo");

        repoEl.href = repo.html_url;
        repoEl.target = "_blank";
        repoEl.innerText = repo.name;

        reposEl.appendChild(repoEl);
    });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = search.value;

    if (user) {
        getUser(user);

        search.value = "";
    }
});