import { PortableText } from '@portabletext/react';

const components = {
  block: {
    normal: ({ children }) => <p className="step">{children}</p>,
    strong: ({ children }) => <strong>{children}</strong>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    link: ({ value, children }) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        {children}
      </a>
    ),
  },
};

const Recipe = ({ recipe }) => {
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Description</h2>
        <p>{recipe.description}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Ingredients</h2>
        <ul className="list-disc pl-5">
          {recipe.ingredients?.map((ingredient, index) => (
            <li key={index}>
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <ul className="list-disc pl-5">
          {recipe.Products?.map((product, index) => (
            <li key={index}>{product}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Preparation Steps</h2>
        <PortableText value={recipe.preparationSteps} components={components} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <p><strong>Calories:</strong> {recipe.calories}</p>
        <p><strong>Preparation Time:</strong> {recipe.preparationTime} min</p>
        <p><strong>Cooking Time:</strong> {recipe.cookingTime} min</p>
        <p><strong>Servings:</strong> {recipe.servings}</p>
        <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
        <p><strong>Dietary Restrictions:</strong> {recipe.dietaryRestrictions?.join(', ')}</p>
        <p><strong>Tags:</strong> {recipe.tags?.join(', ')}</p>
        <p><strong>Notes:</strong> {recipe.notes}</p>
        <p><strong>Kizia:</strong> {recipe.Kizia ? 'Yes' : 'No'}</p>
        <p><strong>Source:</strong> {recipe.source?.title || recipe.source?.http || recipe.source?.book}</p>
      </div>
    </div>
  );
};

export default Recipe;