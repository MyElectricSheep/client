import React from "react";
import "./LoginPage.css";
import contract from "./images/contract.jpg";
import { NavLink } from "react-router-dom";
import Axios from "axios";

class LoginPage extends React.Component {
  state = {
    userLog: "",
    userMdp: "",
    log: "",
    mdp: ""
  };

  handleMyUserInputs = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  componentDidMount() {
    Axios.get(`${REACT_APP_API}/api/cabinet/`)
      .then(response => {
        this.setState({
          log: response.data[0].login,
          mdp: response.data[0].password
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  fakeLogin = (log, mdp) => {
    if (log === this.state.log && mdp === this.state.mdp) {
      // this.props.pageChangeSub("moncompte");
      this.props.history.push("/dashboard/moncompte");
    } else {
      alert("Connexion refusée. Le mot de passe est invalide!");
    }
  };

  render() {
    return (
      <div>
        <img className="contract" src={contract} alt="home page" />
        <div>
          <h1 className="tc mt4 athelas navy f1"> Alexandra ARIGONI </h1>
          <h2 className="tc nt3 athelas navy f2"> AVOCAT </h2>
        </div>

        <div className="fl w-100 mt3 tc">
          <input
            className="w-20 mr3 f6"
            type="text"
            placeholder="Identifiant"
            name="userLog"
            onChange={this.handleMyUserInputs}
          />
          <input
            className="w-20 f6"
            type="password"
            placeholder="Mot de passe"
            name="userMdp"
            onChange={this.handleMyUserInputs}
          />
        </div>

        <div className="fl w-60 pa2 nt1" />
        <div className="fl w-40 pa2 nt1">
          {/* <p className="pointer f6"> Mot de passe oublié? </p> */}
        </div>

        <div className="fl w-100 tc pt3">
          {/* <NavLink to="/dashboard/moncompte"> */}
          <span
            className="f6 link dim br1 ph3 pv2 mt2 mb4 dib white bg-dark-blue"
            href="#0"
            onClick={() =>
              this.fakeLogin(this.state.userLog, this.state.userMdp)
            }
          >
            {" "}
            Se connecter{" "}
          </span>
          {/* </NavLink> */}
        </div>
      </div>
    );
  }
}

export default LoginPage;
