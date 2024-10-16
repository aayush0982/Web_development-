// ctgrid = document.querySelector(".contentgrid")
// const favoriteContainer = document.querySelector(".favorite-container");
let ctgrid;
let favoriteContainer;

document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname;

    if (currentPage.includes("index.html")) {
        // Logic for the primary page
        ctgrid = document.querySelector(".contentgrid");
        fetchmeal();

    } else if (currentPage.includes("Saved.html")) {
        // Logic for the saved recipes page
        favoriteContainer = document.querySelector(".savedlist");

        if (!favoriteContainer) {
            console.warn("Favorite container not found on this page.");
            return;
        }

        fetchFavMeals();
    }
});





async function fetchmeal() {
    const url = 'https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&tags=under_30_minutes';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '5b761298d7msh845f73dfa76714fp10072fjsn821684f782b8',
            'x-rapidapi-host': 'tasty.p.rapidapi.com'

        }
    };

    const response = await fetch(url, options);
    const respData = await response.json();
    console.log(respData);

    // Extract and process meal data (adjust based on API response structure)
    for (let i = 0; i < 14; i++) {
        const mealinfo = respData.results[i];
        addmeal(mealinfo);
    }
}


function addmeal(mealinfo) {
    const info = document.createElement("div");
    info.classList.add("griddiv");

    // Get meal name and image from mealinfo
    let mealName = mealinfo.name;
    let mealImage = mealinfo.thumbnail_url;
    let mealId = mealinfo.id; // id of meal

    // Truncate meal name if it is longer than 8 characters
    let displayName = mealName.length > 12 ? mealName.substring(0, 12) + "..." : mealName;

    // Update inner HTML of the newly created div
    info.innerHTML = `<img src="${mealImage}" alt="${mealName}" height="120px" width="100%">
                <div class="gridtext">
                    <p class="gridtextname" title="${mealName}">${displayName}</p>
                    <img class="whishlist" src="bookmark2.svg" alt="like" height="24px" width="24px">
                </div>`;

    // Append the div to the content grid
    ctgrid.appendChild(info);

    const btn = info.querySelector(".whishlist");

    btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) {
            removeMealLS(mealId);
            btn.classList.remove("active");
            btn.src = "bookmark2.svg";
        } else {
            addMealLS(mealId);
            btn.classList.add("active");
            btn.src = "bookmark3.svg";
        }

        fetchFavMeals();
    });


}

async function getMealById(id) {
    const url = 'https://tasty.p.rapidapi.com/recipes/detail?id=' + id;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '5b761298d7msh845f73dfa76714fp10072fjsn821684f782b8',
            'x-rapidapi-host': 'tasty.p.rapidapi.com'

        }
    };

    const resp = await fetch(url, options);
    const respData = await resp.json();
    const meal = respData;

    return meal;
}

// Fetch and display favorite meals from localStorage
async function fetchFavMeals() {
    if (!favoriteContainer) {
        console.warn("Favorite container not found on this page.");
        return;
    }
    // Clean the container
    favoriteContainer.innerHTML = "";

    const mealIds = getMealsLS();

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        const meal = await getMealById(mealId);

        addMealFav(meal);
    }
}

// Add meal to favorite container
function addMealFav(mealData) {
    const favMeal = document.createElement("div");
    favMeal.classList.add("savedcontent");

    favMeal.innerHTML = `
        <img src="${mealData.thumbnail_url}" alt="${mealData.name}" height="120px" width="100%">
        <div class="gridtext">
            <p class="gridtextname" title="${mealData.name}">${mealData.name}</p>
            <img class="whishlist" src="bookmark2.svg" alt="like" height="24px" width="24px">
        </div>
    `;

    favoriteContainer.appendChild(favMeal);
}

// LocalStorage functions to save, remove and get meals
function addMealLS(mealId) {
    const mealIds = getMealsLS();
    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
    const mealIds = getMealsLS();
    localStorage.setItem(
        "mealIds",
        JSON.stringify(mealIds.filter((id) => id !== mealId))
    );
}

function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));
    return mealIds === null ? [] : mealIds;
}