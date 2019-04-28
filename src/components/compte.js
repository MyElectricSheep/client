import React, { Component } from "react";
import "./compte.css";
import modifier from "./Icones_Arigoni/icone_modifier.png";
import Axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { NavLink } from "react-router-dom";
import entete from "./images/entete.png";

class Compte extends Component {
  state = {
    data: [],
    titre: "",
    nom: "",
    prenom: "",
    num_rue: "",
    libelle_rue: "",
    code_postal: "",
    ville: "",
    tel: "",
    fax: "",
    mail: "",
    num_TVA: "",
    file: ""
  };

  onFormSubmitSignature = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("signature", this.state.file);
    console.log(formData);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    Axios.post("/dashboard/signature", formData, config)
      .then(response => {
        alert("Le fichier a été téléchargé avec succès");
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  onFormSubmitEntete = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("entete", this.state.file);
    console.log(formData);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    Axios.post("/dashboard/", formData, config)
      .then(response => {
        alert("Le fichier a été téléchargé avec succès");
      })
      .catch(error => {
        console.log(error);
      });
  };

  onChange = e => {
    this.setState({ file: e.target.files[0] });
  };

  reloadNow = () => {
    Axios.get(`${process.env.REACT_APP_API}/api/cabinet`)
      .then(response => {
        this.setState({
          data: response.data[0]
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleChange = id => {
    const myId = id;
    confirmAlert({
      title: "Merci de confirmer",
      message:
        "Voulez-vous vraiment modifier les informations de votre cabinet d'avocat ?",
      buttons: [
        {
          label: "Oui",
          onClick: () =>
            Axios.put(
              `${process.env.REACT_APP_API}/api/cabinet/${myId}`,
              this.state
            )
              .then(response => {
                this.reloadNow(myId);
                alert(`Vos informations ont bien été modifiées.`);
                console.log(response);
              })
              .catch(error => {
                console.log(error);
              })
        },
        {
          label: "Non"
        }
      ]
    });
  };

  handleMyUserInputs = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  componentDidMount() {
    Axios.get(`${process.env.REACT_APP_API}/api/cabinet`)
      .then(response => {
        this.setState({
          data: response.data[0]
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const infosCompte = this.state.data;
    return (
      <div className="fl w-100 pt3">
        <div className="fl w-100 pt3 stylish-cab mt4">
          <div className="tc">
            <span className="f1 b title-seysey">Cabinet {infosCompte.nom}</span>
          </div>
          <div className="ba br4 mt5 w-50-ns b--gray firstBorder size-think">
            <h2 className="title-firstBorder">
              {" "}
              Informations de mon cabinet :{" "}
            </h2>
            <ul className="b black moveInfoRight">
              <li className="b black">
                {infosCompte.titre} {infosCompte.nom} {infosCompte.prenom}
              </li>

              <li className="b black">
                {infosCompte.num_rue} {infosCompte.libelle_rue}{" "}
                {infosCompte.code_postal} {infosCompte.ville}
              </li>

              <li className="b black">Tel: {infosCompte.tel}</li>
              <li className="b black">Fax: {infosCompte.fax}</li>
              <li className="b black">Email: {infosCompte.mail}</li>
              <li className="b black">Nº TVA: {infosCompte.num_TVA}</li>
            </ul>
            <div className="tc">
              <NavLink
                to="/dashboard/formulairecompte"
                onClick={() => this.props.pageChangeSub("formulairecompte")}
              >
                <img
                  className="icone pointer mt2 ml2 mb2"
                  src={modifier}
                  alt="modifier"
                />
              </NavLink>
            </div>
          </div>

          <div className="ba br4 mt5 w-50-ns nested-copy-line-height tc pb2 h4 b--gray otherBorder">
            <p className="b black tl ml4">
              {" "}
              En-tête: <br />{" "}
              <img className="w-40 entete" src={entete} alt="entete" />
            </p>{" "}
          </div>
        </div>
      </div>
    );
  }
}

export default Compte;
