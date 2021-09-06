import { useState, useContext } from "react";
import {
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
import { updateUsername } from "../reducers/userSlice";
import { SignalContext } from "../services/SignalService";

enum CallOpt {
  Existing = "Join an existing call",
  New = "Create new call",
}

export const LandingPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const signalService = useContext(SignalContext);
  const [username, setUsername] = useState<string>("");
  const [callSetting, setCallSetting] = useState<CallOpt>(CallOpt.New);
  const onSubmit = () => {
    dispatch(updateUsername(username));
    signalService.SendConnection();
    history.push(Routes.CallPage);
  };
  return (
    <Form onSubmit={onSubmit}>
      <Heading>echo</Heading>
      <FormField name="name" htmlFor="name-input" label="Name">
        <TextInput
          id="name-input"
          name="name"
          placeholder="Enter a username"
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
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
            />
          </FormField>
          <Button type="submit" primary label="Join call" onClick={onSubmit} />
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
            />
          </FormField>
          <Button
            type="submit"
            primary
            label="Create a call"
            onClick={onSubmit}
          />
        </>
      )}
    </Form>
  );
};
