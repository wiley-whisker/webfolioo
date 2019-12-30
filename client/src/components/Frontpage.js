//Pictures
import mern from "./frontpic/Mern.jpg";
import lamp from "./frontpic/lamp.jpg";
import mean from "./frontpic/mean.jpg";

//react things
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Frontpage.scss";
import { broadcast } from "../actions/projectsActions";
import { connect } from "react-redux";

class Frontpage extends Component {
  render() {
    let lovedusers;

    // <img
    //             style={{ height: "300px", width: "300px", padding: "10px" }}
    //             key={index}
    //             src={element.link[0]}
    //             alt="famousppl"
    //           />
    if (this.props.famous.length > 0) {
      console.log(this.props.famous);
      lovedusers = (
        <div className="flex-container">
          {this.props.famous.map((element, index) => (
            <div key={index}>
              <div className="username">{element.name} </div>

              {element.link.length > 0 ? (
                <img src={element.link[0]} alt="users" />
              ) : null}

              <div className="project"> {element.projectname}</div>
              <div className="likes"> {element.likes} likes </div>
              <div className="heart"> ♡</div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="body">
        <div className="header__container">
          <h1 className="header__logo">Webfolio</h1>
          <div className="header__nav">
            <ul>
              <li>Discover</li>
              <li>Live</li>
              <li>Create</li>
              <li>Design</li>
            </ul>
          </div>
          <div className="header__log">
            <Link to="/login" className="link">
              Login
            </Link>
            <br />
            <Link to="/register" className="link">
              Sign up
            </Link>
          </div>
        </div>
        <hr />
        <div className="stacktitle">Master A Stack</div>
        <div className="button-images">
          <div className="one_fourth">
            <div className="button-container">
              <a href="/"> </a>
              <img alt="alamp" src={lamp} />
            </div>
          </div>
          <div className="one_fourth">
            <div className="button-container">
              <a href="/"> </a>
              <img alt="mern" src={mern} />
            </div>
          </div>
          <div className="one_fourth">
            <div className="button-container">
              <a href="/"> </a>
              <div className="button-image">
                {" "}
                <img alt="mean" src={mean} />
              </div>
            </div>
          </div>
          <div className="one_fourth last">
            <div className="button-container">
              <a href="/"> </a>
              <img alt="lamp" src={lamp} />
            </div>
          </div>
        </div>

        <div className="broadcast">
          <div className="broadcast__title">best of Webfolio</div>
          <div className="users">{lovedusers}</div>
        </div>
      </div>
    );
  }
}
// <div className="users">{lovedusers}</div>
const mapStateToProps = state => ({
  auth: state.auth,
  popularusers: state.projects.broadcast
});
//export default Frontpage;
export default connect(mapStateToProps, { broadcast })(Frontpage);
