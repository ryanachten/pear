import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import VideoChat from "../components/VideoChat";
import { getPeerGroup, getPeerGroupError } from "../selectors/peerSelectors";
import { SignalContext } from "../services/SignalService";
import { LoadingPage } from "./LoadingPage";

interface CallPageParams {
  groupCode: string;
}

export const CallPage = () => {
  const { groupCode } = useParams<CallPageParams>();
  const group = useSelector(getPeerGroup);
  const groupError = useSelector(getPeerGroupError);

  const signalService = useContext(SignalContext);

  useEffect(() => {
    signalService.SendAddToGroup(groupCode);
  }, []);

  if (!group && !groupError) {
    return <LoadingPage />;
  }
  if (groupError) {
    return <p>{groupError}</p>;
  }
  return (
    <div>
      <VideoChat />
    </div>
  );
};
