import React from "react";
import { connect } from "react-redux";
import { Icon, Menu, Segment, Sidebar } from "semantic-ui-react";
import Viewer from "./viewer";
import ImageUploader from "./image_uploader";

function UnconnectedImageEditor(props) {
  return <Sidebar.Pushable as={ Segment }>
    <Sidebar
      as={ Menu }
      animation='overlay'
      width='thin'
      direction='right'
      visible={ true }
      icon='labeled'
      vertical
      inverted
    >
      <Menu.Item name='home'>
        <Icon name="upload"/>
        <ImageUploader/>
      </Menu.Item>
    </Sidebar>
    <Sidebar.Pusher>
      <Segment basic inverted>
        <Viewer/>
      </Segment>
    </Sidebar.Pusher>
  </Sidebar.Pushable>;
}

const ImageEditor = connect()(UnconnectedImageEditor);
export default ImageEditor;