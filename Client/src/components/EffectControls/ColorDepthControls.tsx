import { Box, FormField, RangeInput } from "grommet";
import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEffect } from "../../reducers/effectSlice";
import { getEffect } from "../../selectors/effectSelector";

const ColorDepthControls = () => {
  const dispatch = useDispatch();
  const maxBits = 32;
  const currentColorDepth = useSelector(getEffect("colorDepth"));

  const updateBits = (event: ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(event.target.value, 10);
    if (!isNaN(amount)) {
      dispatch(
        updateEffect({
          key: "colorDepth",
          value: {
            ...currentColorDepth,
            bits: amount,
          },
        })
      );
    }
  };

  return (
    <Box direction="row">
      <FormField
        label="Color Depth"
        margin={{
          right: "small",
        }}
      >
        <RangeInput
          value={currentColorDepth.bits}
          max={maxBits}
          onChange={updateBits}
        />
      </FormField>
    </Box>
  );
};

export default ColorDepthControls;
