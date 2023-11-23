const emptyIngredientNameInputEl = document.querySelector(".name-input");
const emptyMeasurementNameInputEl = document.querySelector(".measure-input");
const createRecipeButtonEl = document.querySelector("#create-button");
const addIngredientButton = document.querySelector(".add-ingr-button")

const createRecipe = async (event) => {
    event.preventDefault();
  
    const recipeName = document.querySelector("#add-recipe-name-input").value;
    const preparationInstructions = document.querySelector("#add-recipe-instructions-input").value;
    const categoryId = document.querySelector("#category-id").value;
  
    const response = await fetch("/api/recipes", {
        method: "POST",
        body: JSON.stringify({
            name: recipeName,
            instructions: preparationInstructions,
            ingredients: ingredients(),
            category_id: categoryId
        }),
        headers: {"Content-Type": "application/json"}
    });
  
    if (response.ok) {
        document.location.replace("/memberlist");
    } else {
        alert(response.statusText);
    }
};



const ingredientsSectionEl = document.querySelector(".ingredients-section")

const ingredients = () => {
    const result = [];
    [...document.querySelectorAll(".added-ingredient")].forEach((ingredient) => {
        const name = ingredient.querySelector(".add-ingredient-name-value").value;
        const measure = ingredient.querySelector(".add-ingredient-measurement-value").value;
        const unit = ingredient.querySelector(".add-measurement-unit-value").value;
        result.push({name, measure, unit});
    })
    return result
}

const unitOptionsEl = document.querySelector("#add-measurement-unit-input")

const addIngredient = () => {
    const newIngredients = document.createElement("div");
    newIngredients.setAttribute("class", "added-ingredient row mb-1")

    const ingredientDiv = document.createElement("div");
    ingredientDiv.setAttribute("class", "col-md-6")

    const measurementDiv = document.createElement("div");
    measurementDiv.setAttribute("class", "col-md-3")

    const unitDiv = document.createElement("div");
    unitDiv.setAttribute("class", "col-md-2")

    const ingredientNameInputEl = document.createElement("input");
    ingredientNameInputEl.setAttribute("type", "text");
    ingredientNameInputEl.setAttribute("class", "add-ingredient-name-value form-control");
    ingredientNameInputEl.setAttribute("name", "add-ingredient-name");
    ingredientNameInputEl.value = document.querySelector("#add-ingredient-name-input").value
    ingredientDiv.appendChild(ingredientNameInputEl)
    newIngredients.appendChild(ingredientDiv);

    const ingredientMeasurementInputEl = document.createElement("input");
    ingredientMeasurementInputEl.setAttribute("type", "text");
    ingredientMeasurementInputEl.setAttribute("class", "add-ingredient-measurement-value form-control");
    ingredientMeasurementInputEl.setAttribute("name", "add-ingredient-measurement");
    ingredientMeasurementInputEl.value = document.querySelector("#add-ingredient-measurement-input").value
    measurementDiv.appendChild(ingredientMeasurementInputEl)
    newIngredients.appendChild(measurementDiv);


    const measurementUnitInputEl = unitOptionsEl.cloneNode(true);
    measurementUnitInputEl.selectedIndex = unitOptionsEl.selectedIndex;
    measurementUnitInputEl.removeAttribute("id")
    measurementUnitInputEl.setAttribute("class", "add-measurement-unit-value form-control form-select");
    unitDiv.appendChild(measurementUnitInputEl)
    newIngredients.appendChild(unitDiv);

    ingredientsSectionEl.appendChild(newIngredients);

    document.querySelector("#add-ingredient-name-input").value = "";
    document.querySelector("#add-ingredient-measurement-input").value = "";
    document.querySelector("#add-measurement-unit-input").value = "";
    
    createRecipeButtonEl.disabled = false;
    addIngredientButton.disabled = true;
}

const disableButton = () => {
    if (emptyMeasurementNameInputEl.value === "" && emptyIngredientNameInputEl.value === "") {
        createRecipeButtonEl.disabled = false;
    } else {
        createRecipeButtonEl.disabled = true;
    }
}

const disableIngredientButton = () => {
    if (emptyMeasurementNameInputEl.value === "" || emptyIngredientNameInputEl.value === "") {
        addIngredientButton.disabled = true;
    } else {
        addIngredientButton.disabled = false;
    }
}

emptyIngredientNameInputEl.addEventListener("input", disableButton);
emptyMeasurementNameInputEl.addEventListener("input", disableButton);

emptyIngredientNameInputEl.addEventListener("input", disableIngredientButton);
emptyMeasurementNameInputEl.addEventListener("input", disableIngredientButton);

document
    .querySelector("#add-ingredient-button")
    .addEventListener("click", addIngredient);

document
    .querySelector("#create-button")
    .addEventListener("click", createRecipe);