import { Box, Main } from "grommet";
import styled from "styled-components";
import Logo from "../components/Logo";
import theme from "../theme";

const brandColor = theme.global?.colors?.brand;
const LoadingBackground = styled(Main)`
  min-width: 100vw;
  min-height: 100vh;

  &:before {
    content: "";
    height: 40vw;
    width: 40vw;
    left: calc(50% - 20vw);
    top: calc(50% - 20vw);
    border-radius: 50%;
    position: absolute;
    opacity: 20%;
    animation: sonar-effect 1.5s ease-in-out 0.1s infinite;
  }
  &:after {
    content: "";
    height: 20vw;
    width: 20vw;
    left: calc(50% - 10vw);
    top: calc(50% - 10vw);
    border-radius: 50%;
    position: absolute;
    opacity: 20%;
    animation: sonar-effect 1.5s ease-in-out 0.1s infinite;
  }

  @keyframes sonar-effect {
    0% {
      opacity: 0.05;
    }
    40% {
      opacity: 0.15;
      box-shadow: 0 0 20px 10px ${brandColor};
    }
    100% {
      box-shadow: 0 0 40px 20px ${brandColor};
      transform: scale(2);
      opacity: 0;
    }
  }
`;

export const LoadingPage = () => {
  return (
    <LoadingBackground justify="center" align="center">
      <Box direction="column" align="center">
        <Logo />
      </Box>
    </LoadingBackground>
  );
};
