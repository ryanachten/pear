import { Box } from "grommet";
import styled from "styled-components";
import Background from "../components/Background";
import Logo from "../components/Logo";
import {
  sonarEffectAnimation,
  sonarEffectContent,
} from "../helpers/sonarEffect";

const AnimatedBackground = styled(Background)`
  &:before {
    ${sonarEffectContent(40)}
  }
  &:after {
    ${sonarEffectContent(20)}
  }

  ${sonarEffectAnimation()}
`;

export const LoadingPage = () => {
  return (
    <AnimatedBackground justify="center" align="center">
      <Box direction="column" align="center">
        <Logo />
      </Box>
    </AnimatedBackground>
  );
};
