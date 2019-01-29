import React, { Component } from "react";
import Axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { NavLink } from "react-router-dom";
import previous from "./Icones_Arigoni/previous.svg";

class Formulairepartiel extends Component {
  state = {
    targetpartiel: [],
    partiel: [],
    partielFiltered: [],
    partielSearch: "",
    loaded: false,
    num_partiel: "",
    date_partiel: "",
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
      message: "Voulez-vous vraiment enregistrer ce paiement partiel ?",
      buttons: [
        {
          label: "Oui",
          onClick: () =>
            Axios.post(`${REACT_APP_API}/api/partiels`, this.state)
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
    const id = this.state.targetpartiel[0].id;

    confirmAlert({
      title: "Merci de confirmer",
      message:
        "Voulez-vous vraiment modifier les informations de ce paiement partiel ?",
      buttons: [
        {
          label: "Oui",
          onClick: () =>
            Axios.put(`${REACT_APP_API}/api/partiels/${id}`, this.state)
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
    const partielId = this.props.partielId;
    const factureId = this.props.facture;
    Axios.get(`${REACT_APP_API}/api/partiels`)
      .then(response => {
        this.setState({
          // returns target partiel
          targetpartiel: response.data.filter(
            partiel => partiel.id === parseInt(partielId)
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
    if (this.props.partielId === undefined) {
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
              <h2 className="ml3">Nouveau paiement partiel</h2>
              <article className="pa4 black-80">
                <form action="submit" method="post" acceptCharset="utf-8">
                  <fieldset className="ba b--transparent ph0 mh0 mh2">
                    <div className="mt3">
                      <label className="db fw4 lh-copy f6">
                        N° paiement partiel
                      </label>
                      <input
                        className="pa2 input-reset ba bg-transparent w-100 measure"
                        name="num_partiel"
                        onChange={this.handleMyUserInputs}
                      />
                    </div>
                    <div className="mt3">
                      <label className="db fw4 lh-copy f6">
                        Date paiement partiel
                      </label>
                      <input
                        className="pa2 input-reset ba bg-transparent w-100 measure"
                        name="date_partiel"
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
    } else if (
      this.state.loaded === true &&
      this.props.partielId !== undefined
    ) {
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
              <h2 className="ml3">
                Modifier les informations d'un paiement partiel
              </h2>
              <article className="pa4 black-80">
                <form action="submit" method="post" acceptCharset="utf-8">
                  <fieldset className="ba b--transparent ph0 mh0 mh2">
                    <div className="mt3">
                      <label className="db fw4 lh-copy f6">
                        N° paiement partiel
                      </label>
                      <input
                        className="pa2 input-reset ba bg-transparent w-100 measure"
                        name="num_partiel"
                        onChange={this.handleMyUserInputs}
                        value={
                          this.state.num_partiel ||
                          this.state.targetpartiel[0].num_partiel
                        }
                      />
                    </div>
                    <div className="mt3">
                      <label className="db fw4 lh-copy f6">
                        Date paiement partiel
                      </label>
                      <input
                        className="pa2 input-reset ba bg-transparent w-100 measure"
                        name="date_partiel"
                        onChange={this.handleMyUserInputs}
                        value={
                          this.state.date_partiel ||
                          this.state.targetpartiel[0].date_partiel
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
                          this.state.targetpartiel[0].montant_ht
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
                          this.state.targetpartiel[0].montant_ttc
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

export default Formulairepartiel;
