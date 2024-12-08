import React, { useEffect, useState } from 'react';
import { Button, Tree, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';

/**
 * 파일 디렉토리 선택 기능
 * TODO: gpt 인식에 문제있을 경우, \n 등 불필요 문자 제거 로직 필요
 * 
 */
const DirectoryTreeWithWriteFeature = () => {
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [fileContentMap, setFileContentMap] = useState(new Map());
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

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

  const buildTree = async (directoryHandle: FileSystemDirectoryHandle) => {
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
          handle,
        });
      }
    }
    return children;
  };

  const onCheck = (checkedKeysValue, { checkedNodes }) => {
    setCheckedKeys(checkedKeysValue);

    const fileMap = new Map();
    const filePromises = checkedNodes
      .filter((node) => node.isLeaf && node.handle)
      .map(async (node) => {
        const file = await node.handle.getFile();
        const content = await file.text();
        fileMap.set(file.name, { content, handle: node.handle });
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

  const onFileSelect = (fileName) => {
    if (fileContentMap.has(fileName)) {
      setSelectedFileName(fileName);
      setSelectedFileContent(fileContentMap.get(fileName).content);
    }
  };

  const handleContentChange = (e) => {
    setSelectedFileContent(e.target.value);
  };

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

      // 업데이트된 내용을 Map에도 반영
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
            Write to File
          </Button>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Selected File Contents (Map):</h3>
        <pre>{JSON.stringify(Object.fromEntries(fileContentMap), null, 2)}</pre>
      </div>
    </div>
  );
};

export default DirectoryTreeWithWriteFeature;