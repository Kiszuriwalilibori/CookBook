// 'use client';

// import React from 'react';
// import { PortableText } from '@portabletext/react';
// // import { client } from '@/lib/sanity';
// import { client } from '../../sanity/lib/client'; 
// // Adjust the import path as necessary

// type Recipe = {
//   title: string;
//   ingredients: {
//     quantity: number;
//     unit: string;
//     name: string;
//   }[];
//   preparationSteps: any; // Assuming PortableText type
//   calories: number;
//   preparationTime: number;
//   cookingTime: number;
//   servings: number;
// };

// const TestRecipe = () => {
//   const [recipe, setRecipe] = React.useState<Recipe | null>(null);
// const [error, setError] = React.useState<string | null>(null); // State for error messages

//   React.useEffect(() => {
//     const fetchRecipe = async () => {
//       try {
//         const data = await client.fetch('*[_type == "recipe"][0]'); 
//         setRecipe(data);
//         setError(null); // Clear any previous errors
//       } catch (error) {
//         console.error('Error fetching recipe:', error);
//         setError('Failed to fetch recipe. Please try again later.'); // Set error message
//       }
//     };

//     fetchRecipe();
//   }, []);

//   if (error) {
//     return <div>{error}</div>; // Render error message if there is an error
// }

// if (!recipe) return <div>Loading...</div>;

//   return (
//     <div>
//       <h1>{recipe.title}</h1>
//       <h2>Ingredients</h2>
//       <ul>
//         {recipe.ingredients.map((ingredient, index) => (
//           <li key={index}>{`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}</li>
//         ))}
//       </ul>
//       <h2>Preparation Steps</h2>
//       <PortableText value={recipe.preparationSteps} />
//       <h2>Calories</h2>
//       <p>{recipe.calories}</p>
//       <h2>Preparation Time</h2>
//       <p>{recipe.preparationTime} minutes</p>
//       <h2>Cooking Time</h2>
//       <p>{recipe.cookingTime} minutes</p>
//       <h2>Servings</h2>
//       <p>{recipe.servings}</p>
//     </div>
//   );
// };

// export default TestRecipe;
export default{}
