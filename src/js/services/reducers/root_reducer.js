import { combineReducers } from "redux";
import imageReducer from "./image_reducer";
import colorReducer from "./color_reducer";

const rootReducer = combineReducers({
  color: colorReducer,
  image: imageReducer
});

export default rootReducer;