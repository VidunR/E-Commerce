// ================= Types / Interfaces =================
export class Product {
  constructor({ id, sku, name, price, description, category, images, variants, stock, inStock }) {
    this.id = id;
    this.sku = sku;
    this.name = name;
    this.price = price;
    this.description = description;
    this.category = category;
    this.images = images;
    this.variants = variants;
    this.stock = stock;
    this.inStock = inStock;
  }
}

export class ProductVariant {
  constructor({ id, color, colorHex, stock }) {
    this.id = id;
    this.color = color;
    this.colorHex = colorHex;
    this.stock = stock;
  }
}

export class CartItem {
  constructor({ id, productId, productName, productImage, variantId, variantColor, quantity, price }) {
    this.id = id;
    this.productId = productId;
    this.productName = productName;
    this.productImage = productImage;
    this.variantId = variantId;
    this.variantColor = variantColor;
    this.quantity = quantity;
    this.price = price;
  }
}

export class Address {
  constructor({ id, fullName, addressLine1, addressLine2, city, state, zipCode, country, phone, isDefault }) {
    this.id = id;
    this.fullName = fullName;
    this.addressLine1 = addressLine1;
    this.addressLine2 = addressLine2 || '';
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.country = country;
    this.phone = phone;
    this.isDefault = isDefault;
  }
}

export class Order {
  constructor({ id, orderNumber, date, status, items, subtotal, shipping, tax, total, shippingAddress }) {
    this.id = id;
    this.orderNumber = orderNumber;
    this.date = date;
    this.status = status;
    this.items = items;
    this.subtotal = subtotal;
    this.shipping = shipping;
    this.tax = tax;
    this.total = total;
    this.shippingAddress = shippingAddress;
  }
}

// ================= Mock Data =================
export const mockProducts = [
  {
    id: '1',
    sku: 'LW-001',
    name: 'The Minimalist',
    price: 189,
    description: 'A timeless wallet crafted from premium Italian leather. Slim profile with RFID protection and space for 8 cards.',
    category: 'bifold',
    images: [
      'public/products/wallet1.jpg',
      'public/products/wallet2.jpg',
    ],
    variants: [
      { id: '1-black', color: 'Black', colorHex: '#000000', stock: 15 },
      { id: '1-brown', color: 'Brown', colorHex: '#654321', stock: 8 },
      { id: '1-navy', color: 'Navy', colorHex: '#1a1a2e', stock: 5 },
    ],
    stock: 28,
    inStock: true,
  },
  {
    id: '2',
    sku: 'LW-002',
    name: 'The Executive',
    price: 249,
    description: 'Full-grain leather bifold with coin pocket. Designed for those who appreciate classic elegance.',
    category: 'bifold',
    images: [
      'public/products/wallet3.jpg',
      'public/products/wallet4.jpg',
    ],
    variants: [
      { id: '2-black', color: 'Black', colorHex: '#000000', stock: 12 },
      { id: '2-cognac', color: 'Cognac', colorHex: '#8b4513', stock: 6 },
    ],
    stock: 18,
    inStock: true,
  },
  {
    id: '3',
    sku: 'LW-003',
    name: 'The Cardholder',
    price: 129,
    description: 'Ultra-slim cardholder with minimalist design. Perfect for carrying essentials without the bulk.',
    category: 'cardholder',
    images: [
      'public/products/wallet5.jpg',
      'public/products/wallet6.jpg',
    ],
    variants: [
      { id: '3-black', color: 'Black', colorHex: '#000000', stock: 20 },
      { id: '3-gray', color: 'Gray', colorHex: '#808080', stock: 15 },
      { id: '3-tan', color: 'Tan', colorHex: '#d2b48c', stock: 10 },
    ],
    stock: 45,
    inStock: true,
  },
  {
    id: '4',
    sku: 'LW-004',
    name: 'The Traveler',
    price: 299,
    description: 'Multi-compartment wallet with passport holder. Built for the modern globetrotter.',
    category: 'travel',
    images: [
      'public/products/wallet7.jpg',
      'public/products/wallet8.jpg',
    ],
    variants: [
      { id: '4-black', color: 'Black', colorHex: '#000000', stock: 8 },
      { id: '4-brown', color: 'Brown', colorHex: '#654321', stock: 4 },
    ],
    stock: 12,
    inStock: true,
  },
  {
    id: '5',
    sku: 'LW-005',
    name: 'The Zip Around',
    price: 219,
    description: 'Secure zip-around wallet with multiple card slots and cash compartments.',
    category: 'zip',
    images: [
      'public/products/wallet9.jpg',
      'public/products/wallet10.jpg',
    ],
    variants: [
      { id: '5-black', color: 'Black', colorHex: '#000000', stock: 10 },
      { id: '5-navy', color: 'Navy', colorHex: '#1a1a2e', stock: 7 },
    ],
    stock: 17,
    inStock: true,
  },
  {
    id: '6',
    sku: 'LW-006',
    name: 'The Money Clip',
    price: 159,
    description: 'Sleek money clip wallet with card slots. Minimalism meets functionality.',
    category: 'money-clip',
    images: [
      'public/products/wallet11.jpg',
      'public/products/wallet12.jpg',
    ],
    variants: [
      { id: '6-black', color: 'Black', colorHex: '#000000', stock: 18 },
      { id: '6-gray', color: 'Gray', colorHex: '#808080', stock: 12 },
    ],
    stock: 30,
    inStock: true,
  },
];

export const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-2025-001',
    date: '2025-11-15',
    status: 'delivered',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'The Minimalist',
        productImage: '/products/wallet1.jpg',
        variantId: '1-black',
        variantColor: 'Black',
        quantity: 1,
        price: 189,
      },
    ],
    subtotal: 189,
    shipping: 0,
    tax: 15.12,
    total: 204.12,
    shippingAddress: {
      id: '1',
      fullName: 'John Doe',
      addressLine1: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      isDefault: true,
    },
  },
];

export const mockAddresses = [
  {
    id: '1',
    fullName: 'John Doe',
    addressLine1: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    phone: '+1 (555) 123-4567',
    isDefault: true,
  },
  {
    id: '2',
    fullName: 'John Doe',
    addressLine1: '456 Office Blvd',
    addressLine2: 'Suite 200',
    city: 'Brooklyn',
    state: 'NY',
    zipCode: '11201',
    country: 'United States',
    phone: '+1 (555) 987-6543',
    isDefault: false,
  },
];

export const categories = [
  { value: 'all', label: 'All Products' },
  { value: 'bifold', label: 'Bifold Wallets' },
  { value: 'cardholder', label: 'Cardholders' },
  { value: 'travel', label: 'Travel Wallets' },
  { value: 'zip', label: 'Zip Around' },
  { value: 'money-clip', label: 'Money Clips' },
];
