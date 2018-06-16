import React from "react";
import { connect } from "react-redux";
import { Segment } from "semantic-ui-react";
import Viewer from "./viewer";
import OptionsMenu from "./options_menu";

function Main(props) {
  return <div>
    <Segment basic inverted attached>
      <Viewer/>
    </Segment>
    <OptionsMenu/>
  </div>;
}

export default connect()(Main);