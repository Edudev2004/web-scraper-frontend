import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './core/layout/MainLayout';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { ProductsPage } from './features/products/pages/ProductsPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
