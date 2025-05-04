// components/movies/MovieUpload.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MovieUploadProps {
  onUploadSuccess: (url: string) => void;
}

export const MovieUpload = ({ onUploadSuccess }: MovieUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    error?: string;
    url?: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadResult({ success: false, error: "No file selected" });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("Invalid response format from server");
      }

      if (res.ok && data.url) {
        setUploadResult({ success: true, url: data.url });
        onUploadSuccess(data.url);
      } else {
        const errorMessage = data.error || `Upload failed with status: ${res.status}`;
        setUploadResult({ success: false, error: errorMessage });
      }
    } catch (error) {
      setUploadResult({
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload image",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="poster-upload">Upload Poster</Label>
        <Input
          id="poster-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
      {file && (
        <Button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          size="sm"
        >
          {isUploading ? "Uploading..." : "Upload Image"}
        </Button>
      )}
      {uploadResult && !uploadResult.success && (
        <p className="text-sm text-red-500">{uploadResult.error}</p>
      )}
    </div>
  );
};