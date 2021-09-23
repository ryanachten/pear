import { Button, Header, Main, Text } from "grommet";
import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import VideoChat from "../components/VideoChat";
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
    <Main>
      <Header background="brand" pad="small">
        <Button label="New call" onClick={navigateHome} />
        <Text>
          <Text>Call: </Text>
          <Text weight="bold">{group?.groupName}</Text>
        </Text>
      </Header>
      <VideoChat />
    </Main>
  );
};
