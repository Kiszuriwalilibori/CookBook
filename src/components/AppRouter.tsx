import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '@/pages/index';
import About from '@/pages/about';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
