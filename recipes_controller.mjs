import 'dotenv/config';
import * as recipes from './recipes_model.mjs'; 
import express from 'express';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

/**
 * Create a new recipe
 */

 app.post('/recipes', (req, res) => {
    recipes.createRecipe(req.body.name, req.body.ingredients, req.body.steps, req.body.calories, req.body.servings, req.body.type, req.body.date)
               
        .then(recipe => {
            if(recipe !== null){
                        res.status(201).json(recipe)
                        } else {
                            // console.log('error caught')
                            res.status(400).json({ Error: 'Invalid request'})
                        }
        })
        .catch(error => {
            console.error(error)
            res.status(400).json({ Error: 'Invalid request'})
        })
});


/**
 * Retrive the recipe corresponding to the ID provided in the URL.
 */
 app.get('/recipes/:_id', (req, res) => {
    const recipeId = req.params._id;
    recipes.findRecipeById(recipeId)
        .then(recipe => { 
            if (recipe !== null) {
                res.json(recipe);  // res.status(200).json(recipe);
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }         
         })
        .catch(error => {
            res.status(400).json({ Error: 'Request failed' });
        });

});

/**
 * Retrieve recipes. 
 */
 app.get('/recipes', (req, res) => {
    let filter = {};
    if(req.query.name !== undefined){
        filter = { name: req.query.name };
    }
    recipes.findRecipes(filter, '', 0)
        .then(recipes => {
            // res.send(recipes);
            res.status(200).json(recipes);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        });

});

/**
 * Update the recipe whose id is provided in the path parameter and set
 * its parameters to the values provided in the body.
 */
 app.put('/recipes/:_id', (req, res) => {

    recipes.replaceRecipe(req.params._id, req.body.name, req.body.ingredients, req.body.steps, req.body.calories, req.body.servings, req.body.type, req.body.date)
        .then(numUpdated => {
            if (numUpdated === 1) {
                res.json({ _id: req.params._id, name: req.body.name,ingredients: req.body.ingredients, steps: req.body.steps, calories: req.body.calories, servings: req.body.servings, type: req.body.type, date: req.body.date });
            } 
            else if (numUpdated === 0) {
                
                res.status(404).json({ Error: 'Resource not found' });
            }
            else if (numUpdated === null) {
        
                res.status(400).json({ Error: 'Request failed' });
                
            }
        })

        .catch(error => {
            
            console.error(error);
            res.status(400).json({ Error: 'Request failed' });
        });
});

/**
 * Delete the recipe whose id is provided in the query parameters
 */
 app.delete('/recipes/:_id', (req, res) => {
    recipes.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});