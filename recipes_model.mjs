import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);


// Connect to to the database
const db = mongoose.connection;
// The open event is called when the database connection successfully opens
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

/**
 * Define the schema
 */
const recipeSchema = mongoose.Schema({
    name: { type: String, required: true },
    ingredients: { type: String, required: true },
    steps: { type: String, required: false },
    calories: { type: Number, required: false },  
    servings: { type: Number, required: false }, 
    type: { type: String, required: true }, 
    date: { type: String, required: false }
});

/**
 * Compile the model from the schema. This must be done after defining the schema.
 */
const Recipe = mongoose.model("Recipe", recipeSchema);

const createRecipe = async (name, ingredients, steps, calories, servings, type, date) => {

    // if(isDateValid(date) === false){
    //     console.log('date is not valid')
    //     return null
    // }

    if(calories <= 0 || isNaN(calories) == true) {
        console.log('calories is not valid')
        return null
    }

    if(servings <= 0 || isNaN(servings) == true) {
        console.log('servings is not valid')
        return null
    }

    if(type !== "Breakfast" && type !== "Lunch" && type !== "Dinner" && type !== "Snacks") {
        console.log('type is not valid')
        return null
    }

    console.log('validated: true')
    const recipe = new Recipe({ name: name, ingredients: ingredients, steps: steps, calories: calories, servings: servings, type: type, date: date });
    return recipe.save();
};

const findRecipes = async (filter, projection, limit) => {
    const query = Recipe.find(filter)
    .select(projection)
    .limit(limit);
    return query.exec();
};

const findRecipeById = async (_id) => {
    const query = Recipe.findById(_id);
    return query.exec();
};

const replaceRecipe = async (_id, name, ingredients, steps, calories, servings, type, date) => {

    // if(isDateValid(date) === false){
    //     console.log('date is not valid')
    //     return null
    // }

    if(calories <= 0 || isNaN(calories) == true) {
        console.log('calories is not valid')
        return null
    }

    if(servings <= 0 || isNaN(servings) == true) {
        console.log('servings is not valid')
        return null
    }

    if(type !== "Breakfast" && type !== "Lunch" && type !== "Dinner" && type !== "Snacks") {
        console.log('type is not valid')
        return null
    }
    const result = await Recipe.replaceOne({ _id: _id}, { name: name, ingredients: ingredients, steps: steps, calories: calories, servings: servings, type: type, date: date });
    return result.modifiedCount
};

const deleteById = async (_id) => {
    const result = await Recipe.deleteOne({ _id: _id });
    return result.deletedCount;
};

/**
*
* @param {string} date
* Return true if the date format is MM-DD-YY where MM, DD and YY are 2 digit integers
*/
// function isDateValid(date) {
//     const format = /^\d\d-\d\d-\d\d$/;
//     // console.log('valiDated: ', format.test(date) )
//     return format.test(date);
// }

export {createRecipe, findRecipeById, findRecipes, replaceRecipe, deleteById};