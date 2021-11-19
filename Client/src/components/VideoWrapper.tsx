import { Box, Text } from "grommet";
import { ReactNode } from "react";
import styled from "styled-components";

interface IVideoWrapperProps {
  children: ReactNode;
  subtitle: string;
}

const Wrapper = styled(Box)`
  position: relative;
  max-height: calc(100vh - 60px);
`;

const MetaWrapper = styled.div`
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 2;
`;

const VideoWrapper = ({ children, subtitle }: IVideoWrapperProps) => {
  return (
    <Wrapper background="light-4">
      <MetaWrapper>
        <Text>{subtitle}</Text>
      </MetaWrapper>
      {children}
    </Wrapper>
  );
};

export default VideoWrapper;
