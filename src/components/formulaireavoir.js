import React, { Component } from "react";
import Axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { NavLink } from "react-router-dom";
import previous from "./Icones_Arigoni/previous.svg";

class FormulaireAvoirs extends Component {
  state = {
    targetavoir: [],
    avoirs: [],
    avoirsFiltered: [],
    avoirsSearch: "",
    loaded: false,
    num_avoir: "",
    date_avoir: "",
    montant_ht: "",
    montant_ttc: "",
    factureId: "",
    active: true
  };

  handleMyUserInputs = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = () => {
    confirmAlert({
      title: "Merci de confirmer",
      message: "Voulez-vous vraiment enregistrer cet avoir ?",
      buttons: [
        {
          label: "Oui",
          onClick: () =>
            Axios.post("/api/avoirs", this.state)
              .then(response => {
                this.props.pageChangeSub(
                  "EditAction",
                  0,
                  0,
                  this.props.actionId,
                  this.props.creancier,
                  this.props.debiteur
                );
                this.props.history.push("/dashboard/EditAction");
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

  handleSubmitChange = () => {
    const id = this.state.targetavoir[0].id;

    confirmAlert({
      title: "Merci de confirmer",
      message: "Voulez-vous vraiment modifier les informations de cet avoir ?",
      buttons: [
        {
          label: "Oui",
          onClick: () =>
            Axios.put(`/api/avoirs/${id}`, this.state)
              .then(response => {
                this.props.pageChangeSub(
                  "EditAction",
                  0,
                  0,
                  this.props.actionId,
                  this.props.creancier,
                  this.props.debiteur
                );
                this.props.history.push("/dashboard/EditAction");
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

  componentDidMount() {
    const avoirId = this.props.avoirId;
    const factureId = this.props.facture;
    Axios.get("/api/avoirs")
      .then(response => {
        this.setState({
          // returns target avoir
          targetavoir: response.data.filter(
            avoir => avoir.id === parseInt(avoirId)
          ),
          factureId: factureId,
          loaded: true
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    if (this.props.avoirId === undefined) {
      return (
        <div>
          <div className="ml4">
            <NavLink
              to="/dashboard/EditAction"
              onClick={() =>
                this.props.pageChangeSub(
                  "EditAction",
                  0,
                  0,
                  this.props.actionId,
                  this.props.creancier,
                  this.props.debiteur
                )
              }
            >
              <img className="previousbutton" src={previous} alt="previous" />
            </NavLink>

            {/* Formulaire */}
            <div className="fl w-100 tc">
              {" "}
              <h2 className="ml4">Nouvel avoir</h2>
              <article className="pa4 black-80">
                <form action="submit" method="post" acceptCharset="utf-8">
                  <fieldset className="ba b--transparent ph0 mh0 mh2">
                    <div className="mt3">
                      <label className="db fw4 lh-copy f6">N° avoir</label>
                      <input
                        className="pa2 input-reset ba bg-transparent w-100 measure"
                        name="num_avoir"
                        onChange={this.handleMyUserInputs}
                      />
                    </div>
                    <div className="mt3">
                      <label className="db fw4 lh-copy f6">Date avoir</label>
                      <input
                        className="pa2 input-reset ba bg-transparent w-100 measure"
                        name="date_avoir"
                        onChange={this.handleMyUserInputs}
                      />
                    </div>
                    <div className="mt3">
                      <label className="db fw4 lh-copy f6">Montant HT</label>
                      <input
                        className="pa2 input-reset ba bg-transparent w-100 measure"
                        name="montant_ht"
                        onChange={this.handleMyUserInputs}
                      />
                    </div>
                    <div className="mt3">
                      <label className="db fw4 lh-copy f6">Montant TTC</label>
                      <input
                        className="pa2 input-reset ba bg-transparent w-100 measure"
                        name="montant_ttc"
                        onChange={this.handleMyUserInputs}
                      />
                    </div>
                  </fieldset>
                </form>
              </article>
              {/* Bouton sauvegarder */}
              <div className="buttonsauvegarder tc pt1 ml4">
                <a
                  className="f6 link dim br1 ph3 pv2 mt2 mb4 dib white bg-dark-blue "
                  href="#0"
                  onClick={this.handleSubmit}
                >
                  Sauvegarder
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.state.loaded === true && this.props.avoirId !== undefined) {
      return (
        <div>
          <div className="ml4">
            <NavLink
              to="/dashboard/EditAction"
              onClick={() =>
                this.props.pageChangeSub(
                  "EditAction",
                  0,
                  0,
                  this.props.actionId,
                  this.props.creancier,
                  this.props.debiteur
                )
              }
            >
              <img className="previousbutton" src={previous} alt="previous" />
            </NavLink>

            {/* Formulaire */}
            <div className="fl w-100 tc">
              {" "}
              <h2 className="ml4">Modifier les informations d'un avoir</h2>
              <article className="pa4 black-80">
                <form action="submit" method="post" acceptCharset="utf-8">
                  <fieldset className="ba b--transparent ph0 mh0 mh2">
                    <div className="mt3">
                      <label className="db fw4 lh-copy f6">N° avoir</label>
                      <input
                        className="pa2 input-reset ba bg-transparent w-100 measure"
                        name="num_avoir"
                        onChange={this.handleMyUserInputs}
                        value={
                          this.state.num_avoir ||
                          this.state.targetavoir[0].num_avoir
                        }
                      />
                    </div>
                    <div className="mt3">
                      <label className="db fw4 lh-copy f6">Date avoir</label>
                      <input
                        className="pa2 input-reset ba bg-transparent w-100 measure"
                        name="date_avoir"
                        onChange={this.handleMyUserInputs}
                        value={
                          this.state.date_avoir ||
                          this.state.targetavoir[0].date_avoir
                        }
                      />
                    </div>
                    <div className="mt3">
                      <label className="db fw4 lh-copy f6">Montant HT</label>
                      <input
                        className="pa2 input-reset ba bg-transparent w-100 measure"
                        name="montant_ht"
                        onChange={this.handleMyUserInputs}
                        value={
                          this.state.montant_ht ||
                          this.state.targetavoir[0].montant_ht
                        }
                      />
                    </div>
                    <div className="mt3">
                      <label className="db fw4 lh-copy f6">Montant TTC</label>
                      <input
                        className="pa2 input-reset ba bg-transparent w-100 measure"
                        name="montant_ttc"
                        onChange={this.handleMyUserInputs}
                        value={
                          this.state.montant_ttc ||
                          this.state.targetavoir[0].montant_ttc
                        }
                      />
                    </div>
                  </fieldset>
                </form>
              </article>
              {/* Bouton sauvegarder */}
              <div className="buttonsauvegarder tc pt1 ml4">
                <a
                  className="f6 link dim br1 ph3 pv2 mt2 mb4 dib white bg-dark-blue "
                  href="#0"
                  onClick={this.handleSubmitChange}
                >
                  Sauvegarder
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    } else return null;
  }
}

export default FormulaireAvoirs;
