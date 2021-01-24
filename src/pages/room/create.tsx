import React from "react";
import AddPlayerInput from "../../components/AddPlayerInput";
import { connect } from "react-redux";
const Create = () => (
  <div>
    <AddPlayerInput btnText="Create room" />
  </div>
);

export default connect(null, null)(Create);
