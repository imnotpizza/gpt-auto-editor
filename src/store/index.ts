import { create } from 'zustand';

interface IProps {
  treeData: any[];
  checkedKeys: string[];
  fileContentMap: Map<string, string>;
  selectedFileContent: string;
  selectedFileName: string;
  setTreeData: (treeData: any[]) => void;
  setCheckedKeys: (checkedKeys: string[]) => void;
  setFileContentMap: (fileContentMap: Map<string, string>) => void;
  setSelectedFileContent: (content: string) => void;
  setSelectedFileName: (name: string) => void;
  setContext: (context: Window) => void;
}

/**
 * Zustand 스토어 설정
 */
const useFileStore = create<IProps>((set) => ({
  treeData: [],
  checkedKeys: [],
  fileContentMap: new Map(),
  selectedFileContent: '',
  selectedFileName: '',
  setTreeData: (treeData) => set({ treeData }),
  setCheckedKeys: (checkedKeys) => set({ checkedKeys }),
  setFileContentMap: (fileContentMap) => set({ fileContentMap }),
  setSelectedFileContent: (content) => set({ selectedFileContent: content }),
  setSelectedFileName: (name) => set({ selectedFileName: name }),
  setContext: (context: Window) => set({ context }),
}));

export default useFileStore;
