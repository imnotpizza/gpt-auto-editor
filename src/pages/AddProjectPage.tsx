import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';

/**
 * 선택한 프로젝트/파일 없을때 페이지
 */
export default function AddProjectPage() {
  return (
    <Container>
      <h1>파일 선택</h1>
      <Button type="primary">파일 선택</Button>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;
