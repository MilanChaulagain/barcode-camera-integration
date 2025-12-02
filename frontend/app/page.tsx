'use client';

import { useState } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner';

interface Product {
  barcode: string;
  name: string;
  price: number;
  image: string;
}

// Mock product database
const productDatabase: Record<string, Product> = {
  '012345678905': {
    barcode: '012345678905',
    name: 'Wireless Mouse',
    price: 29.99,
    image: '/placeholder-product.jpg',
  },
  '5901234123457': {
    barcode: '5901234123457',
    name: 'Sample Product',
    price: 19.99,
    image: '/placeholder-product.jpg',
  },
  '978-0-123456-78-9': {
    barcode: '978-0-123456-78-9',
    name: 'Programming Book',
    price: 49.99,
    image: '/placeholder-book.jpg',
  },
  'QR-TEST-12345': {
    barcode: 'QR-TEST-12345',
    name: 'QR Code Product',
    price: 99.99,
    image: '/placeholder-product.jpg',
  },
  '5901234123488': {
    barcode: '5901234123488',
    name: 'Headphone',
    price: 79.99,
    image: '/placeholder-product.jpg',
  },
  // Add more products as needed
};

export default function Home() {
  const [scannedBarcode, setScannedBarcode] = useState<string>('');
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string>('');
  const [showScanner, setShowScanner] = useState(false);

  // Test function to simulate scanning
  const testScan = (testBarcode: string) => {
    console.log('Testing with barcode:', testBarcode);
    handleScanSuccess(testBarcode);
  };

  const handleScanSuccess = (barcode: string) => {
    console.log('🔍 Received barcode from scanner:', barcode);
    console.log('🔍 Barcode type:', typeof barcode);
    console.log('🔍 Barcode length:', barcode.length);
    setScannedBarcode(barcode);
    setError('');
    
    // Try multiple normalization strategies
    const cleanBarcode = barcode.replace(/[-\s]/g, ''); // Remove hyphens and spaces
    const trimmedBarcode = barcode.trim(); // Remove whitespace
    
    console.log('🔍 Trying to match:');
    console.log('  - Original:', barcode);
    console.log('  - Cleaned:', cleanBarcode);
    console.log('  - Trimmed:', trimmedBarcode);
    console.log('🔍 Available products:', Object.keys(productDatabase));
    
    // Try exact match first, then variations
    const foundProduct = 
      productDatabase[barcode] || 
      productDatabase[cleanBarcode] || 
      productDatabase[trimmedBarcode] ||
      // Try matching against all keys case-insensitively
      Object.entries(productDatabase).find(([key]) => 
        key.replace(/[-\s]/g, '').toLowerCase() === cleanBarcode.toLowerCase()
      )?.[1];
    
    if (foundProduct) {
      setProduct(foundProduct);
      console.log('✅ Product found:', foundProduct.name);
    } else {
      setProduct(null);
      setError(`Product with barcode "${barcode}" not found in database`);
      console.log('❌ Product not found');
      console.log('💡 Hint: Add this barcode to productDatabase in app/page.tsx');
    }
  };

  const handleScanError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const addToCart = () => {
    if (product) {
      alert(`Added ${product.name} to cart!`);
      // Implement your cart logic here
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
          Barcode Scanner - Ecommerce
        </h1>

        {!showScanner ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <button
              onClick={() => {
                setShowScanner(true);
                setScannedBarcode('');
                setProduct(null);
                setError('');
              }}
              style={{
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#ffffff',
                backgroundColor: '#4CAF50',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              }}
            >
              Open Camera Scanner
            </button>
          </div>
        ) : (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              backgroundColor: '#fff3cd', 
              padding: '12px', 
              borderRadius: '6px', 
              marginBottom: '10px',
              fontSize: '14px',
              color: '#856404',
              border: '1px solid #ffeaa7'
            }}>
              <strong>Debug:</strong> {scannedBarcode ? `Last scanned: ${scannedBarcode}` : 'Waiting for barcode scan...'}
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => testScan('012345678905')}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Test: Mouse
                </button>
                <button
                  onClick={() => testScan('5901234123457')}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Test: Sample Product
                </button>
                <button
                  onClick={() => testScan('5901234123488')}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Test: Headphone
                </button>
              </div>
            </div>
            <BarcodeScanner
              onScanSuccess={handleScanSuccess}
              onScanError={handleScanError}
              height={400}
            />
            <button
              onClick={() => setShowScanner(false)}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                fontSize: '14px',
                color: '#666',
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Close Scanner
            </button>
          </div>
        )}

        {scannedBarcode && !product && !error && (
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ marginTop: 0, color: '#333' }}>Scanned Barcode:</h3>
            <p
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#4CAF50',
                fontFamily: 'monospace',
              }}
            >
              {scannedBarcode}
            </p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              Looking up product...
            </p>
          </div>
        )}

        {scannedBarcode && product && (
          <div
            style={{
              backgroundColor: '#e8f5e9',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '2px solid #4CAF50',
            }}
          >
            <p style={{ margin: 0, color: '#2e7d32', fontWeight: 'bold' }}>
              ✓ Barcode Scanned: {scannedBarcode}
            </p>
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #ef5350',
            }}
          >
            {error}
          </div>
        )}

        {product && (
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <h2 style={{ marginTop: 0, color: '#333' }}>Product Found!</h2>
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ color: '#555', marginBottom: '10px' }}>{product.name}</h3>
              <p style={{ fontSize: '28px', color: '#4CAF50', fontWeight: 'bold', margin: '10px 0' }}>
                ${product.price.toFixed(2)}
              </p>
              <p style={{ color: '#777', fontSize: '14px' }}>
                Barcode: {product.barcode}
              </p>
            </div>
            <button
              onClick={addToCart}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#fff',
                backgroundColor: '#ff9800',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f57c00')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ff9800')}
            >
              Add to Cart
            </button>
          </div>
        )}

        <div
          style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#1565c0',
          }}
        >
          <h4 style={{ marginTop: 0 }}>Instructions:</h4>
          <ul style={{ marginBottom: 0 }}>
            <li>Click "Open Camera Scanner" to activate the camera</li>
            <li>Click "Start Scanning" and point your camera at a barcode</li>
            <li>Supported formats: EAN, UPC, Code 128, QR codes, and more</li>
            <li>
              <a 
                href="/test-barcodes" 
                target="_blank"
                style={{ color: '#1565c0', fontWeight: 'bold', textDecoration: 'underline' }}
              >
                📱 Open Sample Barcodes (display on mobile & scan)
              </a>
            </li>
            <li>Available test products: 012345678905, 5901234123457</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
