export interface IFileTree {
  title: string;
  key: string;
  isLeaf: boolean;
  children?: IFileTree[];
}