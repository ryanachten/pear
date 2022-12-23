import { Box, FormField, RangeInput } from "grommet";
import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateEffect } from "../../reducers/effectSlice";
import { getEffect } from "../../selectors/effectSelector";

const PixelationControls = () => {
  const dispatch = useDispatch();
  const maxPixelation = 10;
  const currentPixelation = useSelector(getEffect("pixelation"));

  const updatePixelation = (event: ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(event.target.value, 10);
    if (!isNaN(amount)) {
      dispatch(
        updateEffect({
          key: "pixelation",
          value: {
            ...currentPixelation,
            granularity: amount,
          },
        })
      );
    }
  };

  return (
    <Box direction="row">
      <FormField
        label="Pixelation"
        margin={{
          right: "small",
        }}
      >
        <RangeInput
          value={currentPixelation.granularity}
          max={maxPixelation}
          onChange={updatePixelation}
        />
      </FormField>
    </Box>
  );
};

export default PixelationControls;
