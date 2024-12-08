// PageContext.js
import React, { createContext, useState, useContext } from 'react';

export type TPage = 'addProject' | 'selectEditFile' | 'editor';

interface PageContextType {
  currentPage: TPage;
  setCurrentPage: (
    page: TPage,
  ) => void;
}

const PageContext = createContext<{
  currentPage: TPage;
  setCurrentPage: (page: TPage) => void;
}>({
  currentPage: 'addProject',
  setCurrentPage: () => {},
});

export const PageProvider = ({ children }) => {
  const [currentPage, setCurrentPage] =
    useState<PageContextType['currentPage']>('addProject');

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePage = () => useContext(PageContext);
