import { Box, FormField, RangeInput } from "grommet";
import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEffect } from "../../reducers/effectSlice";
import { getEffect } from "../../selectors/effectSelector";

const BloomControls = () => {
  const dispatch = useDispatch();
  const maxIntensity = 10;
  const currentBloom = useSelector(getEffect("bloom"));

  const updateBits = (event: ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(event.target.value, 10);
    if (!isNaN(amount)) {
      dispatch(
        updateEffect({
          key: "bloom",
          value: {
            ...currentBloom,
            intensity: amount,
          },
        })
      );
    }
  };

  return (
    <Box direction="row">
      <FormField
        label="Bloom"
        margin={{
          right: "small",
        }}
      >
        <RangeInput
          value={currentBloom.intensity}
          max={maxIntensity}
          onChange={updateBits}
        />
      </FormField>
    </Box>
  );
};

export default BloomControls;
