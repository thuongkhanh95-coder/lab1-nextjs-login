export interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  price: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Noise-Canceling Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
    price: "$199.99",
  },
  {
    id: 2,
    name: "Mechanical Gaming Keyboard",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    description: "RGB backlit mechanical keyboard with tactile blue switches and detachable USB-C cable.",
    price: "$89.99",
  },
  {
    id: 3,
    name: "Ultra-Slim Smart Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    description: "Track your health metrics, heart rate, and workouts with a crystal-clear AMOLED display.",
    price: "$149.50",
  },
  {
    id: 4,
    name: "Ergonomic Wireless Mouse",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    description: "Designed for all-day comfort with silent clicks and high-precision optical tracking.",
    price: "$39.99",
  },
  {
    id: 5,
    name: "Portable Bluetooth Speaker",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
    description: "IPX7 waterproof wireless speaker delivering deep bass and 360-degree sound.",
    price: "$59.00",
  },
  {
    id: 6,
    name: "4K Ultra HD Action Camera",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80",
    description: "Capture your adventures with stunning 4K video stabilization and wide-angle lens.",
    price: "$129.99",
  },
];
