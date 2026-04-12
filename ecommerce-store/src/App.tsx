import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { Navbar } from '@components/Navbar'
import { Footer } from '@components/Footer'
import HomePage from '@pages/Home/HomePage'
import ShopPage from '@pages/Shop/ShopPage'
import ProductDetailPage from '@pages/ProductDetail/ProductDetailPage'
import CartPage from '@pages/Cart/CartPage'
import LoginPage from '@pages/Auth/LoginPage'
import RegisterPage from '@pages/Auth/RegisterPage'
import CheckoutPage from "@pages/Checkout/CheckoutPage";
import OrderSuccessPage from "@pages/OrderSuccess/OrderSuccessPage";
import AboutPage from '@pages/About/AboutPage'
import ContactPage from '@pages/Contact/ContactPage'



export default function App() {
	return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					flexDirection: "column",
				}}>
				<ScrollToTop />
				<Navbar />
				<main style={{ flex: 1 }}>
					<Routes>
						<Route
							path="/"
							element={<HomePage />}
						/>
						<Route
							path="/shop"
							element={<ShopPage />}
						/>
						<Route
							path="/about"
							element={<AboutPage />}
						/>
						<Route
							path="/contact"
							element={<ContactPage />}
						/>
						<Route
							path="/product/:id"
							element={<ProductDetailPage />}
						/>
						<Route
							path="/cart"
							element={<CartPage />}
						/>
						<Route
							path="/login"
							element={<LoginPage />}
						/>
						<Route
							path="/register"
							element={<RegisterPage />}
						/>
						<Route
							path="/checkout"
							element={<CheckoutPage />}
						/>
						<Route
							path="/order-success/:id"
							element={<OrderSuccessPage />}
						/>
					</Routes>
				</main>
				<Footer />
			</div>
	);
}
