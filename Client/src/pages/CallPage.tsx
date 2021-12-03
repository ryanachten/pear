import { Box, Button, Header, Main, Text } from "grommet";
import { Link } from "grommet-icons";
import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import Logo from "../components/Logo";
import VideoChat from "../components/VideoChat";
import VideoControls from "../components/VideoControls";
import { Routes } from "../constants/routes";
import { getPeerGroup, getPeerGroupError } from "../selectors/peerSelectors";
import { SignalContext } from "../services/SignalService";
import { LoadingPage } from "./LoadingPage";

interface CallPageParams {
  groupCode: string;
}

export const CallPage = () => {
  const history = useHistory();
  const { groupCode } = useParams<CallPageParams>();
  const group = useSelector(getPeerGroup);
  const groupError = useSelector(getPeerGroupError);
  const signalService = useContext(SignalContext);

  const navigateHome = () => history.push(Routes.Home);

  useEffect(() => {
    signalService.sendAddToGroup(groupCode);
  }, []);

  if (!group && !groupError) {
    return <LoadingPage />;
  }
  if (groupError) {
    return <p>{groupError}</p>;
  }
  return (
    <Main pad="large">
      <Header pad="small">
        <Logo />
        <Box direction="row" align="flex-end">
          <Box
            margin={{
              right: "small",
            }}
          >
            <Text weight="bold">Call</Text>
            <Button
              active
              label={group?.groupName}
              secondary
              icon={<Link color="#333333" />}
              reverse
            />
          </Box>
          <Button label="new call" primary onClick={navigateHome} />
        </Box>
      </Header>
      <VideoChat />
      <VideoControls />
    </Main>
  );
};
