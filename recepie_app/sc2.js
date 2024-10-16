document.addEventListener("DOMContentLoaded", () => {
    const favoriteContainer = document.querySelector(".savedlist");
    fetchFavMeals(); // Fetch favorite meals on page load

    // Fetch saved meals from LocalStorage
    async function fetchFavMeals() {
        favoriteContainer.innerHTML = ""; 

        const mealIds = getMealsLS(); // Get IDs from LocalStorage

        for (let i = 0; i < mealIds.length; i++) {
            const mealId = mealIds[i];
            const meal = await getMealById(mealId); 
            if (meal) {
                addMealToFav(meal); 
            }
        }
    }

    // Fetch meal details by ID
    async function getMealById(id) {
        const url = `https://tasty.p.rapidapi.com/recipes/detail?id=${id}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '5b761298d7msh845f73dfa76714fp10072fjsn821684f782b8',
                'x-rapidapi-host': 'tasty.p.rapidapi.com'
            }
        };
    
        try {
            const resp = await fetch(url, options);
            const textResponse = await resp.text(); // Fetch raw text response
            console.log("Raw Response:", textResponse); // Log the raw response
    
            const respData = JSON.parse(textResponse); // Parse response after logging
            return respData;
        } catch (error) {
            console.error('Error fetching meal by ID:', error);
        }
    }
    

    // Add meal to the favorite container
    function addMealToFav(mealData) {
        const favMeal = document.createElement("div");
        favMeal.classList.add("savedcontent");

        favMeal.innerHTML = `
            <img src="${mealData.thumbnail_url}" alt="${mealData.name}" height="120px" width="100%">
            <div class="gridtext">
                <p class="gridtextname" title="${mealData.name}">${mealData.name}</p>
                <img class="whishlist active" src="bookmark2.svg" alt="like" height="24px" width="24px">
            </div>
        `;

        favoriteContainer.appendChild(favMeal);
    }

    // Local Storage Function
    function getMealsLS() {
        const mealIds = JSON.parse(localStorage.getItem("mealIds"));
        return mealIds === null ? [] : mealIds;
    }
});
