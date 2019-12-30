import React, { Component } from "react";
import { connect } from "react-redux";
import Create from "../Create";
import LazyLoad from "react-lazyload";
import { logoutUser } from "../../../actions/authActions";

class Dashboard extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser(this.props.history);
    window.location.href = "/";
  };
  render() {
    const { projects } = this.props.projects;
    //console.log(this.props.projects);
    let content;
    let projectData = projects.map(project => (
      <div
        key={project._id}
        className="project-icon"
        onClick={() => this.props.history.push(`/projects/${project._id}`)}
        style={{
          postion: "relative",
          width: "fit-content",
          cursor: "pointer",
          height: "fit-content"
        }}
      >
        <div
          className="project-name"
          style={{ width: "fit-content", height: "fit-content" }}
        >
          {project.name}
          <br />
          {project.link.map((l, index) =>
            index === 0 && l !== undefined ? (
              <LazyLoad key={index} once>
                <img
                  alt="frontpic"
                  src={l}
                  key={index}
                  style={{ height: "100px", width: "100px" }}
                />
              </LazyLoad>
            ) : null
          )}
          <br />
          <button>add picture?</button>
        </div>

        <br />
      </div>
    ));
    if (projects.length > 0) {
      content = (
        <>
          <div className="modal-wrapper" style={{ display: "none" }}>
            <Create />
          </div>

          <div className="projects-wrapper">{projectData}</div>
          <button onClick={() => this.props.history.push("/create")}>
            create another project?
          </button>
          <br />
        </>
      );
    } else {
      content = (
        <>
          <div className="projects">
            <div className="no-projects">
              <h1 className="header">You have no projects</h1>

              <div className="modal-wrapper" style={{ display: "none" }}>
                <Create />
              </div>

              <button onClick={() => this.props.history.push("/create")}>
                create a project?
              </button>
            </div>
          </div>
        </>
      );
    }
    //{content}
    return (
      <div>
        <h1>All projects</h1>
        {content}
        <br />
        <button onClick={this.onLogoutClick}>Logout</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  projects: state.projects
});

export default connect(mapStateToProps, { logoutUser })(Dashboard);
