import React, { Component } from "react";
import "./formulairecreancier.css";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { NavLink } from "react-router-dom";
import previous from "./Icones_Arigoni/previous.svg";

class Formulairedebiteur extends Component {
  state = {
    targetDebiteur: [],
    loaded: false,
    denomination_sociale: "",
    forme_juridique: "",
    nationalite_societe: "",
    adresse_siege: "",
    code_postal_siege: "",
    ville_siege: "",
    pays_siege: "",
    ville_rcs: "",
    num_rcs: "",
    nom: "",
    prenom: "",
    civilite: "M.",
    fonction: "",
    active: true
  };

  handleMyUserInputs = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleCivilite = e => {
    this.setState({
      civilite: e.target.value
    });
  };

  handleSubmit = () => {
    confirmAlert({
      title: "Merci de confirmer",
      message: "Voulez-vous vraiment enregistrer ce nouveau débiteur ?",
      buttons: [
        {
          label: "Oui",
          onClick: () =>
            axios
              .post(`${process.env.REACT_APP_API}/api/debiteurs`, this.state)
              .then(response => {
                this.props.pageChangeSub("Debiteurs");
                this.props.history.push("/dashboard/debiteurs");
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
    const id = this.state.targetDebiteur[0].id;

    confirmAlert({
      title: "Merci de confirmer",
      message:
        "Voulez-vous vraiment modifier les informations de ce débiteur ?",
      buttons: [
        {
          label: "Oui",
          onClick: () =>
            axios
              .put(`${process.env.REACT_APP_API}/api/debiteurs/${id}`, this.state)
              .then(response => {
                this.props.pageChangeSub("Debiteurs");
                this.props.history.push("/dashboard/debiteurs");
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

  handleMyCivilChange() {
    if (this.state.targetDebiteur[0].civilite === "M.") {
      return (
        <React.Fragment>
          <option value="M.">Monsieur</option>
          <option value="Mme">Madame</option>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <option value="Mme">Madame</option>
          <option value="M.">Monsieur</option>
        </React.Fragment>
      );
    }
  }

  componentDidMount() {
    const debiteurId = this.props.debiteurId;
    axios
      .get(`${process.env.REACT_APP_API}/api/debiteurs`)
      .then(response => {
        this.setState({
          // returns target debiteur
          targetDebiteur: response.data.filter(
            debiteur => debiteur.id === parseInt(debiteurId)
          ),
          loaded: true
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    if (this.props.debiteurId === undefined) {
      return (
        <div>
          <div className="title_créancier pl4">
            <NavLink
              to="/dashboard/debiteurs"
              onClick={() => this.props.pageChangeSub("Debiteurs")}
            >
              <img className="previousbutton" src={previous} alt="previous" />
            </NavLink>
            <h1 className="titre1">Créer un nouveau débiteur</h1>
            <h2 className="compagnietitre">
              Compagnie {this.state.denomination_sociale}
            </h2>
          </div>

          {/* Formulaire */}
          <div className="fl w-50">
            <article className="pa4 black-80">
              <form action="submit" method="post" acceptCharset="utf-8">
                <fieldset className="ba b--transparent ph0 mh0 mh2">
                  <div className="mt3">
                    <label className="db fw4 lh-copy f6">
                      Dénomination sociale
                    </label>
                    <input
                      className="pa2 input-reset ba bg-transparent w-100 measure"
                      name="denomination_sociale"
                      onChange={this.handleMyUserInputs}
                    />
                  </div>
                  <div className="mt3">
                    <label className="db fw4 lh-copy f6">Forme juridique</label>
                    <input
                      className="pa2 input-reset ba bg-transparent w-100 measure"
                      name="forme_juridique"
                      onChange={this.handleMyUserInputs}
                    />
                  </div>
                  <div className="mt3">
                    <label className="db fw4 lh-copy f6">
                      Nationalité de la société
                    </label>
                    <input
                      className="pa2 input-reset ba bg-transparent w-100 measure"
                      name="nationalite_societe"
                      onChange={this.handleMyUserInputs}
                    />
                  </div>
                  <div className="mt3">
                    <label className="db fw4 lh-copy f6">
                      Adresse du siège social
                    </label>
                    <input
                      className="pa2 input-reset ba bg-transparent w-100 measure"
                      name="adresse_siege"
                      onChange={this.handleMyUserInputs}
                    />
                  </div>
                  <div className="mt3">
                    <label className="db fw4 lh-copy f6">
                      Code postal du siège social
                    </label>
                    <input
                      className="pa2 input-reset ba bg-transparent w-100 measure"
                      name="code_postal_siege"
                      onChange={this.handleMyUserInputs}
                    />
                  </div>
                  <div className="mt3">
                    <label className="db fw4 lh-copy f6">
                      Ville du siège social
                    </label>
                    <input
                      className="pa2 input-reset ba bg-transparent w-100 measure"
                      name="ville_siege"
                      onChange={this.handleMyUserInputs}
                    />
                    <div className="mt3">
                      <label className="db fw4 lh-copy f6">
                        Pays du siège social
                      </label>
                      <input
                        className="pa2 input-reset ba bg-transparent w-100 measure"
                        name="pays_siege"
                        onChange={this.handleMyUserInputs}
                      />
                    </div>
                  </div>
                </fieldset>
              </form>
            </article>
          </div>
          <div className="fl w-50 ">
            <article className="pa4 black-80">
              <fieldset id="submit" className="ba b--transparent ph0 mh0 ">
                <div className="mt3">
                  <label className="db fw4 lh-copy f6">Ville du RCS</label>
                  <input
                    className="pa2 input-reset ba bg-transparent w-100 measure"
                    name="ville_rcs"
                    onChange={this.handleMyUserInputs}
                  />
                </div>
                <div className="mt3">
                  <label className="db fw4 lh-copy f6">Numéro de RCS</label>
                  <input
                    className="pa2 input-reset ba bg-transparent w-100 measure"
                    name="num_rcs"
                    onChange={this.handleMyUserInputs}
                  />
                </div>
                <div className="mt3">
                  <label className="db fw4 lh-copy f6">
                    Nom du représentant légal
                  </label>
                  <input
                    className="pa2 input-reset ba bg-transparent w-100 measure"
                    name="nom"
                    onChange={this.handleMyUserInputs}
                  />
                </div>
                <div className="mt3">
                  <label className="db fw4 lh-copy f6">
                    Prénom du représentant légal
                  </label>
                  <input
                    className="pa2 input-reset ba bg-transparent w-100 measure"
                    name="prenom"
                    onChange={this.handleMyUserInputs}
                  />
                  <p>Civilité</p>

                  <select onChange={this.handleCivilite}>
                    <option value="M.">Monsieur</option>
                    <option value="Mme">Madame</option>
                  </select>

                  <div className="mt3">
                    <label className="db fw4 lh-copy f6">
                      Fonction du représentant légal
                    </label>
                    <input
                      className="pa2 input-reset ba bg-transparent w-100 measure"
                      name="fonction"
                      onChange={this.handleMyUserInputs}
                    />
                  </div>
                </div>
              </fieldset>
            </article>
            {/* Bouton sauvegarder */}
            <div className="buttonsauvegarder tc pt1">
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
      );
    } else if (
      this.state.targetDebiteur !== undefined &&
      this.state.loaded === true
    ) {
      return (
        <div>
          <div className="title_créancier pl4">
            <h1 className="titre1">Informations sur les débiteurs</h1>
            <h2 className="compagnietitre">
              Compagnie {this.state.targetDebiteur[0].denomination_sociale}
            </h2>
          </div>

          {/* Formulaire */}
          <div className="fl w-50">
            <article className="pa4 black-80">
              <form action="submit" method="post" acceptCharset="utf-8">
                <fieldset className="ba b--transparent ph0 mh0 mh2">
                  <div className="mt3">
                    <label className="db fw4 lh-copy f6">
                      Dénomination sociale
                    </label>
                    <input
                      className="pa2 input-reset ba bg-transparent w-100 measure"
                      name="denomination_sociale"
                      value={
                        this.state.denomination_sociale ||
                        this.state.targetDebiteur[0].denomination_sociale
                      }
                      onChange={this.handleMyUserInputs}
                    />
                  </div>
                  <div className="mt3">
                    <label className="db fw4 lh-copy f6">Forme juridique</label>
                    <input
                      className="pa2 input-reset ba bg-transparent w-100 measure"
                      name="forme_juridique"
                      value={
                        this.state.forme_juridique ||
                        this.state.targetDebiteur[0].forme_juridique
                      }
                      onChange={this.handleMyUserInputs}
                    />
                  </div>
                  <div className="mt3">
                    <label className="db fw4 lh-copy f6">
                      Nationalité de la société
                    </label>
                    <input
                      className="pa2 input-reset ba bg-transparent w-100 measure"
                      name="nationalite_societe"
                      value={
                        this.state.nationalite_societe ||
                        this.state.targetDebiteur[0].nationalite_societe
                      }
                      onChange={this.handleMyUserInputs}
                    />
                  </div>
                  <div className="mt3">
                    <label className="db fw4 lh-copy f6">
                      Adresse du siège social
                    </label>
                    <input
                      className="pa2 input-reset ba bg-transparent w-100 measure"
                      name="adresse_siege"
                      value={
                        this.state.adresse_siege ||
                        this.state.targetDebiteur[0].adresse_siege
                      }
                      onChange={this.handleMyUserInputs}
                    />
                  </div>
                  <div className="mt3">
                    <label className="db fw4 lh-copy f6">
                      Code postal du siège social
                    </label>
                    <input
                      className="pa2 input-reset ba bg-transparent w-100 measure"
                      name="code_postal_siege"
                      value={
                        this.state.code_postal_siege ||
                        this.state.targetDebiteur[0].code_postal_siege
                      }
                      onChange={this.handleMyUserInputs}
                    />
                  </div>
                  <div className="mt3">
                    <label className="db fw4 lh-copy f6">
                      Ville du siège social
                    </label>
                    <input
                      className="pa2 input-reset ba bg-transparent w-100 measure"
                      name="ville_siege"
                      value={
                        this.state.ville_siege ||
                        this.state.targetDebiteur[0].ville_siege
                      }
                      onChange={this.handleMyUserInputs}
                    />
                    <div className="mt3">
                      <label className="db fw4 lh-copy f6">
                        Pays du siège social
                      </label>
                      <input
                        className="pa2 input-reset ba bg-transparent w-100 measure"
                        name="pays_siege"
                        value={
                          this.state.pays_siege ||
                          this.state.targetDebiteur[0].pays_siege
                        }
                        onChange={this.handleMyUserInputs}
                      />
                    </div>
                  </div>
                </fieldset>
              </form>
            </article>
          </div>
          <div className="fl w-50 ">
            <article className="pa4 black-80">
              <fieldset id="submit" className="ba b--transparent ph0 mh0 ">
                <div className="mt3">
                  <label className="db fw4 lh-copy f6">Ville du RCS</label>
                  <input
                    className="pa2 input-reset ba bg-transparent w-100 measure"
                    name="ville_rcs"
                    value={
                      this.state.ville_rcs ||
                      this.state.targetDebiteur[0].ville_rcs
                    }
                    onChange={this.handleMyUserInputs}
                  />
                </div>
                <div className="mt3">
                  <label className="db fw4 lh-copy f6">Numéro de RCS</label>
                  <input
                    className="pa2 input-reset ba bg-transparent w-100 measure"
                    name="num_rcs"
                    value={
                      this.state.num_rcs || this.state.targetDebiteur[0].num_rcs
                    }
                    onChange={this.handleMyUserInputs}
                  />
                </div>
                <div className="mt3">
                  <label className="db fw4 lh-copy f6">
                    Nom du représentant légal
                  </label>
                  <input
                    className="pa2 input-reset ba bg-transparent w-100 measure"
                    name="nom"
                    value={this.state.nom || this.state.targetDebiteur[0].nom}
                    onChange={this.handleMyUserInputs}
                  />
                </div>
                <div className="mt3">
                  <label className="db fw4 lh-copy f6">
                    Prénom du représentant légal
                  </label>
                  <input
                    className="pa2 input-reset ba bg-transparent w-100 measure"
                    name="prenom"
                    value={
                      this.state.prenom || this.state.targetDebiteur[0].prenom
                    }
                    onChange={this.handleMyUserInputs}
                  />
                  <p>Civilité</p>

                  <select onChange={this.handleCivilite}>
                    {this.handleMyCivilChange()}
                  </select>

                  <div className="mt3">
                    <label className="db fw4 lh-copy f6">
                      Fonction du représentant légal
                    </label>
                    <input
                      className="pa2 input-reset ba bg-transparent w-100 measure"
                      name="fonction"
                      value={
                        this.state.fonction ||
                        this.state.targetDebiteur[0].fonction
                      }
                      onChange={this.handleMyUserInputs}
                    />
                  </div>
                </div>
              </fieldset>
            </article>
            {/* Bouton sauvegarder */}
            <div className="buttonsauvegarder tc pt1">
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
      );
    } else return null;
  }
}

export default Formulairedebiteur;
