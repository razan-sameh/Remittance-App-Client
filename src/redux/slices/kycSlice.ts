// src/redux/slices/kycSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const kycSlice = createSlice({
    name: 'kyc',
    initialState: {
        data: null,
    },
    reducers: {
        setKycData: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const { setKycData } = kycSlice.actions;
export default kycSlice.reducer;
