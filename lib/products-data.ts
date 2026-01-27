export interface Product {
  id: number
  name: string
  price: number
  category: 'Essential' | 'Premium' | 'Limited' | 'Seasonal'
  colors: string[]
  description: string
  fullDescription: string
  sizes: string[]
  stock: number
  rating: number
  reviews: number
  features: string[]
  image?: string
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Essential Minimalist',
    price: 799,
    category: 'Essential',
    colors: ['#1a1a1a', '#ffffff', '#e8ddf6'],
    description: 'Pure elegance in simplicity',
    fullDescription: 'The foundation of any wardrobe. Crafted from premium organic cotton with precision stitching. Timeless design that transcends seasonal trends.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 45,
    rating: 4.9,
    reviews: 234,
    features: ['100% Organic Cotton', 'Ethically Produced', 'Premium Stitching', 'Preshrunk'],
    image: '/Tshirts/tshirt1.png',
  },
  {
    id: 2,
    name: 'Drift Series',
    price: 899,
    category: 'Premium',
    colors: ['#4a4a4a', '#8b8680', '#d4cdc5'],
    description: 'Soft, refined tones',
    fullDescription: 'Elevated comfort meets sophisticated design. Our Drift Series uses premium cotton blend with enhanced durability. Perfect for those who appreciate subtlety.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 28,
    rating: 4.8,
    reviews: 189,
    features: ['Premium Cotton Blend', 'Reinforced Seams', 'Fade Resistant', 'Expert Crafted'],
    image: '/Tshirts/tshirt2.png',
  },
  {
    id: 3,
    name: 'Canvas Premium',
    price: 999,
    category: 'Premium',
    colors: ['#2c2c2c', '#666666', '#a8a29d'],
    description: 'Luxury redefined',
    fullDescription: 'Our most luxurious offering. Constructed from the finest certified organic cotton with professional-grade finishing. Limited production.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 12,
    rating: 4.95,
    reviews: 156,
    features: ['Certified Organic', 'Limited Production', 'Museum Quality', 'Lifetime Warranty'],
    image: '/Tshirts/tshirt3.png',
  },
  {
    id: 4,
    name: 'Neutral Standard',
    price: 699,
    category: 'Essential',
    colors: ['#f0ede8', '#999999', '#5a5a5a'],
    description: 'Timeless versatility',
    fullDescription: 'The perfect everyday essential. Versatile in style and comfort, this is your go-to shirt for any occasion. Built to last through seasons of wear.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 62,
    rating: 4.7,
    reviews: 312,
    features: ['Comfortable Fit', 'Easy Care', 'Budget Friendly', 'Versatile Style'],
    image: '/Tshirts/tshirt4.png',
  },
  {
    id: 5,
    name: 'Limited Archive',
    price: 1199,
    category: 'Limited',
    colors: ['#1a1a1a', '#8b7355', '#d4af37'],
    description: 'Collector\'s edition',
    fullDescription: 'Part of our exclusive limited collection. Only 100 pieces available worldwide. Features a unique blend of traditional craftsmanship and modern design.',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 8,
    rating: 5.0,
    reviews: 87,
    features: ['Limited Edition', 'Numbered Certificate', 'Premium Materials', 'Collector\'s Item'],
    image: '/Tshirts/tshirt5.png',
  },
  {
    id: 6,
    name: 'Seasonal Capsule',
    price: 749,
    category: 'Seasonal',
    colors: ['#c4a584', '#a89f97', '#8b8680'],
    description: 'Season-inspired collection',
    fullDescription: 'Designed with the current season in mind. Fresh colors and updated fits make this the perfect addition to your wardrobe this season.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 35,
    rating: 4.6,
    reviews: 98,
    features: ['Seasonal Colors', 'Modern Fit', 'Contemporary Design', 'Limited Time'],
    image: '/Tshirts/tshirt6.png',
  },
  {
    id: 7,
    name: 'Studio Classic',
    price: 799,
    category: 'Essential',
    colors: ['#2a2a2a', '#666666', '#cccccc'],
    description: 'Artist studio edition',
    fullDescription: 'Inspired by artist collaborations. Clean lines and quality materials create a piece that works in any setting, from studio to street.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 41,
    rating: 4.8,
    reviews: 142,
    features: ['Artist Inspired', 'Quality Construction', 'Studio Approved', 'Versatile Wear'],
    image: '/Tshirts/tshirt7.png',
  },
  {
    id: 8,
    name: 'Monochrome Elite',
    price: 1099,
    category: 'Premium',
    colors: ['#000000', '#808080', '#ffffff'],
    description: 'Sophisticated palette',
    fullDescription: 'The epitome of refined taste. Our Monochrome Elite collection offers sophisticated design with uncompromising quality. Perfect for those who appreciate nuance.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 19,
    rating: 4.9,
    reviews: 201,
    features: ['Monochromatic Design', 'Premium Quality', 'Refined Details', 'Sophisticated'],
    image: '/Tshirts/tshirt8.png',
  },
]

export const CATEGORIES = ['All', 'Essential', 'Premium', 'Limited', 'Seasonal']

export const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000+', min: 1000, max: Infinity },
]

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
