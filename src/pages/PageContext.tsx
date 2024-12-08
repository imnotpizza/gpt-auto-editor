import React, { createContext, useState, useContext, useEffect } from 'react';

export type TPage = 'addProject' | 'selectEditFile' | 'editor';

interface PageContextType {
  currentPage: TPage;
  setCurrentPage: (page: TPage) => void;
}

const PageContext = createContext<PageContextType>({
  currentPage: 'addProject',
  setCurrentPage: () => {},
});

export const PageProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<TPage>('addProject');

  useEffect(() => {
    // Check localStorage for selected files
    const selectedFiles = localStorage.getItem('selectedFiles');
    if (selectedFiles) {
      setCurrentPage('editor');
    }
  }, []);

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePage = () => useContext(PageContext);
