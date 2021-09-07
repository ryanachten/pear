import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import VideoChat from "../components/VideoChat";
import { getPeerGroup } from "../selectors/peerSelectors";
import { SignalContext } from "../services/SignalService";
import { LoadingPage } from "./LoadingPage";

interface CallPageParams {
  groupCode: string;
}

export const CallPage = () => {
  const { groupCode } = useParams<CallPageParams>();
  const group = useSelector(getPeerGroup);
  const signalService = useContext(SignalContext);

  useEffect(() => {
    signalService.SendAddToGroup(groupCode);
  }, []);

  // TODO: handle when call group is not present
  if (!group) {
    return <LoadingPage />;
  }
  return (
    <div>
      <VideoChat />
    </div>
  );
};
