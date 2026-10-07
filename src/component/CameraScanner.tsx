import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Upload, Image as ImageIcon, FlipHorizontal, AlertCircle } from 'lucide-react';
import { classifyWaste } from '../services/aiClassifier';
import type { ClassificationResult } from '../types';
import { WASTE_ITEMS } from '../data/wasteDatabase';

interface CameraScannerProps {
  onClassificationComplete: (result: ClassificationResult) => void;
  selectedDemoKey?: string | null;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onClassificationComplete,
  selectedDemoKey
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [cameraFacing]);

  useEffect(() => {
    if (selectedDemoKey) {
      handleDemoPresetScan(selectedDemoKey);
    }
  }, [selectedDemoKey]);

  const startCamera = async () => {
    setIsCameraLoading(true);
    setCameraError(null);
    setCapturedImageUri(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported on this browser context');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraLoading(false);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        err?.message || 'Camera permission denied or camera device is unavailable.'
      );
      setIsCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const toggleCameraFacing = () => {
    setCameraFacing((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleSnapFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImageUri(dataUri);
        runClassificationOnUri(dataUri);
      }
    } else {
      runClassificationOnUri('demo-snap');
    }
  };

  const runClassificationOnUri = async (imageUri: string) => {
    setIsAnalyzing(true);
    try {
      const result = await classifyWaste(imageUri);
      setTimeout(() => {
        setIsAnalyzing(false);
        onClassificationComplete(result);
      }, 500);
    } catch (err) {
      console.error('Classification error:', err);
      setIsAnalyzing(false);
    }
  };

  const handleDemoPresetScan = async (itemKey: string) => {
    setIsAnalyzing(true);
    const item = WASTE_ITEMS.find((i) => i.id === itemKey);
    const imageUri = item?.sampleImageUri || 'demo-sample';

    setTimeout(async () => {
      const result = await classifyWaste(imageUri, itemKey);
      setIsAnalyzing(false);
      onClassificationComplete(result);
    }, 500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const uri = event.target?.result as string;
        setCapturedImageUri(uri);
        runClassificationOnUri(uri);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl paper-card border border-stone-300 shadow-xl overflow-hidden flex flex-col">
      {/* Offscreen Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Scanner Status Bar */}
      <div className="px-4 py-3 bg-[#1b4332] text-white flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE CAMERA SCANNER</span>
        </div>
        <span className="text-[11px] text-emerald-200 font-mono">
          {isAnalyzing ? 'ANALYZING IMAGE...' : capturedImageUri ? 'FRAME CAPTURED' : 'READY TO SCAN'}
        </span>
      </div>

      {/* Camera Viewport Area */}
      <div className="relative w-full aspect-4/3 sm:aspect-16/10 bg-stone-900 flex items-center justify-center overflow-hidden">
        {/* 1. Live Video Feed */}
        {!cameraError && !capturedImageUri && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* 2. Captured Image Preview */}
        {capturedImageUri && (
          <div className="relative w-full h-full flex items-center justify-center bg-stone-950">
            <img
              src={capturedImageUri}
              alt="Captured Waste Item"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => {
                setCapturedImageUri(null);
                startCamera();
              }}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-stone-900/90 text-xs font-bold text-white border border-stone-700 shadow-md hover:bg-stone-800"
            >
              Retake Photo
            </button>
          </div>
        )}

        {/* 3. Reticle Frame & Pulse Line */}
        {!cameraError && !capturedImageUri && !isAnalyzing && (
          <div className="absolute inset-6 sm:inset-10 border-2 border-emerald-500/50 rounded-2xl pointer-events-none">
            <div className="reticle-corner reticle-tl" />
            <div className="reticle-corner reticle-tr" />
            <div className="reticle-corner reticle-bl" />
            <div className="reticle-corner reticle-br" />
            <div className="scan-pulse-line" />
          </div>
        )}

        {/* 4. Loading State */}
        {isCameraLoading && !capturedImageUri && !cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900 text-emerald-400 space-y-3 p-4 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
            <span className="text-xs font-medium text-stone-300">Opening camera preview...</span>
          </div>
        )}

        {/* 5. Analyzing Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-stone-950/85 backdrop-blur-xs text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
            <div>
              <h4 className="text-sm font-extrabold text-white">Analyzing Item with Gemini Vision...</h4>
              <p className="text-xs text-stone-300 mt-1">Identifying object material & campus disposal rules</p>
            </div>
          </div>
        )}

        {/* 6. Permission Denial / Device Unavailable Fallback */}
        {cameraError && !capturedImageUri && (
          <div className="p-6 text-center max-w-sm space-y-3 text-stone-200">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Camera Unavailable</h4>
              <p className="text-xs text-stone-400 mt-1">{cameraError}</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Waste Photo</span>
            </button>
          </div>
        )}
      </div>

      {/* Demo Preset Scenarios Bar */}
      <div className="px-4 py-2.5 bg-stone-100 border-t border-stone-200">
        <div className="text-[11px] font-bold text-stone-600 mb-1.5 flex items-center justify-between">
          <span>QUICK TEST SAMPLES:</span>
          <span className="text-[10px] text-emerald-800 font-extrabold">Instant Scenario</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {WASTE_ITEMS.slice(0, 6).map((item) => (
            <button
              key={item.id}
              onClick={() => handleDemoPresetScan(item.id)}
              disabled={isAnalyzing}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-stone-800 border border-stone-300 text-[11px] font-bold whitespace-nowrap shrink-0 transition-colors shadow-2xs cursor-pointer"
            >
              {item.name.split(' ')[0]} {item.category === 'ewaste' ? '⚡' : '♻️'}
            </button>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
          className="px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-300 flex items-center gap-2 transition-colors min-h-[44px] cursor-pointer"
        >
          <ImageIcon className="w-4 h-4 text-stone-700" />
          <span>Upload</span>
        </button>

        {/* Primary Snap Button */}
        <button
          onClick={handleSnapFrame}
          disabled={isAnalyzing || isCameraLoading}
          className="flex-1 py-3 px-6 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-black text-sm tracking-wide shadow-md flex items-center justify-center gap-2 min-h-[44px] active:scale-95 transition-all cursor-pointer"
        >
          <Camera className="w-5 h-5 text-emerald-300" />
          <span>Scan item now</span>
        </button>

        {/* Camera Flip */}
        {!cameraError && (
          <button
            onClick={toggleCameraFacing}
            disabled={isAnalyzing}
            title="Flip camera direction"
            className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
