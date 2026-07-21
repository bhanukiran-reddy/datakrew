"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import styles from "./fileUploadInput.module.css";

interface FileUploadInputProps {
  onFileSelect?: (file: File | null) => void;
  accept?: string;
  id?: string;
  placeholder?: string;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({
  onFileSelect,
  accept = ".doc,.docx,.pdf,.odt,.rtf",
  id = "resume-upload-input",
  placeholder = "Upload your resume or drag and drop it here",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      onFileSelect?.(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      onFileSelect?.(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      id={`${id}-dropzone`}
      className={styles.dropzone}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={triggerFileInput}
      role="button"
      tabIndex={0}
      aria-label="Upload your file or drag and drop it here"
      onKeyDown={(e) => e.key === "Enter" && triggerFileInput()}
    >
      <input
        id={id}
        type="file"
        ref={fileInputRef}
        className={styles.hiddenInput}
        onChange={handleFileChange}
        accept={accept}
        aria-hidden="true"
      />
      <div className={styles.dropzoneTextWrapper}>
        <h3 className={styles.uploadText}>
          {fileName ? (
            `Selected: ${fileName}`
          ) : (
            <>
              {placeholder.includes("*") ? (
                <>
                  {placeholder.split("*")[0]}
                  <span className={styles.requiredStar}>*</span>
                  {placeholder.split("*")[1]}
                </>
              ) : (
                placeholder
              )}
            </>
          )}
        </h3>
        {!fileName && (
          <p className={styles.fileTypes}>Only {accept.split(',').join(', ')}</p>
        )}
      </div>
      <div className={styles.uploadIcon}>
        <Image src="/icons/backup.png" alt="Upload" width={56} height={38} />
      </div>
    </div>
  );
};

export default FileUploadInput;