import React from 'react';
import './SupportModal.css';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Enjoying the Clock?</h2>
        <p>If you like what I do, please consider supporting my work. It helps me create more cool things for you!</p>
        <a
          href="https://patreon.com/mariusrfst?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink"
          target="_blank"
          rel="noopener noreferrer"
          className="support-button"
        >
          Support me on Patreon
        </a>
        <p className="cookie-notice">
          By using this website, you accept the use of mandatory cookies. We won't use your data for any purpose. You're in complete control.
        </p>
      </div>
    </div>
  );
};

export default SupportModal;
