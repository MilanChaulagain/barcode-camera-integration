'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScanSuccess: (barcode: string) => void;
  onScanError?: (error: string) => void;
  width?: number | string;
  height?: number | string;
}

/**
 * BarcodeScanner Component using html5-qrcode
 * 
 * Works on both desktop browsers and mobile devices
 * Supports multiple barcode formats: EAN-13, UPC-A, Code 128, QR codes, etc.
 * 
 * Desktop: Uses getUserMedia API to access webcam
 * Mobile: Automatically uses rear camera for better scanning
 */
const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScanSuccess,
  onScanError,
  width = '100%',
  height = 480,
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string>('');
  const [scanError, setScanError] = useState<string>('');
  const qrCodeRegionId = 'qr-code-region';

  // Initialize scanner
  useEffect(() => {
    scannerRef.current = new Html5Qrcode(qrCodeRegionId);
    console.log('✓ html5-qrcode scanner initialized');
    
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  // Start/Stop scanning
  const handleScanToggle = async () => {
    if (!scannerRef.current) return;

    if (isScanning) {
      // Stop scanning
      try {
        await scannerRef.current.stop();
        console.log('✓ Scanner stopped');
        setIsScanning(false);
        setIsCameraReady(false);
        setLastScannedCode('');
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    } else {
      // Start scanning
      try {
        const config = {
          fps: 10, // Frames per second
          qrbox: { width: 250, height: 250 }, // Scanning box size
          aspectRatio: 16 / 9,
        };

        await scannerRef.current.start(
          { facingMode: 'environment' }, // Use rear camera on mobile
          config,
          (decodedText, decodedResult) => {
            // Success callback
            if (decodedText && decodedText !== lastScannedCode) {
              console.log('✓ Raw barcode detected:', decodedText);
              console.log('✓ Barcode format:', decodedResult?.result?.format?.formatName || 'Unknown');
              console.log('✓ Full decode result:', decodedResult);
              setLastScannedCode(decodedText);
              onScanSuccess(decodedText);

              // Haptic feedback
              if (navigator.vibrate) {
                navigator.vibrate(200);
              }

              // Audio feedback
              try {
                const beep = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGH0fPTgjMGHm7A7+OZURE=');
                beep.play().catch(() => {});
              } catch {}

              // Auto-stop after successful scan
              setTimeout(async () => {
                if (scannerRef.current?.isScanning) {
                  await scannerRef.current.stop();
                  setIsScanning(false);
                  setIsCameraReady(false);
                }
                setLastScannedCode('');
              }, 2000);
            }
          },
          (errorMessage) => {
            // Error callback (silent - normal when no barcode visible)
          }
        );

        console.log('✓ Scanner started');
        setIsScanning(true);
        setIsCameraReady(true);
        setScanError('');
      } catch (error) {
        console.error('Error starting scanner:', error);
        const errorMsg = error instanceof Error ? error.message : 'Failed to start camera';
        
        let userFriendlyMsg = 'Camera access denied or not available.';
        if (errorMsg.includes('Permission denied') || errorMsg.includes('NotAllowedError')) {
          userFriendlyMsg = 'Camera permission denied. Please allow camera access.';
        } else if (errorMsg.includes('NotFoundError')) {
          userFriendlyMsg = 'No camera found on this device.';
        } else if (errorMsg.includes('NotReadableError')) {
          userFriendlyMsg = 'Camera is being used by another application.';
        }
        
        setScanError(userFriendlyMsg);
        setIsCameraReady(false);
        onScanError?.(userFriendlyMsg);
      }
    }
  };

  return (
    <div style={{ position: 'relative', width, height, backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Scanner container */}
      <div 
        id={qrCodeRegionId} 
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'relative'
        }}
      />

      {/* Error message */}
      {scanError && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#ff4444',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '6px',
            fontSize: '14px',
            maxWidth: '90%',
            textAlign: 'center',
            zIndex: 1000,
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          }}
        >
          {scanError}
        </div>
      )}

      {/* Control button */}
      <button
        onClick={handleScanToggle}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '14px 32px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#ffffff',
          backgroundColor: isScanning ? '#ff4444' : '#4CAF50',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
        }}
      >
        {isScanning ? '⏸ Stop Scanning' : '▶ Start Scanning'}
      </button>

      {/* Global styles for html5-qrcode */}
      <style jsx global>{`
        #${qrCodeRegionId} {
          border: none !important;
        }
        #${qrCodeRegionId} video {
          border-radius: 8px;
          object-fit: cover;
        }
        #${qrCodeRegionId}__scan_region {
          border: 3px solid ${isScanning ? '#00ff00' : 'rgba(255,255,255,0.8)'} !important;
          box-shadow: ${isScanning ? '0 0 20px #00ff00' : 'none'} !important;
        }
        #${qrCodeRegionId}__dashboard {
          display: none !important;
        }
        #${qrCodeRegionId}__dashboard_section {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default BarcodeScanner;
