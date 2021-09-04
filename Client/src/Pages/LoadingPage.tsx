import { Box, Heading, Main, Paragraph, Spinner } from "grommet";

export const LoadingPage = () => {
  return (
    <Main pad="large">
      <Box direction="column" align="center">
        <Heading>echo</Heading>
        <Paragraph>Please wait while we load!</Paragraph>
        <Spinner />
      </Box>
    </Main>
  );
};
