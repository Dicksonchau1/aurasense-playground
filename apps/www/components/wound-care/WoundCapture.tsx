
"use client";
import React, { useRef, useState } from 'react';

interface WoundCaptureProps {
  onCapture?: (file: File) => void;
}

const WoundCapture: React.FC<WoundCaptureProps> = ({ onCapture }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setResult(null);
    setUploading(true);
    try {
      // POST to backend capture endpoint (update URL as needed)
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('patient_id', 'patient-123'); // Replace with real patient/session ID
      formData.append('institution', 'polyu'); // Replace with real institution
      const res = await fetch('/api/wound-care/capture', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setResult(data);
      if (onCapture) onCapture(file);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h3>Wound Photo Capture</h3>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Capture/Upload Photo'}
      </button>
      {previewUrl && (
        <div style={{ marginTop: 12 }}>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: 240, borderRadius: 8 }} />
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 12, color: 'green' }}>
          <div>Photo hash: <b>{result.photo_hash}</b></div>
          {result.audit_event && (
            <pre style={{ fontSize: 12, background: '#f4f4f4', padding: 8, borderRadius: 4 }}>
              {JSON.stringify(result.audit_event, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default WoundCapture;
