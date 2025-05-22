// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import NavBar from './components/NavBar';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import ProductEditor from './components/ProductEditor';
import CreateProduct from './components/CreateProduct';
import CreateReview from './components/CreateReview';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/index.css';

function App() {
    return (
        <Provider store={store}>
            <Router>
                <NavBar />
                <div className="container mx-auto p-4">
                    <Routes>
                        <Route path="/" element={<ProductList />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/create-product" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
                        <Route path="/create-review/:id" element={<ProtectedRoute><CreateReview /></ProtectedRoute>} />
                        <Route path="/create-product" element={<ProductEditor />} />
                        <Route path="/products/:id/edit" element={<ProductEditor />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </div>
            </Router>
        </Provider>
    );
}

export default App;