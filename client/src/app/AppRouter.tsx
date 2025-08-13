import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import PublicRoute from "../shared/routes/PublicRoute";
import PrivateRoute from "../shared/routes/PrivateRoute";
import AdminLayout from "../pages/AdminLayout";
import ProductManagement from "../features/product/ProductManagement";
import AllProductPage from "../pages/AllProductPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CheckoutPage from "../features/order/CheckoutPage";
import CheckoutSuccessPage from "../pages/CheckoutSuccessPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<AllProductPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="users" />
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" />
        <Route />
      </Route>
    </Routes>
  );
}

export default AppRouter;
