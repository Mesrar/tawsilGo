import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Upload, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateFileSize, validateFileType } from "@/lib/driver-schemas";
import { DocumentType } from "@/types/driver";

interface DocumentUploadStepProps {
  documents: {
    license?: File;
    identity?: File;
    insurance?: File;
    vehicle_registration?: File;
  };
  onDocumentChange: (type: DocumentType, file: File | undefined) => void;
}

interface DocumentSectionProps {
  type: DocumentType;
  label: string;
  description: string;
  required: boolean;
  file: File | undefined;
  onFileChange: (file: File | undefined) => void;
}

function DocumentSection({
  type,
  label,
  description,
  required,
  file,
  onFileChange,
}: DocumentSectionProps) {
  const [error, setError] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError("");

      if (acceptedFiles.length === 0) {
        setError("No file selected");
        return;
      }

      const selectedFile = acceptedFiles[0];

      // Validate file size
      if (!validateFileSize(selectedFile, 5)) {
        setError("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!validateFileType(selectedFile)) {
        setError("Only JPG, PNG, and PDF files are accepted");
        return;
      }

      onFileChange(selectedFile);
    },
    [onFileChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium flex items-center gap-2">
            {label}
            {required && <Badge variant="destructive" className="text-xs">Required</Badge>}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {!file ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
              : "border-slate-300 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <Upload className={cn(
              "h-10 w-10",
              isDragActive ? "text-blue-500" : "text-slate-400"
            )} />
            <p className="text-sm font-medium">
              {isDragActive ? "Drop file here" : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, or PDF (max 5MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-green-200 bg-green-50 dark:bg-green-950 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onFileChange(undefined)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export function DocumentUploadStep({
  documents,
  onDocumentChange,
}: DocumentUploadStepProps) {
  const requiredDocumentsUploaded = !!(documents.license && documents.identity);

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">Document Upload</CardTitle>
            <CardDescription>
              Upload your driver's license and identity documents
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Required Documents Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must upload at least your <strong>driver's license</strong> and{" "}
            <strong>identity document</strong> to proceed. Other documents are optional.
          </AlertDescription>
        </Alert>

        {/* Driver's License */}
        <DocumentSection
          type="license"
          label="Driver's License"
          description="A clear photo or scan of your valid driver's license"
          required
          file={documents.license}
          onFileChange={(file) => onDocumentChange("license", file)}
        />

        {/* Identity Document */}
        <DocumentSection
          type="identity"
          label="Identity Document"
          description="Passport, national ID card, or other government-issued ID"
          required
          file={documents.identity}
          onFileChange={(file) => onDocumentChange("identity", file)}
        />

        {/* Insurance (Optional) */}
        <DocumentSection
          type="insurance"
          label="Insurance Document"
          description="Vehicle insurance certificate (optional but recommended)"
          required={false}
          file={documents.insurance}
          onFileChange={(file) => onDocumentChange("insurance", file)}
        />

        {/* Vehicle Registration (Optional) */}
        <DocumentSection
          type="vehicle_registration"
          label="Vehicle Registration"
          description="Vehicle registration certificate (optional but recommended)"
          required={false}
          file={documents.vehicle_registration}
          onFileChange={(file) => onDocumentChange("vehicle_registration", file)}
        />

        {/* Upload Progress Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Upload Progress</span>
            <span className="text-sm text-muted-foreground">
              {requiredDocumentsUploaded ? (
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Ready to continue
                </span>
              ) : (
                <span className="text-amber-600 font-medium flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Required documents needed
                </span>
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
