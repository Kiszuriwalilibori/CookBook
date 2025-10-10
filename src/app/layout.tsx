import { Inter } from 'next/font/google';
import { Box } from '@mui/material';
import theme from "@/themes/theme";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';
import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CookBook - Your Recipe Collection',
  description: 'Discover and share delicious recipes',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1976d2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <html lang="pl">
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
      <body className={inter.className}>
        
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            <Header />
            <Box component="main" sx={{ flexGrow: 1 }}>
              {children}
            </Box>
            <Footer />
          </Box>
       
      </body>
      </ThemeProvider>
    </AppRouterCacheProvider>
    </html>
  );
}
