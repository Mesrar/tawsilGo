// app/driver/onboarding/components/document-upload-step.tsx
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"

export function DocumentUploadStep({ onNext }: { onNext: () => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"]
    }
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Document Upload</h2>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragActive ? "border-primary bg-primary/10" : "border-muted"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-muted-foreground">
          {isDragActive
            ? "Drop files here"
            : "Drag & drop documents here, or click to select"}
        </p>
      </div>
      <Button onClick={onNext} className="w-full">
        Continue to Verification
      </Button>
    </div>
  )
}