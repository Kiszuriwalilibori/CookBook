// // app/recipes/[slug]/page.tsx (fixed params await and removed onError)
// import { notFound } from "next/navigation";
// import { PortableText } from "@portabletext/react"; // For rich text rendering
// import { getRecipeBySlug } from "@/lib/sanity";
// import { Recipe } from "@/lib/types";
// import Image from "next/image"; // For optimized images

// // Custom PortableText components (updated for type compatibility)
// const PortableTextComponents = {
//     block: ({ children }: { children?: React.ReactNode }) => <p className="mb-4">{children}</p>,
//     list: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
//     listItem: ({ children }: { children?: React.ReactNode }) => <li className="mb-1">{children}</li>,
//     marks: {
//         strong: ({ children }: { children?: React.ReactNode }) => <strong>{children}</strong>,
//         em: ({ children }: { children?: React.ReactNode }) => <em>{children}</em>,
//         link: ({ children, value }: { children?: React.ReactNode; value?: { href: string } }) => (
//             <a href={value?.href || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
//                 {children}
//             </a>
//         ),
//     },
// };

// interface Params {
//     slug: string;
// }

// export default async function RecipePage({ params }: { params: Promise<Params> }) {
//     // Awaitable params
//     const { slug } = await params; // Await to access slug
//     const recipe: Recipe | null = await getRecipeBySlug(slug);

//     if (!recipe) {
//         notFound(); // 404 if no recipe
//     }

//     return (
//         <article className="max-w-4xl mx-auto p-6">
//             {/* Hero Image & Title */}
//             {recipe.description?.image?.asset?.url && (
//                 <div className="relative h-96 mb-6 rounded-lg overflow-hidden">
//                     <Image
//                         src={recipe.description.image.asset.url!}
//                         alt={recipe.description.image.alt || recipe.title}
//                         fill
//                         className="object-cover"
//                         priority // Optional: Prioritize for hero image
//                         sizes="(max-width: 768px) 100vw, 50vw" // Responsive sizes for optimization
//                     />
//                 </div>
//             )}
//             <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>

//             {/* Description */}
//             {recipe.description && (
//                 <section className="mb-8">
//                     {recipe.description.title && <h2 className="text-xl italic mb-2">{recipe.description.title}</h2>}
//                     {recipe.description.notes && <p className="text-gray-600 mb-4 italic">{recipe.description.notes}</p>}
//                     {recipe.description.content && <PortableText value={recipe.description.content} components={PortableTextComponents} />}
//                 </section>
//             )}

//             {/* Metadata: Time, Servings, Difficulty */}
//             <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
//                 <span>⏱️ {recipe.preparationTime} min prep</span>
//                 <span>🍽️ {recipe.servings} servings</span>
//                 <span>⭐ {recipe.difficulty}</span>
//                 {recipe.cuisine && <span>🌍 {recipe.cuisine}</span>}
//             </div>

//             {/* Ingredients */}
//             {recipe.ingredients && recipe.ingredients.length > 0 && (
//                 <section className="mb-8">
//                     <h2 className="text-2xl font-bold mb-4">Składniki</h2>
//                     <ul className="list-disc ml-6 space-y-1">
//                         {recipe.ingredients.map((ing, i) => (
//                             <li key={i}>
//                                 {ing.quantity} {ing.name}
//                             </li>
//                         ))}
//                     </ul>
//                 </section>
//             )}

//             {/* Preparation Steps */}
//             {recipe.preparationSteps && recipe.preparationSteps.length > 0 && (
//                 <section className="mb-8">
//                     <h2 className="text-2xl font-bold mb-4">Przygotowanie</h2>
//                     {recipe.preparationSteps.map((step, i) => (
//                         <div key={step._key || i} className="mb-6">
//                             <h3 className="text-lg font-semibold mb-2">Krok {i + 1}</h3>
//                             {step.image?.asset?.url && (
//                                 <div className="relative h-48 mb-2 rounded overflow-hidden">
//                                     <Image src={step.image.asset.url!} alt={step.image.alt || `Step ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
//                                 </div>
//                             )}
//                             {step.content && <PortableText value={step.content} components={PortableTextComponents} />}
//                             {step.notes && <p className="text-gray-600 italic mt-2">{step.notes}</p>}
//                         </div>
//                     ))}
//                 </section>
//             )}

//             {/* Additional Info */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                 {recipe.calories && <div>Calories: {recipe.calories}</div>}
//                 {recipe.cookingTime && <div>Cooking Time: {recipe.cookingTime} min</div>}
//                 {recipe.dietaryRestrictions && recipe.dietaryRestrictions.length > 0 && <div>Dietary: {recipe.dietaryRestrictions.join(", ")}</div>}
//                 {recipe.tags && recipe.tags.length > 0 && <div>Tags: {recipe.tags.join(", ")}</div>}
//             </div>

//             {/* Source */}
//             {recipe.source && <footer className="mt-8 pt-4 border-t text-sm text-gray-500">Source: {recipe.source.title || (recipe.source.isInternet ? recipe.source.http : recipe.source.book)}</footer>}
//         </article>
//     );
// }
// app/recipes/[slug]/page.tsx (fixed PortableText components with proper typing)
// app/recipes/[slug]/page.tsx
// app/recipes/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react'; // For rich text rendering
import type { PortableTextComponents } from '@portabletext/react'; // Import for typing
import { getRecipeBySlug } from '@/lib/sanity';
import { Recipe } from '@/lib/types';
import Image from 'next/image'; // For optimized images
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
} from '@mui/material';

