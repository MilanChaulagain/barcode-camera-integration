# Camera Barcode Scanner - Next.js Ecommerce

A React/Next.js implementation of a camera-based barcode scanner for ecommerce applications.

## Features

- **Real-time barcode scanning** using device camera
- **Multiple barcode format support**: EAN, UPC, Code 128, QR codes, and more
- **Mobile-friendly** with automatic back camera selection
- **Product lookup** after successful scan
- **TypeScript** for type safety
- **Responsive design** with visual feedback

## Libraries Used

- **@zxing/library**: Powerful barcode/QR code scanning library
- **react-webcam**: Easy webcam access in React
- **Next.js 14**: React framework with App Router

## Installation

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click "Open Camera Scanner" to activate the camera
2. Grant camera permissions when prompted
3. Click "Start Scanning" 
4. Point your camera at a barcode
5. The app will automatically detect and decode the barcode
6. Product information will display if found in the database

## Camera Permissions

The app requires camera access. Make sure to:
- Grant camera permissions when prompted
- Use HTTPS in production (required for camera access)
- Test on localhost for development

## Extending the App

### Add More Products

Edit `app/page.tsx` and add products to the `productDatabase`:

```typescript
const productDatabase: Record<string, Product> = {
  'YOUR_BARCODE_HERE': {
    barcode: 'YOUR_BARCODE_HERE',
    name: 'Product Name',
    price: 19.99,
    image: '/product-image.jpg',
  },
};
```

### Connect to Real API

Replace the mock database with an API call:

```typescript
const handleScanSuccess = async (barcode: string) => {
  const response = await fetch(`/api/products/${barcode}`);
  const product = await response.json();
  setProduct(product);
};
```

### Add to Cart Integration

Implement the cart logic in the `addToCart` function:

```typescript
const addToCart = () => {
  // Use your state management (Redux, Zustand, Context, etc.)
  dispatch(addItemToCart(product));
};
```

## Deployment

For production deployment on Vercel, Netlify, or other platforms:

```bash
npm run build
npm start
```

**Important**: HTTPS is required for camera access in production.

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 11+)
- Mobile browsers: ✅ Full support with rear camera

## Troubleshooting

**Camera not working?**
- Check browser permissions
- Ensure you're using HTTPS (or localhost)
- Try a different browser
- Check if another app is using the camera

**Barcode not scanning?**
- Ensure good lighting
- Hold the barcode steady and flat
- Try different distances from the camera
- Make sure the barcode is in the scanning frame

## License

MIT
