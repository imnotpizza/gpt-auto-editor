// App.js
import { PageProvider, usePage } from './pages/PageContext';
import AddProjectPage from './pages/AddProjectPage';
import SelectEditFilePage from './pages/SelectEditFilePage';
import EditorPage from './pages/EditorPage';

const App = () => {
  const { currentPage } = usePage();

  return (
    <div style={{ padding: '20px' }}>
      {currentPage === 'addProject' && <AddProjectPage />}
      {currentPage === 'selectEditFile' && <SelectEditFilePage />}
      {currentPage === 'editor' && <EditorPage />}
    </div>
  );
};

const AppWithContext = () => (
  <PageProvider>
    <App />
  </PageProvider>
);

export default AppWithContext;
