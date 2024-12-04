import React, { useState } from 'react';
import { Button, Tree, message } from 'antd';

/**
 * 파일 디렉토리 선택 기능
 * TODO: gpt 인식에 문제있을 경우, \n 등 불필요 문자 제거 로직 필요
 * 
 */
const DirectoryTreeWithFileContent = () => {
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [fileContentMap, setFileContentMap] = useState(new Map());

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

  // 디렉토리의 트리 데이터를 생성
  const buildTree = async (directoryHandle) => {
    const children = [];
    for await (const [name, handle] of directoryHandle.entries()) {
      if (handle.kind === 'directory') {
        children.push({
          title: name,
          key: handle.name, // 고유한 키
          children: await buildTree(handle),
        });
      } else if (handle.kind === 'file') {
        children.push({
          title: name,
          key: handle.name, // 고유한 키
          isLeaf: true,
          handle, // 파일 핸들을 저장
        });
      }
    }
    return children;
  };

  // 체크박스 선택 이벤트 핸들러
  const onCheck = (checkedKeysValue, { checkedNodes }) => {
    setCheckedKeys(checkedKeysValue);

    // 선택된 파일의 내용을 읽어들임
    const fileMap = new Map();
    const filePromises = checkedNodes
      .filter((node) => node.isLeaf && node.handle) // 파일만 필터링
      .map(async (node) => {
        const file = await node.handle.getFile();
        const content = await file.text(); // 파일 내용 읽기
        fileMap.set(file.name, content); // 파일 이름과 내용을 해시맵에 저장
      });

    Promise.all(filePromises)
      .then(() => {
        setFileContentMap(fileMap);
        message.success('Selected files loaded successfully!');
      })
      .catch((error) => {
        console.error('Error reading files:', error);
        message.error('Failed to load file contents.');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button type="primary" onClick={handleDirectoryPicker}>
        Select Directory
      </Button>
      <div style={{ marginTop: '20px' }}>
        <Tree
          checkable
          treeData={treeData}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
        />
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Selected File Contents:</h3>
        <pre>{JSON.stringify(Object.fromEntries(fileContentMap), null, 2)}</pre>
      </div>
    </div>
  );
};

export default DirectoryTreeWithFileContent;
