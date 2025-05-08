import { BusinessCardResponse } from "@/models/response/BusinessCardResponse";
import { createSlice,  } from "@reduxjs/toolkit";


interface BusinessCardState {
  businessCards: BusinessCardResponse[];
}

const initialState: BusinessCardState = {
  businessCards: [],
};

const businessCardSlice = createSlice({
  name: "businessCard",
  initialState,
  reducers: {
    setBusinessCards(state, action) {
      state.businessCards = action.payload;
    },
  },
});

export const {setBusinessCards} = businessCardSlice.actions;
export default businessCardSlice.reducer;
