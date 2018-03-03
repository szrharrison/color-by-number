import { combineReducers } from "redux";
import imageReducer from "./image_reducer";

const rootReducer = combineReducers({
  image: imageReducer
});

export default rootReducer;