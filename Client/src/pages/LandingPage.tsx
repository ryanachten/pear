import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Form, FormField, Heading, TextInput } from "grommet";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Routes } from "../constants/routes";
import { updateUserName } from "../reducers/userSlice";
import { SignalContext } from "../services/SignalService";
import { useSelector } from "react-redux";
import { getPeerGroup } from "../selectors/peerSelectors";
import Background from "../components/Background";

export const LandingPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const signalService = useContext(SignalContext);
  const group = useSelector(getPeerGroup);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [userName, setUserName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");

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

  const JoinCallFields = (
    <Box>
      <Heading size="small">Join call</Heading>
      <FormField name="call-code" htmlFor="call-code-input" label="Call code">
        <TextInput
          id="call-code"
          name="Call code"
          placeholder="Enter an existing call code"
          value={groupCode}
          onChange={(e) => setGroupCode(e.currentTarget.value)}
        />
      </FormField>
    </Box>
  );

  const CreateCallFields = (
    <Box>
      <Heading size="small">Create call</Heading>
      <FormField
        name="call name"
        htmlFor="call-name-input"
        label="Call name"
        margin={{
          right: groupCode ? "none" : "xlarge",
        }}
      >
        <TextInput
          id="call-name-input"
          name="Call name"
          placeholder="Enter a call name"
          value={groupName}
          onChange={(e) => setGroupName(e.currentTarget.value)}
        />
      </FormField>
    </Box>
  );

  const showSubmitButton = userName && (groupName || groupCode);

  return (
    <Background align="center" justify="center">
      <Form>
        <Heading
          textAlign="center"
          margin={{
            top: "none",
            bottom: "large",
          }}
        >
          echo
        </Heading>
        <Box
          direction="row"
          border="bottom"
          pad={{
            horizontal: "large",
            bottom: "large",
          }}
        >
          <FormField name="name" htmlFor="name-input" label="Display name">
            <TextInput
              id="name-input"
              name="name"
              placeholder="Enter a username"
              value={userName}
              onChange={(e) => setUserName(e.currentTarget.value)}
            />
          </FormField>
        </Box>
        <Box
          direction="row"
          border={showSubmitButton ? "bottom" : false}
          pad={{
            horizontal: "large",
            vertical: "large",
          }}
          margin={{
            bottom: "large",
          }}
        >
          {!groupCode && CreateCallFields}
          {!groupName && JoinCallFields}
        </Box>
        {showSubmitButton && (
          <Box direction="row" justify="center">
            {groupCode && (
              <Button
                type="submit"
                primary
                label="Join call"
                onClick={onSubmitExistingGroup}
              />
            )}
            {groupName && (
              <Button
                type="submit"
                primary
                label="Create a call"
                onClick={onSubmitNewGroup}
              />
            )}
          </Box>
        )}
      </Form>
    </Background>
  );
};
