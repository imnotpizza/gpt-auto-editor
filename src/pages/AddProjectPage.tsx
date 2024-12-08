// FileAddPage.js
import { Button } from 'antd';
import { usePage } from './PageContext';

/**
 * 선택된 폴더 엾는경우, 파일 추가 페이지
 */
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
