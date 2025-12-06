import React from 'react';
import styles from './Textarea.module.css';

interface TextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  id?: string;
  name?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  maxLength,
  rows = 4,
  id,
  name,
}) => {
  const textareaId = id || name || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        rows={rows}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
      />
      {maxLength && (
        <span className={styles.counter}>
          {value.length}/{maxLength}
        </span>
      )}
      {error && (
        <span id={`${textareaId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

