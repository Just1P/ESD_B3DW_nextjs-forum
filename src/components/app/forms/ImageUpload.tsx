"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/lib/constants";
import { getInitials } from "@/lib/user-utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ImageCropDialog } from "./ImageCropDialog";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  userName?: string;
}

export function ImageUpload({ value, onChange, userName }: ImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(value);
  const [isUploading, setIsUploading] = useState(false);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>("");

  // Synchroniser previewUrl avec la prop value quand elle change
  useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  const handleDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploadedFiles([file]);
    setOriginalFileName(file.name);

    // Créer une URL locale pour le recadrage
    const localPreview = URL.createObjectURL(file);
    setImageToCrop(localPreview);
    setCropDialogOpen(true);
  };

  const handleCropComplete = async (croppedImage: Blob, fileName: string) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", croppedImage, fileName);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Détails de l'erreur serveur:", errorData);
        throw new Error(
          errorData.details || errorData.error || "Erreur lors de l'upload"
        );
      }

      const data = await response.json();

      onChange(data.url);
      setPreviewUrl(data.url);

      if (imageToCrop) {
        URL.revokeObjectURL(imageToCrop);
        setImageToCrop(null);
      }

      toast.success(SUCCESS_MESSAGES.IMAGE_UPLOADED);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.IMAGE_UPLOAD_FAILED
      );
      setPreviewUrl(value);
      setUploadedFiles([]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleError = (error: Error) => {
    toast.error(error.message || ERROR_MESSAGES.IMAGE_UPLOAD_FAILED);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage
          src={previewUrl || value || undefined}
          alt="Avatar"
          key={previewUrl || value || "default"}
        />
        <AvatarFallback className="text-2xl">
          {getInitials(userName)}
        </AvatarFallback>
      </Avatar>

      <div className="w-full">
        <Dropzone
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpg", ".jpeg"],
            "image/webp": [".webp"],
          }}
          maxSize={5 * 1024 * 1024} // 5MB
          maxFiles={1}
          onDrop={handleDrop}
          onError={handleError}
          src={uploadedFiles}
          disabled={isUploading}
          className="h-32"
        >
          <DropzoneContent>
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-orange-500" />
                <p className="text-sm text-gray-500">Upload en cours...</p>
              </div>
            ) : uploadedFiles.length > 0 ? (
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-medium">{uploadedFiles[0].name}</p>
                <p className="text-xs text-gray-500">
                  Cliquez ou glissez pour remplacer
                </p>
              </div>
            ) : null}
          </DropzoneContent>
          <DropzoneEmptyState />
        </Dropzone>

        <p className="mt-2 text-xs text-gray-500 text-center">
          PNG, JPG ou WEBP. Max 5MB.
        </p>
      </div>

      {imageToCrop && (
        <ImageCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          fileName={originalFileName}
        />
      )}
    </div>
  );
}
