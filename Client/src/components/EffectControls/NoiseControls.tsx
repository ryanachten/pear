import { Box, FormField, RangeInput } from "grommet";
import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEffect } from "../../reducers/effectSlice";
import { getEffect } from "../../selectors/effectSelector";

const NoiseControls = () => {
  const dispatch = useDispatch();
  const maxNoise = 200;
  const currentNoise = useSelector(getEffect("noise"));

  const updateNoiseOpacity = (event: ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(event.target.value, 10);
    if (!isNaN(amount)) {
      dispatch(
        updateEffect({
          key: "noise",
          value: {
            ...currentNoise,
            opacity: amount / 100,
          },
        })
      );
    }
  };

  return (
    <Box direction="row">
      <FormField
        label="Noise"
        margin={{
          right: "small",
        }}
      >
        <RangeInput
          value={currentNoise.opacity * 100}
          max={maxNoise}
          onChange={updateNoiseOpacity}
        />
      </FormField>
    </Box>
  );
};

export default NoiseControls;
