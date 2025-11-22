import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FolderState {
  selectedFolderID: null|string
}

const initialState: FolderState = {
  selectedFolderID: null
};

const folderSlice = createSlice({
  name: 'auth',
  initialState:initialState,
  reducers: {
    setSelectedFolderID:(state, action: PayloadAction<string|null>) => {
        state.selectedFolderID = action.payload
    }
  },
});

export const { setSelectedFolderID } = folderSlice.actions;
export default folderSlice.reducer;