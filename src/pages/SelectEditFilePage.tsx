import React, { useState } from 'react';
import { Button, Tree, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';

/**
 * SelectEditFilePage: 파일 디렉토리 선택, 파일 내용 편집 및 저장 기능을 제공하는 페이지.
 */
const SelectEditFilePage = () => {
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [fileContentMap, setFileContentMap] = useState(new Map());
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  // 디렉토리 선택 처리
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

  // 디렉토리 구조를 트리 데이터로 변환
  const buildTree = async (directoryHandle) => {
    const children = [];
    for await (const [name, handle] of directoryHandle.entries()) {
      if (handle.kind === 'directory') {
        children.push({
          title: name,
          key: `${directoryHandle.name}/${name}`,
          children: await buildTree(handle),
        });
      } else if (handle.kind === 'file') {
        children.push({
          title: name,
          key: `${directoryHandle.name}/${name}`,
          isLeaf: true,
          handle,
        });
      }
    }
    return children;
  };

  // 파일 선택 및 내용 읽기
  const onCheck = async (checkedKeysValue, { checkedNodes }) => {
    setCheckedKeys(checkedKeysValue);

    const fileMap = new Map();
    const filePromises = checkedNodes
      .filter((node) => node.isLeaf && node.handle)
      .map(async (node) => {
        const file = await node.handle.getFile();
        const content = await file.text();
        fileMap.set(node.key, { content, handle: node.handle });
      });

    await Promise.all(filePromises);
    setFileContentMap(fileMap);
    message.success('Selected files loaded successfully!');
  };

  // 특정 파일 선택 시 내용 표시
  const onFileSelect = (fileKey) => {
    if (fileContentMap.has(fileKey)) {
      const fileData = fileContentMap.get(fileKey);
      setSelectedFileName(fileKey);
      setSelectedFileContent(fileData.content);
    }
  };

  // 텍스트 영역 내용 변경
  const handleContentChange = (e) => {
    setSelectedFileContent(e.target.value);
  };

  // 파일 내용 저장
  const handleWriteToFile = async () => {
    if (!selectedFileName) {
      message.warning('No file selected.');
      return;
    }

    try {
      const fileInfo = fileContentMap.get(selectedFileName);
      const writableStream = await fileInfo.handle.createWritable();
      await writableStream.write(selectedFileContent);
      await writableStream.close();

      // 업데이트된 내용을 Map에 반영
      fileContentMap.set(selectedFileName, {
        ...fileInfo,
        content: selectedFileContent,
      });

      message.success(`File "${selectedFileName}" updated successfully!`);
    } catch (error) {
      console.error('Error writing to file:', error);
      message.error('Failed to update the file.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button type="primary" onClick={handleDirectoryPicker}>
        Select Directory
      </Button>
      <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <Tree
            checkable
            treeData={treeData}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            onSelect={(selectedKeys) => {
              if (selectedKeys.length > 0) onFileSelect(selectedKeys[0]);
            }}
          />
        </div>
        <div style={{ flex: 2 }}>
          <h3>File Editor:</h3>
          <TextArea
            rows={10}
            value={selectedFileContent}
            onChange={handleContentChange}
            placeholder="Select a file to edit its content"
            disabled={!selectedFileName}
          />
          <Button
            type="primary"
            style={{ marginTop: '10px' }}
            onClick={handleWriteToFile}
            disabled={!selectedFileName}
          >
            Save File
          </Button>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Selected File Contents:</h3>
        <pre>{JSON.stringify(Object.fromEntries(fileContentMap), null, 2)}</pre>
      </div>
    </div>
  );
};

export default SelectEditFilePage;
