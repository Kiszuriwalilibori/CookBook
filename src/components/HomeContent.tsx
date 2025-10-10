'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

// Dynamically import the Header component with no SSR
const Header = dynamic(() => import('@/components/layout/Header'), { ssr: false });

const HomeContent = () => {
  return (
    <Box>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 8, md: 12 },
          mb: 6,
          borderRadius: 2,
          backgroundImage: 'linear-gradient(rgba(25, 118, 210, 0.8), rgba(25, 118, 210, 0.8))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center' }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: 'white',
              }}
            >
              Discover & Share Amazing Recipes
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Find the perfect recipe for any occasion. From quick weeknight dinners to impressive
              feasts, we've got you covered.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              href="/recipes"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 8,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Explore Recipes
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" component="h2">
            Featured Categories
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse recipes by category to find your next culinary adventure
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 4 }}>
          {[
            { name: 'Breakfast', count: '120+ Recipes' },
            { name: 'Lunch', count: '200+ Recipes' },
            { name: 'Dinner', count: '180+ Recipes' },
            { name: 'Desserts', count: '150+ Recipes' },
            { name: 'Vegan', count: '90+ Recipes' },
            { name: 'Quick Meals', count: '130+ Recipes' },
          ].map((category) => (
            <Box
              key={category.name}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: 1,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
            >
              <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                {category.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {category.count}
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                href={`/recipes?category=${category.name.toLowerCase()}`}
                sx={{ mt: 'auto' }}
              >
                View Recipes
              </Button>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HomeContent;
