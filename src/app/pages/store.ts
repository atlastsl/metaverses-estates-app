// @ts-nocheck
import { createStore } from "redux";

const initialState = {
    sidebarShow: true,
    sidebarUnfoldable: false,
    userRowsPerPage: 0,
    assetRowsPerPage: 0,
    assetMetadataListRowsPerPage: 0,
    operationsRowsPerPage: 0,
}

const changeState = (state: Partial<Partial<typeof initialState>> = initialState, { type, ...rest }) => {
    switch (type) {
        case 'set':
            return { ...state, ...rest };
        default:
            return state;
    }
}

const store = createStore(changeState);
export default store