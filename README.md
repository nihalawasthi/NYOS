# StyleHub - 3D Animated E-Commerce T-Shirt Store

A cutting-edge e-commerce platform featuring immersive 3D product visualization and smooth animations built with Next.js, React Three Fiber, and Stripe integration.

## Features

- **3D Hero Section**: Stunning animated 3D T-shirt model with particle effects and interactive lighting
- **Interactive Product Viewer**: Rotate, zoom, and explore T-shirts in full 3D with real-time color changes
- **Dynamic Color Selection**: Switch between multiple color options with live 3D preview
- **Smooth Animations**: Professional micro-interactions and transitions throughout the interface
- **Shopping Cart**: Add products to cart with visual feedback
- **Responsive Design**: Mobile-first design that works seamlessly across all devices
- **Stripe Integration**: Ready for payment processing (configure with your Stripe keys)

## Tech Stack

- **Frontend**: Next.js 16, React 19
- **3D Graphics**: React Three Fiber, Three.js, Drei
- **Styling**: Tailwind CSS v4
- **Payments**: Stripe
- **Icons**: Lucide React

## Getting Started

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Add the following environment variables to your project (via Vercel's Vars section):
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  ├── layout.tsx          # Root layout with metadata
  ├── page.tsx            # Main e-commerce page
  └── globals.css         # Global styles and animations

/components
  ├── hero-3d.tsx         # 3D hero section with particles
  └── product-3d.tsx      # Interactive 3D product viewer
```

## Customization

### Colors
Edit the `PRODUCTS` array in `/app/page.tsx` to add new T-shirt colors:
```tsx
const PRODUCTS = [
  {
    id: 1,
    name: 'Your Design',
    price: 39.99,
    colors: ['#HEX1', '#HEX2', '#HEX3'],
    description: 'Your description',
  },
  // ...
];
```

### 3D Models
- Hero 3D: Modify `RotatingTshirt` component in `/components/hero-3d.tsx`
- Product Viewer: Modify `TshirtModel` component in `/components/product-3d.tsx`

### Animations
Add or modify animations in `/app/globals.css` in the `@layer utilities` section.

### Colors Scheme
The app uses a modern dark theme with cyan/blue accents:
- Primary: Cyan (`#00D4FF`)
- Secondary: Blue (`#0077BE`)
- Accent: Pink/Orange/Purple gradients
- Background: Slate (`#0F172A` - `#1E293B`)

## Payment Integration

To enable payments:

1. Get your Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com)
2. Add them to your Vercel project environment variables
3. Implement checkout in the cart component (future enhancement)

## Performance Tips

- 3D rendering is optimized for modern browsers
- Use `dynamic()` imports for 3D components to avoid SSR issues
- Consider using the `Suspense` component for smoother loading states

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 12+)

## Future Enhancements

- Add more customization options (size, style variations)
- Implement product detail pages with specifications
- Create user accounts and wishlist feature
- Add product reviews and ratings
- Implement checkout flow with Stripe
- Add inventory management
- Create admin dashboard

## Support

For issues or questions, please create an issue in the repository or contact support.

## License

MIT License - Feel free to use this for commercial or personal projects.
