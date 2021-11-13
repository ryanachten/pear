import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Form,
  FormField,
  Heading,
  RadioButtonGroup,
  TextInput,
} from "grommet";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Routes } from "../constants/routes";
import { updateUserName } from "../reducers/userSlice";
import { SignalContext } from "../services/SignalService";
import { useSelector } from "react-redux";
import { getPeerGroup } from "../selectors/peerSelectors";

enum CallOpt {
  Existing = "Join an existing call",
  New = "Create new call",
}

export const LandingPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const signalService = useContext(SignalContext);
  const group = useSelector(getPeerGroup);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [userName, setUserName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [callSetting, setCallSetting] = useState<CallOpt>(CallOpt.New);

  // Automatically navigate after group has been created and responded by API
  useEffect(() => {
    if (group && shouldNavigate) {
      history.push(`${Routes.CallPage}/${group.groupCode}`);
      setShouldNavigate(false);
    }
  }, [group?.groupCode]);

  const onSubmitNewGroup = () => {
    if (groupName) {
      signalService.sendNewGroup(groupName);
      dispatch(updateUserName(userName));
      setShouldNavigate(true);
    }
  };

  const onSubmitExistingGroup = () => {
    if (groupCode) {
      dispatch(updateUserName(userName));
      history.push(`${Routes.CallPage}/${groupCode}`);
    }
  };

  return (
    <Box pad="small">
      <Form>
        <Heading>echo</Heading>
        <FormField name="name" htmlFor="name-input" label="Name">
          <TextInput
            id="name-input"
            name="name"
            placeholder="Enter a username"
            value={userName}
            onChange={(e) => setUserName(e.currentTarget.value)}
          />
        </FormField>
        <FormField name="join a call" htmlFor="join-call" label="Join a call">
          <RadioButtonGroup
            id="join-call"
            name="join a call"
            options={[CallOpt.Existing, CallOpt.New]}
            value={callSetting}
            onChange={(event) => setCallSetting(event.target.value as CallOpt)}
          />
        </FormField>
        {callSetting === CallOpt.Existing && (
          <>
            <FormField
              name="call-code"
              htmlFor="call-code-input"
              label="Call code"
            >
              <TextInput
                id="call-code"
                name="Call code"
                placeholder="Enter an existing call code"
                value={groupCode}
                onChange={(e) => setGroupCode(e.currentTarget.value)}
              />
            </FormField>
            <Button
              type="submit"
              primary
              label="Join call"
              onClick={onSubmitExistingGroup}
            />
          </>
        )}
        {callSetting === CallOpt.New && (
          <>
            <FormField
              name="call name"
              htmlFor="call-name-input"
              label="Call name"
            >
              <TextInput
                id="call-name-input"
                name="Call name"
                placeholder="Enter a call name"
                value={groupName}
                onChange={(e) => setGroupName(e.currentTarget.value)}
              />
            </FormField>
            <Button
              type="submit"
              primary
              label="Create a call"
              onClick={onSubmitNewGroup}
            />
          </>
        )}
      </Form>
    </Box>
  );
};
