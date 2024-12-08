import React, { useState } from 'react';
import { Button, Tree, message } from 'antd';
import { usePage } from './PageContext';

const SelectEditFilePage = () => {
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const { setCurrentPage } = usePage();

  const handleDirectoryPicker = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      const tree = await buildTree(directoryHandle);
      setTreeData(tree);
      message.success('Directory loaded successfully!');
    } catch (error) {
      console.error('Error accessing directory:', error);
      message.error('Failed to load directory.');
    }
  };

  const buildTree = async (directoryHandle) => {
    const children = [];
    for await (const [name, handle] of directoryHandle.entries()) {
      if (handle.kind === 'directory') {
        children.push({
          title: name,
          key: handle.name,
          children: await buildTree(handle),
        });
      } else if (handle.kind === 'file') {
        children.push({
          title: name,
          key: handle.name,
          isLeaf: true,
        });
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
    localStorage.setItem('selectedFiles', JSON.stringify(checkedKeys));
    message.success('Files saved to local storage!');
    setCurrentPage('editor'); // Navigate to the editor
  };

  return (
    <div>
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
        disabled={checkedKeys.length === 0}
      >
        Complete Selection
      </Button>
    </div>
  );
};

export default SelectEditFilePage;