// Custom PortableText components (typed correctly for compatibility)
const PortableTextComponents: Partial<PortableTextComponents> = {
  block: ({ children }) => (
    <Typography variant="body1" sx={{ mb: 2 }}>
      {children}
    </Typography>
  ),
  list: ({ children }) => (
    <List sx={{ ml: 3, mb: 2, listStyleType: 'disc' }}>
      {children}
    </List>
  ),
  listItem: ({ children }) => (
    <ListItem sx={{ px: 0, py: 0.5 }}>
      <ListItemText primary={children} />
    </ListItem>
  ),
  marks: {
    strong: ({ children }) => (
      <Typography component="strong" sx={{ fontWeight: 'bold' }}>
        {children}
      </Typography>
    ),
    em: ({ children }) => (
      <Typography component="em" sx={{ fontStyle: 'italic' }}>
        {children}
      </Typography>
    ),
    link: ({ children, value }) => (
      <Typography
        component="a"
        href={value?.href || '#'}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ color: 'primary.main', textDecoration: 'underline', '&:hover': { textDecoration: 'none' } }}
      >
        {children}
      </Typography>
    ),
  },
};

interface Params {
  slug: string;
}

export default async function RecipePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const recipe: Recipe | null = await getRecipeBySlug(slug);

  if (!recipe) {
    notFound(); // 404 if no recipe
  }

  return (
    <Box sx={{ maxWidth: 1024, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
      {/* Hero Image & Title */}
      {recipe.description?.image?.asset?.url && (
        <Box sx={{ position: 'relative', height: 384, mb: 3, borderRadius: 1, overflow: 'hidden' }}>
          <Image
            src={recipe.description.image.asset.url!}
            alt={recipe.description.image.alt || recipe.title}
            fill
            style={{ objectFit: 'cover' }}
            priority // Optional: Prioritize for hero image
            sizes="(max-width: 768px) 100vw, 50vw" // Responsive sizes for optimization
          />
        </Box>
      )}
      <Typography variant="h1" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 'bold', mb: 2 }}>
        {recipe.title}
      </Typography>

      {/* Description */}
      {recipe.description && (
        <Box sx={{ mb: 4 }}>
          {recipe.description.title && (
            <Typography variant="h2" sx={{ fontSize: '1.25rem', fontStyle: 'italic', mb: 2 }}>
              {recipe.description.title}
            </Typography>
          )}
          {recipe.description.notes && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontStyle: 'italic' }}>
              {recipe.description.notes}
            </Typography>
          )}
          {recipe.description.content && (
            <PortableText value={recipe.description.content} components={PortableTextComponents} />
          )}
        </Box>
      )}

      {/* Metadata: Time, Servings, Difficulty */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4, fontSize: '0.875rem', color: 'text.secondary' }}>
        <Typography component="span">⏱️ {recipe.preparationTime} min prep</Typography>
        <Typography component="span">🍽️ {recipe.servings} servings</Typography>
        <Typography component="span">⭐ {recipe.difficulty}</Typography>
        {recipe.cuisine && <Typography component="span">🌍 {recipe.cuisine}</Typography>}
      </Box>

      {/* Ingredients */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 'bold', mb: 2 }}>
            Składniki
          </Typography>
          <List sx={{ ml: 3 }}>
            {recipe.ingredients.map((ing, i) => (
              <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                <Typography variant="body2">
                  {ing.quantity} {ing.name}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Preparation Steps */}
      {recipe.preparationSteps && recipe.preparationSteps.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h2" sx={{ fontSize: '1.5rem', fontWeight: 'bold', mb: 2 }}>
            Przygotowanie
          </Typography>
          {recipe.preparationSteps.map((step, i) => (
            <Box key={step._key || i} sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ fontSize: '1.125rem', fontWeight: '600', mb: 1 }}>
                Krok {i + 1}
              </Typography>
              {step.image?.asset?.url && (
                <Box sx={{ position: 'relative', height: 192, mb: 1, borderRadius: 1, overflow: 'hidden' }}>
                  <Image
                    src={step.image.asset.url!}
                    alt={step.image.alt || `Step ${i + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </Box>
              )}
              {step.content && <PortableText value={step.content} components={PortableTextComponents} />}
              {step.notes && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, fontStyle: 'italic' }}>
                  {step.notes}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      {/* Additional Info */}
      <Grid container spacing={2} sx={{ fontSize: '0.875rem' }}>
        {recipe.calories && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography>Calories: {recipe.calories}</Typography>
          </Grid>
        )}
        {recipe.cookingTime && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography>Cooking Time: {recipe.cookingTime} min</Typography>
          </Grid>
        )}
        {recipe.dietaryRestrictions && recipe.dietaryRestrictions.length > 0 && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography>Dietary: {recipe.dietaryRestrictions.join(', ')}</Typography>
          </Grid>
        )}
        {recipe.tags && recipe.tags.length > 0 && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography>Tags: {recipe.tags.join(', ')}</Typography>
          </Grid>
        )}
      </Grid>

      {/* Source */}
      {recipe.source && (
        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Source: {recipe.source.title || (recipe.source.isInternet ? recipe.source.http : recipe.source.book)}
          </Typography>
        </Box>
      )}
    </Box>
  );
}