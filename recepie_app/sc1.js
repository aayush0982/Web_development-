document.addEventListener("DOMContentLoaded", () => {
    const ctgrid = document.querySelector(".contentgrid");
    fetchMeals(); // Fetch meals on page load

    // Fetch meals from the API
    async function fetchMeals() {
        const url = 'https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&tags=under_30_minutes';
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '5b761298d7msh845f73dfa76714fp10072fjsn821684f782b8', 
                'x-rapidapi-host': 'tasty.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data);

            // Loop over meal results
            for (let i = 0; i < data.results.length; i++) {
                const mealInfo = data.results[i];
                addMeal(mealInfo);
            }
        } catch (error) {
            console.error("Error fetching meals:", error);
        }
    }

    // Add meal to the grid
    function addMeal(mealInfo) {
        const mealDiv = document.createElement("div");
        mealDiv.classList.add("griddiv");

        let mealName = mealInfo.name;
        let mealImage = mealInfo.thumbnail_url;
        let mealId = mealInfo.id;

        let displayName = mealName.length > 12 ? mealName.substring(0, 12) + "..." : mealName;

        // Create the HTML for the meal card
        mealDiv.innerHTML = `
            <img src="${mealImage}" alt="${mealName}" height="120px" width="100%">
            <div class="gridtext">
                <p class="gridtextname" title="${mealName}">${displayName}</p>
                <img class="whishlist" src="bookmark2.svg" alt="like" height="24px" width="24px">
            </div>
        `;

        ctgrid.appendChild(mealDiv);

        const favButton = mealDiv.querySelector(".whishlist");

        // Handle favorite button clicks
        favButton.addEventListener("click", () => {
            if (favButton.classList.contains("active")) {
                removeMealLS(mealId);  // Remove meal from local storage
                favButton.classList.remove("active");
                favButton.src = "bookmark2.svg"; // Update to default bookmark image
            } else {
                addMealLS(mealId);  // Add meal to local storage
                favButton.classList.add("active");
                favButton.src = "bookmark3.svg"; // Update to active bookmark image
            }
        });
    }

    // Local Storage Functions
    function addMealLS(mealId) {
        const mealIds = getMealsLS();
        localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
    }

    function removeMealLS(mealId) {
        const mealIds = getMealsLS();
        localStorage.setItem("mealIds", JSON.stringify(mealIds.filter(id => id !== mealId)));
    }

    function getMealsLS() {
        const mealIds = JSON.parse(localStorage.getItem("mealIds"));
        return mealIds === null ? [] : mealIds;
    }
});
