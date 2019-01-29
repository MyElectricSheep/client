import React, { Component } from "react";
import "./actions.css";
import Tabfacture from "./tabfacture";
import Tabavoir from "./tabavoir";
import Axios from "axios";
import Autocomplete from "./autocomplete";

class Actions extends Component {
  state = {
    creanciers: [],
    creanciersFiltered: [],
    debiteurs: [],
    debiteursFiltered: [],
    creancierSelected: "",
    debiteurSelected: "",
    creanciersNames: [],
    debiteursNames: [],
    checkboxFacture: true,
    checkboxProduits: false,
    checkboxServices: false,
    honoraires: ""
  };

  componentDidMount() {
    Axios.get(`${process.env.REACT_APP_API}/api/creanciers`)
      .then(response => {
        this.setState({
          // returns all creanciers
          creanciers: response.data,
          // returns all creanciers whose active status is true
          creanciersFiltered: response.data.filter(
            creancier => creancier.active
          ),
          creanciersNames: response.data
            .filter(creancier => creancier.denomination_sociale !== null)
            .map(creancier => creancier.denomination_sociale)
        });
      })
      .catch(error => {
        console.log(error);
      });
    Axios.get(`${process.env.REACT_APP_API}/api/debiteurs`)
      .then(response => {
        this.setState({
          // returns all debiteurs
          debiteurs: response.data,
          // returns all debiteurs whose active status is true
          debiteursFiltered: response.data.filter(debiteur => debiteur.active),
          debiteursNames: response.data
            .filter(debiteur => debiteur.denomination_sociale !== null)
            .map(debiteur => debiteur.denomination_sociale)
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleTabSwitch() {
    return this.state.checkboxFacture ? (
      <Tabfacture pageChangeSub={this.props.pageChangeSub} />
    ) : (
      <Tabavoir pageChangeSub={this.props.pageChangeSub} />
    );
  }

  handleCheckbox() {
    this.setState({
      checkboxFacture: !this.state.checkboxFacture
    });
  }

  handleCheckboxDisplay() {
    return this.state.checkboxFacture ? "factures" : "avoirs";
  }

  handleProduits() {
    this.setState({
      checkboxProduits: !this.state.checkboxProduits
    });
  }

  handleServices() {
    this.setState({
      checkboxServices: !this.state.checkboxServices
    });
  }

  handleHonoraires = e => {
    this.setState({
      honoraires: e.target.value
    });
  };

  render() {
    return (
      <div className="fl w-100">
        <div className="fl w-100 tc">
          <h1 className="f2">Actions</h1>
        </div>
        <div className="fl w-100 tc">
          <div className="fl w-40">
            <p className="f3">Sélectionner un créancier</p>
            <form action="creancier">
              <Autocomplete suggestions={this.state.creanciersNames} />
            </form>
          </div>
          <div className="fl w-20 ">
            <p className="f2 lh-title">vs</p>
          </div>
          <div className="fl w-40">
            <p className="f3">Sélectionner un débiteur</p>
            <form action="debiteur">
              <Autocomplete suggestions={this.state.debiteursNames} />
            </form>
          </div>
        </div>
        <div className="fl w-100 pt4 tc">
          <div className="checkbox-wrap custom style-2">
            <input
              type="checkbox"
              id="custom-checkbox-2"
              onClick={() => this.handleCheckbox()}
            />
            <label htmlFor="custom-checkbox-2">
              Gérer les {this.handleCheckboxDisplay()}
            </label>
          </div>
        </div>
        <div className="fl w-100 pt4 pr4 pl4">{this.handleTabSwitch()}</div>
        <div>
          {/* checkbox pour produits */}

          <div className="fl w-40 pt2 pl4 tc">
            <p className="">
              Produits vendus :
              <input
                type="checkbox"
                name="produitsV"
                value="produitsV"
                // className="pr3 mr3"
                onClick={() => this.handleProduits()}
              />
            </p>

            <p className="">
              Services fournis :
              <input
                type="checkbox"
                name="servicesF"
                value="servicesF"
                // className="pr3 mr3"
                onClick={() => this.handleServices()}
              />
            </p>
          </div>
          <br />
          {/* Input pour honoraires */}
          <div className="fl w-60 pt4 tc">
            <form action="facture">
              <span>Honoraires:</span>
              <input
                className="ml2"
                type="text"
                name="honos"
                placeholder="Honoraires"
                onChange={this.handleHonoraires}
              />
              <span className="pl1">€</span>
            </form>
          </div>

          {/* Boutons */}
          <div className=" fl w-100 tc pt4 mt3 buttonsauvegarder">
            <a
              className="f6 link dim br1 ph3 pv2 mt2 mb4 dib white bg-dark-blue "
              href="#0"
            >
              Créer une injonction de payer
            </a>
            <a
              className="f6 ml4 link dim br1 ph3 pv2 mt2 mb4 dib white bg-dark-blue "
              href="#0"
            >
              Créer une mise en demeure
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Actions;
