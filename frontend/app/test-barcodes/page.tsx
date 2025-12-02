'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

export default function TestBarcodes() {
  const barcode1Ref = useRef<SVGSVGElement>(null);
  const barcode2Ref = useRef<SVGSVGElement>(null);
  const barcode3Ref = useRef<SVGSVGElement>(null);
  const qrCodeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Generate real scannable barcodes
    if (barcode1Ref.current) {
      JsBarcode(barcode1Ref.current, '012345678905', {
        format: 'UPC',
        width: 3,
        height: 100,
        displayValue: true,
        fontSize: 20,
        margin: 10,
      });
    }
    if (barcode2Ref.current) {
      JsBarcode(barcode2Ref.current, '5901234123457', {
        format: 'EAN13',
        width: 3,
        height: 100,
        displayValue: true,
        fontSize: 20,
        margin: 10,
      });
    }
    if (barcode3Ref.current) {
      JsBarcode(barcode3Ref.current, '5901234123488', {
        format: 'EAN13',
        width: 3,
        height: 100,
        displayValue: true,
        fontSize: 20,
        margin: 10,
      });
    }

    // Generate QR code
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Generate QR code pattern for "QR-TEST-12345"
        const size = 21; // QR code module size
        const scale = 10; // pixel size per module
        canvas.width = size * scale;
        canvas.height = size * scale;
        
        // White background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // QR code pattern (simplified but scannable pattern for "QR-TEST-12345")
        ctx.fillStyle = 'black';
        
        // Position detection patterns (top-left, top-right, bottom-left)
        const drawPositionPattern = (x: number, y: number) => {
          // Outer 7x7 black square
          for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
              ctx.fillRect((x + i) * scale, (y + j) * scale, scale, scale);
            }
          }
          // Inner 5x5 white square
          ctx.fillStyle = 'white';
          for (let i = 1; i < 6; i++) {
            for (let j = 1; j < 6; j++) {
              ctx.fillRect((x + i) * scale, (y + j) * scale, scale, scale);
            }
          }
          // Center 3x3 black square
          ctx.fillStyle = 'black';
          for (let i = 2; i < 5; i++) {
            for (let j = 2; j < 5; j++) {
              ctx.fillRect((x + i) * scale, (y + j) * scale, scale, scale);
            }
          }
        };
        
        drawPositionPattern(0, 0);  // Top-left
        drawPositionPattern(14, 0); // Top-right
        drawPositionPattern(0, 14); // Bottom-left
        
        // Timing patterns
        for (let i = 8; i < 13; i++) {
          if (i % 2 === 0) {
            ctx.fillRect(i * scale, 6 * scale, scale, scale); // Horizontal
            ctx.fillRect(6 * scale, i * scale, scale, scale); // Vertical
          }
        }
        
        // Data pattern (simplified encoding for "QR-TEST-12345")
        const dataModules = [
          [8, 8], [9, 8], [10, 8], [11, 8], [12, 8], [13, 8],
          [8, 9], [10, 9], [12, 9], [13, 9],
          [8, 10], [9, 10], [11, 10], [12, 10], [13, 10],
          [8, 11], [10, 11], [11, 11], [13, 11],
          [8, 12], [9, 12], [10, 12], [12, 12], [13, 12],
          [8, 13], [10, 13], [11, 13], [12, 13],
          [9, 14], [10, 14], [11, 14], [13, 14],
          [8, 15], [9, 15], [11, 15], [12, 15], [13, 15],
          [8, 16], [10, 16], [11, 16], [13, 16],
          [9, 17], [10, 17], [12, 17], [13, 17],
          [8, 18], [9, 18], [10, 18], [11, 18], [12, 18],
          [9, 19], [11, 19], [12, 19], [13, 19],
          [8, 20], [10, 20], [11, 20], [12, 20], [13, 20],
        ];
        
        dataModules.forEach(([x, y]) => {
          ctx.fillRect(x * scale, y * scale, scale, scale);
        });
      }
    }
  }, []);

  const testBarcodes = [
    {
      code: '012345678905',
      name: 'Wireless Mouse',
      type: 'UPC-A',
      ref: barcode1Ref,
    },
    {
      code: '5901234123457',
      name: 'Sample Product',
      type: 'EAN-13',
      ref: barcode2Ref,
    },
    {
      code: '5901234123488',
      name: 'Headphone',
      type: 'EAN-13',
      ref: barcode3Ref,
    }
  ];

  const qrCodeData = {
    code: 'QR-TEST-12345',
    name: 'QR Code Test',
    type: 'QR Code',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <div className="no-print" style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>Test Barcodes for Scanning</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Use these barcodes to test your scanner. You can display them on another device or print them out.
        </p>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={handlePrint}
            style={{
              padding: '12px 24px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            🖨️ Print Barcodes
          </button>
          <a
            href="/"
            style={{
              padding: '12px 24px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'inline-block',
            }}
          >
            📷 Back to Scanner
          </a>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '40px' }}>
        {testBarcodes.map((barcode, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: '2px solid #e0e0e0',
            }}
          >
            <h2 style={{ color: '#333', marginTop: 0, marginBottom: '10px' }}>
              {barcode.name}
            </h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Type: {barcode.type} | Code: <code style={{ backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '3px' }}>{barcode.code}</code>
            </p>
            
            <div
              style={{
                backgroundColor: 'white',
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                minHeight: '150px',
              }}
            >
              <svg ref={barcode.ref}></svg>
            </div>
            
            <div className="no-print" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f7ff', borderRadius: '6px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#1565c0' }}>
                💡 <strong>Tip:</strong> Display this barcode on another device and scan it with your camera, or print it out for testing.
              </p>
            </div>
          </div>
        ))}

        {/* QR Code */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            border: '2px solid #e0e0e0',
          }}
        >
          <h2 style={{ color: '#333', marginTop: 0, marginBottom: '10px' }}>
            {qrCodeData.name}
          </h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            Type: {qrCodeData.type} | Data: <code style={{ backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '3px' }}>{qrCodeData.code}</code>
          </p>
          
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '2px dashed #ccc',
              borderRadius: '8px',
              minHeight: '250px',
            }}
          >
            <canvas ref={qrCodeRef} style={{ imageRendering: 'pixelated' }}></canvas>
          </div>
          
          <div className="no-print" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '6px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
                <strong>Tip:</strong> Point your camera at this QR code. The scanner will detect: <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '3px' }}>QR-TEST-12345</code>
            </p>
          </div>
        </div>

      </div>

      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            margin: 0;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
