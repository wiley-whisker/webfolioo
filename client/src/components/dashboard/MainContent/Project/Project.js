import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getProject,
  deleteProject,
  updatePicture
} from "../../../../actions/projectsActions";
import { Spinner } from "react-bootstrap";
import Picture from "../../Picture";
class Project extends Component {
  state = {
    selectedFile: null,
    picture: "",
    modal: false
  };
  componentDidMount() {
    this.props.getProject(this.props.match.params.project);
  }
  deleteProject = id => {
    this.props.deleteProject(id, this.props.history);
  };
  createPicture = () => {
    const fd = new FormData();
    fd.append(
      "photolink",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
    fd.append("_id", this.props.match.params.project);
    fd.append("email", this.props.auth.user.email);
    this.props.updatePicture(fd, this.props.history);
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.match.params.project !== prevProps.match.params.project) {
      this.props.getProject(this.props.match.params.project);
    }
    if (this.state.selectedFile !== prevState.selectedFile) {
      this.createPicture();
    }
  }

  fileSelectedHandler = e => {
    this.setState({ selectedFile: e.target.files[0] });
  };
  toggleEditModal = (link, e) => {
    e.stopPropagation();
    this.setState({ picture: link, modal: !this.state.modal });
  };
  callbackFunction = childData => {
    this.setState({ modal: childData });
  };

  render() {
    /*
    if modal show picture 
    */
    const { project } = this.props;
    let load;

    if (this.state.modal) {
      return (
        <Picture
          picture={this.state.picture}
          projectname={project.name}
          url={this.props.match.url}
          parentCallback={this.callbackFunction}
          id={this.props.match.params.project}
        />
      );
    }

    if (this.props.pictureLoading) {
      load = (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      );
    } else {
      load = <div></div>;
    }
    let pictures;

    if (project.link !== undefined) {
      pictures = (
        <div>
          {project.link.map((element, index) => (
            <img
              key={index}
              alt="pictures"
              src={element}
              style={{ height: "100px", width: "100px", paddingRight: "10px" }}
              onClick={this.toggleEditModal.bind(this, element)}
            />
          ))}
        </div>
      );
    }

    return (
      <div>
        <button onClick={() => this.props.history.push("/dashboard")}>
          {"<"}
        </button>
        <button
          onClick={() =>
            this.state.picture.length > 0
              ? this.setState({ modal: !this.state.modal })
              : null
          }
        >
          {">"}
        </button>
        <br />
        <h1>
          Project &nbsp;
          {project.name}
        </h1>
        <br />
        {pictures}
        <br />
        <input type="file" onChange={this.fileSelectedHandler} />
        <br />
        {load}
        <br />
        <button
          onClick={this.deleteProject.bind(
            this,
            this.props.match.params.project
          )}
        >
          delete {project.name}?
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  project: state.projects.project,
  pictureLoading: state.projects.pictureLoading
});

export default connect(mapStateToProps, {
  getProject,
  deleteProject,
  updatePicture
})(Project);
