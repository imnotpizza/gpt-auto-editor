// FileAddPage.js
import { Button } from 'antd';
import { usePage } from './PageContext';

const AddProjectPage = () => {
  const { setCurrentPage } = usePage();

  return (
    <div>
      <Button type="primary" onClick={() => setCurrentPage('selectEditFile')}>
        Add Files
      </Button>
    </div>
  );
};

export default AddProjectPage;
