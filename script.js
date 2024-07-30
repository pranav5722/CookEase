
document.getElementById('searchButton').addEventListener('click', function () {
    const query = document.getElementById('search').value;
    fetchRecipes(query);
});
document.querySelectorAll('#sidebar ul li a').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        const category = this.innerText; // Get the text of the clicked category
        fetchRecipes(category.toLowerCase()); // Convert category to lowercase to match query
    });
});

async function fetchRecipes(query) {
    const apiKey = '38fecbc5a63a4322ad3f6be94f691a16';
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${apiKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Log the data for debugging
        displayRecipes(data.results);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes');
    recipesContainer.innerHTML = '';

    if (recipes.length === 0) {
        recipesContainer.innerHTML = '<div class="placeholder">No recipes found. Try different ingredients.</div>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe');
        recipeElement.dataset.id = recipe.id;

        recipeElement.innerHTML = `
            <img src="${recipe.image || 'https://via.placeholder.com/300'}" alt="${recipe.title}">
            <h2>${recipe.title}</h2>
            <p>${recipe.sourceName || 'Unknown Source'}</p>
        `;

        recipeElement.addEventListener('click', function () {
            fetchRecipeDetails(recipe.id);
        });

        recipesContainer.appendChild(recipeElement);
    });
}
async function fetchRecipeDetails(id) {
    const apiKey = '38fecbc5a63a4322ad3f6be94f691a16';
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const recipe = await response.json();
        console.log(recipe); // Log the recipe details for debugging
        displayRecipeDetails(recipe);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
}

function displayRecipeDetails(recipe) {
    document.getElementById('modalTitle').innerText = recipe.title;
    document.getElementById('modalImage').src = recipe.image || 'https://via.placeholder.com/300';
    document.getElementById('modalSummary').innerHTML = recipe.summary;

    const ingredientsList = document.getElementById('modalIngredients');
    ingredientsList.innerHTML = '';
    recipe.extendedIngredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.innerText = `${ingredient.original}`;
        ingredientsList.appendChild(li);
    });

    document.getElementById('recipeModal').style.display = 'block';
}

document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('recipeModal').style.display = 'none';
});

window.onclick = function (event) {
    if (event.target === document.getElementById('recipeModal')) {
        document.getElementById('recipeModal').style.display = 'none';
    }
}