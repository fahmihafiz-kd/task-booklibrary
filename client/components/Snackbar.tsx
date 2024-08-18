import React, { useState, useEffect } from 'react';
import '../styles/Snackbar.css';

interface SnackbarProps {
  message: string;
  type: 'success' | 'error';
  isOpen: boolean;
  duration?: number;
  onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, type, isOpen, duration = 3000, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`snackbar ${type}`}>
      {message}
    </div>
  );
};

export default Snackbar;
