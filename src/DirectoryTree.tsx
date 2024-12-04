import React, { useState } from 'react';
import { Button, Tree, message } from 'antd';

const DirectoryTreeWithCheckbox = () => {
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);

  const handleDirectoryPicker = async () => {
    try {
      // 브라우저에서 디렉토리를 선택
      const directoryHandle = await window.showDirectoryPicker();
      const tree = await buildTree(directoryHandle);
      setTreeData(tree);
      message.success('Directory loaded successfully!');
    } catch (error) {
      console.error('Error accessing directory:', error);
      message.error('Failed to load directory.');
    }
  };

  // 디렉토리 구조를 Tree UI 데이터로 변환
  const buildTree = async (directoryHandle) => {
    const children = [];
    for await (const [name, handle] of directoryHandle.entries()) {
      if (handle.kind === 'directory') {
        children.push({
          title: name,
          key: name,
          children: await buildTree(handle), // 재귀적으로 하위 디렉토리 탐색
        });
      } else if (handle.kind === 'file') {
        children.push({
          title: name,
          key: name,
          isLeaf: true, // 파일 노드
        });
      }
    }
    return children;
  };

  // 체크박스 상태 변경 이벤트 핸들러
  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button type="primary" onClick={handleDirectoryPicker}>
        Select Directory
      </Button>
      <div style={{ marginTop: '20px' }}>
        <Tree
          checkable // 체크박스 활성화
          treeData={treeData}
          onCheck={onCheck} // 체크박스 상태 변경 핸들러
          checkedKeys={checkedKeys} // 현재 체크된 키
        />
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Selected Keys:</h3>
        <pre>{JSON.stringify(checkedKeys, null, 2)}</pre>
      </div>
    </div>
  );
};

export default DirectoryTreeWithCheckbox;
