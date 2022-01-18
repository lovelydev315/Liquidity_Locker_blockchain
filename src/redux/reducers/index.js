import { combineReducers } from "redux";
import config from "./config";
import { STATISTICS, CHANGE_WALLET } from "../constants";

export function statistics(state = {}, action) {
    switch (action.type) {
        case STATISTICS:
            return action.payload
        default:
            return state
    }
}

export function walletAddress(state = '', action) {
    switch (action.type) {
        case CHANGE_WALLET:
            return {
                address: action.payload
            }
        default:
            return state
    }

    // return state;
}

const rootReducer = combineReducers({
    config,
    statistics,
    walletAddress
});
export default rootReducer;
