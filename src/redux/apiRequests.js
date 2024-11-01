import { update } from "./chatUserSlice";
import axios from "axios";

export const updateCHatUser = async (dispatch) => {   
    dispatch(update());
}

