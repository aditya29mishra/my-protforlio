import React, { memo, useCallback, useEffect, useState, useRef } from "react";
import { MdClose, MdUpload, MdImage } from "react-icons/md";
import { useUploadMedia } from "../hooks/useUploadMedia";
import "../../styles/UploadModal.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const UploadModal = ({ isOpen, onClose, onSelect, prefix, defaultLabel = "" }) => {
  const { mutate, isPending, isError, error } = useUploadMedia();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [meta, setMeta] = useState({ label: defaultLabel, alt_text: "" });
  const [validationError, setValidationError] = useState("");

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Reset modal state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setPreviewUrl(null);
      setMeta({ label: defaultLabel, alt_text: "" });
      setValidationError("");
    }
  }, [isOpen, defaultLabel]);

  const handleFileSelect = useCallback((selectedFile) => {
    setValidationError("");

    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      setValidationError("File exceeds the 5MB limit.");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setValidationError("Only image files are allowed.");
      return;
    }

    // Free old preview if it exists
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(selectedFile);
    });

    setFile(selectedFile);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelect(droppedFile);
    },
    [handleFileSelect]
  );

  const handleInputChange = useCallback((e) => {
    setMeta((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleUpload = useCallback(() => {
    if (!file) return;

    mutate(
      { file, prefix, meta },
      {
        onSuccess: (data) => {
          onSelect(data); // { id, url, storage_path }
          onClose();
        },
      }
    );
  }, [file, prefix, meta, mutate, onSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="admin-modal__header">
          <h3 className="admin-modal__title">Upload Media</h3>
          <button
            type="button"
            className="admin-modal__close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <MdClose aria-hidden="true" />
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        <div className="admin-modal__body">
          {!file ? (
            /* Idle State */
            <div
              className="admin-modal__dropzone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <MdUpload className="admin-modal__dropzone-icon" aria-hidden="true" />
              <p className="admin-modal__dropzone-text">Click or drag image here</p>
              <p className="admin-modal__dropzone-hint">PNG, JPG, WebP up to 5MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="admin-modal__hidden-input"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
            </div>
          ) : (
            /* Preview State */
            <div className="admin-modal__preview-state">
              <div className="admin-modal__preview-wrap">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="admin-modal__preview-img" />
                ) : (
                  <MdImage className="admin-modal__preview-placeholder" aria-hidden="true" />
                )}
                <button
                  type="button"
                  className="admin-btn admin-btn--secondary admin-modal__change-btn"
                  onClick={() => setFile(null)}
                >
                  Change
                </button>
              </div>

              <div className="admin-form-field">
                <label htmlFor="media-label" className="admin-form-field__label">
                  Label
                </label>
                <input
                  id="media-label"
                  name="label"
                  type="text"
                  className="admin-form-field__input"
                  placeholder="Internal name for this media"
                  value={meta.label}
                  onChange={handleInputChange}
                  disabled={isPending}
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="media-alt" className="admin-form-field__label">
                  Alt Text
                </label>
                <input
                  id="media-alt"
                  name="alt_text"
                  type="text"
                  className="admin-form-field__input"
                  placeholder="Accessibility description"
                  value={meta.alt_text}
                  onChange={handleInputChange}
                  disabled={isPending}
                />
              </div>
            </div>
          )}

          {/* Feedback Messages */}
          {validationError && <p className="admin-modal__error">{validationError}</p>}
          {isError && <p className="admin-modal__error">{error?.message || "Upload failed."}</p>}
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className="admin-modal__footer">
          <button
            type="button"
            className="admin-btn admin-btn--secondary"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </button>
          
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleUpload}
            disabled={!file || isPending}
          >
            {isPending ? "Uploading..." : "Upload"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default memo(UploadModal);
