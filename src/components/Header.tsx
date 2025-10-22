"use client";

import React from "react";
import Menu from "@/components/Menu/Menu";

import { Book as RecipeIcon, Article as BlogIcon, Home as HomeIcon, Favorite as FavoriteIcon, Info as InfoIcon } from "@mui/icons-material";
// import { usePathname } from "next/navigation";
// import theme from "@/themes/theme";

const Header = () => {
    // const pathname: string = usePathname(); // Ensure pathname is typed as string

    // const [isMobile, setIsMobile] = useState(false);

    // useEffect(() => {
    //     // Check if window is defined (client-side)
    //     if (typeof window !== "undefined") {
    //         const checkIfMobile = () => {
    //             setIsMobile(window.innerWidth < theme.breakpoints.values.md);
    //         };

    //         // Initial check
    //         checkIfMobile();

    //         // Add event listener for window resize
    //         window.addEventListener("resize", checkIfMobile);

    //         // Cleanup
    //         return () => window.removeEventListener("resize", checkIfMobile);
    //     }
    // }, []);

    const navItems = [
        { label: "Home", href: "/", icon: <HomeIcon /> },
        { label: "Przepisy", href: "/recipes", icon: <RecipeIcon /> },
        { label: "Artykuły", href: "/blog", icon: <BlogIcon /> },
        { label: "Ulubione", href: "/favorites", icon: <FavoriteIcon /> },
        { label: "O mnie", href: "/about", icon: <InfoIcon /> },
    ];

    return <Menu navItems={navItems} /*pathname={pathname}*/ />;

    
    // return (
    //   <AppBar
    //     position="sticky"
    //     elevation={0}
    //     sx={{
    //       backgroundColor: 'background.paper',
    //       color: 'text.primary',
    //       borderBottom: '1px solid',
    //       borderColor: 'divider',
    //     }}
    //   >
    //     <Container maxWidth="lg">
    //       <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    //         {/* Logo / Brand */}
    //         <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //           <Typography
    //             variant="h6"
    //             component={Link}
    //             href="/"
    //             sx={{
    //               fontWeight: 700,
    //               color: 'primary.main',
    //               textDecoration: 'none',
    //               display: 'flex',
    //               alignItems: 'center',
    //               gap: 1,
    //             }}
    //           >
    //             <RecipeIcon />
    //             CookBook
    //           </Typography>
    //         </Box>

    //         {/* Desktop Navigation */}
    //         <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
    //           {navItems.map((item) => (
    //             <Button
    //               key={item.href}
    //               component={Link}
    //               href={item.href}
    //               startIcon={item.icon}
    //               sx={{
    //                 color: 'text.primary',
    //                 '&:hover': {
    //                   backgroundColor: 'action.hover',
    //                 },
    //               }}
    //             >
    //               {item.label}
    //             </Button>
    //           ))}
    //         </Box>

    //         {/* Mobile menu button */}
    //         <Box sx={{ display: { xs: 'block', md: 'none' } }}>
    //           <IconButton
    //             size="large"
    //             aria-label="menu"
    //             color="inherit"
    //             // onClick={handleMobileMenuOpen}
    //           >
    //             <MenuIcon />
    //           </IconButton>
    //         </Box>
    //       </Toolbar>
    //     </Container>
    //   </AppBar>
    // );
};

export default Header;
