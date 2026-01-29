const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface User {
  id: number;
  email: string;
  name: string;
  isAdmin?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  colors: string[];
  description: string;
  fullDescription: string;
  sizes: string[];
  stock: number;
  rating: number;
  reviews: number;
  features: string[];
  image?: string;
}

export interface Order {
  id: string;
  items: any[];
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

// Auth API
export async function register(email: string, password: string, name: string): Promise<AuthResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) throw new Error('Registration failed');
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error('Error registering:', error);
    return null;
  }
}

export async function login(email: string, password: string): Promise<AuthResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
}

// Products API
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const result = await res.json();
    const products = result.data || result;
    return products.map((p: any) => ({
      ...p,
      price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
      rating: typeof p.rating === 'string' ? parseFloat(p.rating) : p.rating,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProduct(id: number): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    const result = await res.json();
    const product = result.data || result;
    return {
      ...product,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      rating: typeof product.rating === 'string' ? parseFloat(product.rating) : product.rating,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products/search/${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to search products');
    const result = await res.json();
    const products = result.data || result;
    return products.map((p: any) => ({
      ...p,
      price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
      rating: typeof p.rating === 'string' ? parseFloat(p.rating) : p.rating,
    }));
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products/category/${category}`);
    if (!res.ok) throw new Error('Failed to fetch products by category');
    const result = await res.json();
    const products = result.data || result;
    return products.map((p: any) => ({
      ...p,
      price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
      rating: typeof p.rating === 'string' ? parseFloat(p.rating) : p.rating,
    }));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

// Orders API
export async function createOrder(orderData: {
  items: any[];
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalAmount: number;
}): Promise<Order | null> {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error('Failed to create order');
    const result = await res.json();
    return result.data || result;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const result = await res.json();
    return result.data || result;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const res = await fetch(`${API_BASE}/orders/${id}`);
    if (!res.ok) throw new Error('Failed to fetch order');
    const result = await res.json();
    return result.data || result;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

export async function updateOrderStatus(
  id: string,
  status: string
): Promise<Order | null> {
  try {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    const result = await res.json();
    return result.data || result;
  } catch (error) {
    console.error('Error updating order status:', error);
    return null;
  }
}

// Reviews API
export async function getProductReviews(productId: number): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/reviews/product/${productId}`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export async function createReview(userId: number, productId: number, rating: number, comment: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, rating, comment }),
    });
    if (!res.ok) throw new Error('Failed to create review');
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error('Error creating review:', error);
    return null;
  }
}

export async function deleteReview(reviewId: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/reviews/${reviewId}`, { method: 'DELETE' });
    return res.ok;
  } catch (error) {
    console.error('Error deleting review:', error);
    return false;
  }
}

// Wishlist API
export async function getWishlist(userId: number): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/wishlist/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch wishlist');
    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
}

export async function addToWishlist(userId: number, productId: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId }),
    });
    return res.ok;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return false;
  }
}

export async function removeFromWishlist(userId: number, productId: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/wishlist/${userId}/${productId}`, { method: 'DELETE' });
    return res.ok;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return false;
  }
}

// Payment API - Razorpay Integration
export async function createRazorpayOrder(
  amount: number,
  orderId?: string,
  customerEmail?: string,
  customerName?: string
): Promise<{ orderId: string; amount: number; currency: string } | null> {
  try {
    const res = await fetch(`${API_BASE}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        orderId: orderId || 'N/A',
        customerEmail: customerEmail || 'N/A',
        customerName: customerName || 'N/A',
      }),
    });
    if (!res.ok) throw new Error('Failed to create order');
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return null;
  }
}

export async function verifyRazorpayPayment(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  orderId?: string
): Promise<{ status: string; message: string } | null> {
  try {
    const res = await fetch(`${API_BASE}/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId,
      }),
    });
    if (!res.ok) throw new Error('Payment verification failed');
    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return null;
  }
}

export async function processCashOnDelivery(orderId: string): Promise<{ success: boolean; data: any } | null> {
  try {
    const res = await fetch(`${API_BASE}/payment/cod`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });
    if (!res.ok) throw new Error('Failed to process COD');
    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Error processing COD:', error);
    return null;
  }
}

export async function getPaymentStatus(orderId: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/payment/status/${orderId}`);
    if (!res.ok) throw new Error('Failed to get payment status');
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error('Error getting payment status:', error);
    return null;
  }
}