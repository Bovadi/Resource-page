import { useState, useCallback } from 'react';
import { Card } from './useCardData';

export interface UseModalReturn {
  isOpen: boolean;
  selectedCourse: Card | null;
  openModal: (course: Card) => void;
  closeModal: () => void;
}

export const useModal = (): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Card | null>(null);

  const openModal = useCallback((course: Card) => {
    setSelectedCourse(course);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Delay clearing the course to allow for exit animation
    setTimeout(() => {
      setSelectedCourse(null);
    }, 300);
  }, []);

  return {
    isOpen,
    selectedCourse,
    openModal,
    closeModal,
  };
};