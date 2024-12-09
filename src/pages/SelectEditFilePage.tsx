import React, { useState } from 'react';
import { Button, Tree, message } from 'antd';
import { usePage } from './PageContext';
import Input from 'antd/es/input/Input';

const SelectEditFilePage = () => {
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [filePathsMap, setFilePathsMap] = useState(new Map()); // 파일명 + 절대경로 관리
  const [rootPath, setRootPath] = useState('');
  const { setCurrentPage } = usePage();

  const handleDirectoryPicker = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      const tree = await buildTree(directoryHandle, '');
      setTreeData(tree);
      message.success('Directory loaded successfully!');
    } catch (error) {
      console.error('Error accessing directory:', error);
      message.error('Failed to load directory.');
    }
  };

  const buildTree = async (directoryHandle, parentPath) => {
    const children = [];
    console.log('#####1111', directoryHandle, parentPath)
    for await (const [name, handle] of directoryHandle.entries()) {
      const currentPath = `${parentPath}/${name}`; // 절대 경로 생성
      if (handle.kind === 'directory') {
        children.push({
          title: name,
          key: name,
          children: await buildTree(handle, currentPath),
        });
      } else if (handle.kind === 'file') {
        children.push({
          title: name,
          key: currentPath, // 절대 경로를 키로 사용
          isLeaf: true,
        });
        // 파일 경로를 Map에 추가
        setFilePathsMap((prev) => new Map(prev).set(name, currentPath));
      }
    }
    return children;
  };

  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
  };

  const handleComplete = () => {
    if (checkedKeys.length === 0) {
      message.error('Please select at least one file.');
      return;
    }

    // 선택된 파일명 + 절대경로를 LocalStorage에 저장
    const selectedFiles = checkedKeys.map((key) => {
      console.log('### key', checkedKeys)
      const fileName = key.split('/').pop(); // 경로에서 파일명 추출
      return { fileName, url: key };
    });
    localStorage.setItem('selectedFiles', JSON.stringify(selectedFiles));
    localStorage.setItem('rootPath', rootPath);
    return;
    message.success('Files saved to local storage!');
    setCurrentPage('editor'); // Navigate to the editor
  };

  return (
    <div>
      <h1>선택</h1>
      <Input
        placeholder='폴더의 절대경로 입력'
        onChange={(e) => setRootPath(e.target.value)}
        value={rootPath}
      />
      <Button type="primary" onClick={handleDirectoryPicker}>
        Select Directory
      </Button>
      <Tree
        checkable
        treeData={treeData}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        style={{ marginTop: '20px' }}
      />
      <Button
        type="primary"
        style={{ marginTop: '20px' }}
        onClick={handleComplete}
        disabled={checkedKeys.length === 0 || !rootPath}
      >
        Complete Selection
      </Button>
    </div>
  );
};

export default SelectEditFilePage;
