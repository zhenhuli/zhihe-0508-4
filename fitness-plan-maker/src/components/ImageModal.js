import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90%;
  animation: scaleIn 0.3s ease;
  
  @keyframes scaleIn {
    from { transform: scale(0.8); }
    to { transform: scale(1); }
  }
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 85vh;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
`;

const ImageTitle = styled.div`
  text-align: center;
  color: white;
  font-size: 1.2rem;
  margin-top: 15px;
  font-weight: 500;
`;

function ImageModal({ image, title, onClose }) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalImage src={image} alt={title} />
        <ImageTitle>{title}</ImageTitle>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ImageModal;
