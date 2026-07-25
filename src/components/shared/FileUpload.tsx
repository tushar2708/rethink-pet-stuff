import * as React from "react"
import { motion } from "framer-motion"
import { Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/cn"

interface FileUploadProps {
  value?: File | string
  onChange: (file: File | null) => void
  accept?: string
  maxSizeMB?: number
  shape?: "circle" | "square"
  placeholder?: string
  className?: string
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      value,
      onChange,
      accept = "image/*",
      maxSizeMB = 5,
      shape = "circle",
      placeholder = "Upload photo",
      className,
    },
    ref
  ) => {
    const [isDragActive, setIsDragActive] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const maxSizeBytes = maxSizeMB * 1024 * 1024

    // Initialize preview from string value
    React.useEffect(() => {
      if (typeof value === "string") {
        setPreviewUrl(value)
      } else if (value instanceof File) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(value)
      }
    }, [value])

    const validateAndSetFile = (file: File | null) => {
      setError(null)

      if (!file) {
        onChange(null)
        setPreviewUrl(null)
        return
      }

      if (file.size > maxSizeBytes) {
        setError(
          `File size must be less than ${maxSizeMB}MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`
        )
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
        onChange(file)
      }
      reader.readAsDataURL(file)
    }

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === "dragenter" || e.type === "dragover") {
        setIsDragActive(true)
      } else if (e.type === "dragleave") {
        setIsDragActive(false)
      }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragActive(false)

      const files = e.dataTransfer?.files
      if (files?.[0]) {
        validateAndSetFile(files[0])
      }
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files
      if (files?.[0]) {
        validateAndSetFile(files[0])
      }
    }

    const handleRemove = () => {
      validateAndSetFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }

    const isCircle = shape === "circle"
    const isImage = previewUrl && typeof value !== "string"

    return (
      <div ref={ref} className={cn("flex flex-col gap-4", className)}>
        {!previewUrl ? (
          <>
            {/* Drag and Drop Zone */}
            <motion.div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              animate={{
                borderColor: isDragActive ? "rgb(var(--color-primary-rgb, 245 158 11))" : "rgb(226 232 240)",
                backgroundColor: isDragActive ? "rgb(var(--color-primary-rgb, 245 158 11) / 0.05)" : "transparent",
              }}
              transition={{ duration: 0.2 }}
              className={cn(
                "relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors",
                "cursor-pointer hover:border-primary/50 hover:bg-primary/5"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <motion.div
                animate={{ scale: isDragActive ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
              </motion.div>
              <div className="text-center">
                <p className="font-medium text-sm text-foreground">{placeholder}</p>
                <p className="text-xs text-muted-foreground">
                  or drag and drop
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Max size: {maxSizeMB}MB
              </p>
            </motion.div>

            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileInput}
              className="hidden"
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-md bg-destructive/10 p-3 text-xs text-destructive"
              >
                {error}
              </motion.div>
            )}
          </>
        ) : (
          /* Preview */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-3"
          >
            <div
              className={cn(
                "overflow-hidden bg-muted flex items-center justify-center",
                isCircle ? "h-32 w-32 rounded-full mx-auto" : "h-40 w-full rounded-lg"
              )}
            >
              <img
                src={previewUrl}
                alt="Preview"
                className={cn(
                  "h-full w-full object-cover",
                  isCircle ? "rounded-full" : "rounded-lg"
                )}
              />
            </div>

            {isImage && value instanceof File && (
              <div className="flex items-center justify-between rounded-md bg-secondary/50 p-3">
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {value.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(value.size / 1024).toFixed(1)}KB
                  </p>
                </div>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleRemove}
              className="w-full gap-2"
            >
              <X className="h-4 w-4" />
              Remove
            </Button>
          </motion.div>
        )}
      </div>
    )
  }
)

FileUpload.displayName = "FileUpload"

export { FileUpload }
