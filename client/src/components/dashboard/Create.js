import React, { Component } from "react";
//import axios from "axios";

import { createProject } from "../../actions/projectsActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class Create extends Component {
  state = {
    //selectedFile: null,
    projectName: ""
  };
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  fileSelectedHandler = e => {
    this.setState({ selectedFile: e.target.files[0] });
  };

  onSelectChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  createProject = () => {
    let project = {
      projectName: this.state.projectName
    };

    // const fd = new FormData();
    // fd.append(
    //   "photolink",
    //   this.state.selectedFile,
    //   this.state.selectedFile.name
    // );
    // fd.append("projectName", this.state.projectName);

    this.props.createProject(project);

    //axios.post("/api/projects/createpicture", fd);
    // <input type="file" onChange={this.fileSelectedHandler} />
    this.props.history.push("/dashboard");
  };
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
    this.setState({
      projectName: ""
    });
  };
  //this.toggle.modal
  render() {
    return (
      <div>
        <label>
          <div className="form-label">Project Name (required)</div>
          <input
            onChange={this.onChange}
            value={this.state.projectName}
            id="projectName"
            type="text"
            placeholder="My Awesome Project"
            className="form-input"
          />
        </label>

        <button
          className="main-btn create-project"
          onClick={this.createProject}
        >
          Create Project
        </button>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth,
  projects: state.projects
});

export default connect(mapStateToProps, {
  createProject
})(withRouter(Create));
