import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import previous from "./Icones_Arigoni/previous.svg";
import "./Facture.css";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

class Formulairefacture extends Component {
  state = {
    factures: [],
    facturesFiltered: [],
    myReloadCounter: 0,
    num_commande: "",
    num_confirmation_commande: "",
    num_document_transport: "",
    num_facture: "",
    date_facture: "",
    montant_ht: "",
    montant_ttc: "",
    echeance_facture: "",
    taux_applicable: 0,
    intérets_capitalises: 0,
    actionId: this.props.actionId,
    paiement_echeance: false,
    paiement_livraison: false,
    EcheanceOuLivraison: "",
    Echeance: false,
    Livraison: false,
    active: true
  };

  handleMyUserInputs = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleEcheanceOuLivraison = (event, typeDeCalcul) => {
    if (
      (typeDeCalcul === "Echeance" && this.state.Livraison === true) ||
      (typeDeCalcul === "Livraison" && this.state.Echeance === true)
    ) {
      alert(
        "Vous pouvez sélectionner uniquement à la livraison ou à l'échéance de la facture"
      );
      event.stopPropagation();
      event.preventDefault();
    } else {
      if (typeDeCalcul === "Echeance" && this.state.Echeance === false) {
        this.setState({
          paiement_echeance: true,
          Echeance: true,
          Livraison: false
        });
      } else if (typeDeCalcul === "Echeance" && this.state.Echeance === true) {
        this.setState({
          paiement_echeance: false,
          Echeance: false,
          Livraison: false
        });
      } else if (
        typeDeCalcul === "Livraison" &&
        this.state.Livraison === false
      ) {
        this.setState({
          paiement_livraison: true,
          Echeance: false,
          Livraison: true
        });
      } else {
        this.setState({
          paiement_livraison: false,
          Echeance: false,
          Livraison: false
        });
      }
    }
  };

  handleSubmit = () => {
    confirmAlert({
      title: "Merci de confirmer",
      message: "Voulez-vous vraiment enregistrer cette nouvelle facture ?",
      buttons: [
        {
          label: "Oui",
          onClick: () =>
            axios
              .post(`${process.env.REACT_APP_API}/api/factures`, this.state)
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
    const id = this.props.facture;

    confirmAlert({
      title: "Merci de confirmer",
      message:
        "Voulez-vous vraiment modifier les informations de cette facture ?",
      buttons: [
        {
          label: "Oui",
          onClick: () =>
            axios
              .put(`${process.env.REACT_APP_API}/api/factures/${id}`, this.state)
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
    const id = this.props.facture;
    axios
      .get(`${process.env.REACT_APP_API}/api/factures`)
      .then(response => {
        this.setState({
          // returns all factures whose active status is true
          facturesFiltered: response.data.filter(facture => facture.id === id),
          loaded: true
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    if (this.props.facture === undefined) {
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
          </div>
          <div className="fl w-100 tc">
            <h2 className="ml4">Nouvelle facture</h2>
            <form className="pa4 ml4 mt4">
              <div>
                <div>
                  <div className="pa2 b">N° de commande</div>
                  <input
                    className="white-dark pa1"
                    type="text"
                    name="num_commande"
                    placeholder=""
                    onChange={this.handleMyUserInputs}
                  />
                </div>
              </div>
              <div className="">
                <div>
                  <div className="pa2 b">N° de confirmation de commande</div>
                  <input
                    className="white-dark pa1"
                    type="text"
                    name="num_confirmation_commande"
                    placeholder=""
                    onChange={this.handleMyUserInputs}
                  />
                </div>
              </div>
              <div className="">
                <div>
                  <div className=" pa2 b">N° document de transport</div>
                  <input
                    className="white-dark pa1"
                    type="text"
                    name="num_document_transport"
                    placeholder=""
                    onChange={this.handleMyUserInputs}
                  />
                </div>
              </div>
              <div className="">
                <div>
                  <div className=" pa2 b">N° facture</div>
                  <input
                    className="white-dark pa1"
                    type="text"
                    name="num_facture"
                    placeholder=""
                    onChange={this.handleMyUserInputs}
                  />
                </div>
              </div>
              <div className="">
                <div>
                  <div className=" pa2 b">Date facture</div>
                  <input
                    className="white-dark pa1"
                    type="text"
                    name="date_facture"
                    placeholder=""
                    onChange={this.handleMyUserInputs}
                  />
                </div>
              </div>
              <div className="">
                <div>
                  <div className=" pa2 b">Montant HT de la facture</div>
                  <input
                    className="white-dark pa1"
                    type="text"
                    name="montant_ht"
                    placeholder=""
                    onChange={this.handleMyUserInputs}
                  />
                </div>
              </div>
              <div className="">
                <div>
                  <div className=" pa2 b">Montant TTC de la facture</div>
                  <input
                    className="white-dark pa1"
                    type="text"
                    name="montant_ttc"
                    placeholder=""
                    onChange={this.handleMyUserInputs}
                  />
                </div>
              </div>
              <div className="">
                <div>
                  <div className=" pa2 b">Echeance de la facture</div>
                  <input
                    className="white-dark pa1"
                    type="text"
                    name="echeance_facture"
                    placeholder=""
                    onChange={this.handleMyUserInputs}
                  />
                </div>
              </div>

              <div>
                {/* <div className=" pa2 b pt3">
                  Choisir l'échéance de la facture
                </div> */}

                <div className="dib pt3">
                  <input
                    type="checkbox"
                    name="paiement_echeance"
                    className="autreInput"
                    onClick={e => this.handleEcheanceOuLivraison(e, "Echeance")}
                  />
                  <label for="paiement_echeance">
                    Paiement à l'échéance de la facture
                  </label>
                </div>
                <div className="dib">
                  <input
                    type="checkbox"
                    name="paiement_livraison"
                    className="autreInput"
                    onClick={e =>
                      this.handleEcheanceOuLivraison(e, "Livraison")
                    }
                  />
                  <label for="ttc">Paiement à la livraison</label>
                </div>
              </div>
            </form>
            <div className="buttonsauvegarder tc pt1 ml4">
              <a
                className="f6 link dim br1 ph3 pv2 mt2 mb4 dib white bg-dark-blue"
                href="#0"
                onClick={this.handleSubmit}
              >
                Sauvegarder
              </a>
            </div>
          </div>
        </div>
      );
    } else if (this.state.loaded === true && this.props.facture !== undefined) {
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
          </div>
          <div className="fl w-100 tc">
            <h2 className="ml4">Modifier une facture existante</h2>
            <form className="pa4 ml4 mt4">
              <div>
                <div>
                  <div className="pa2 b">N° de commande</div>
                  <input
                    className="white-dark pa1"
                    type="text"
                    name="num_commande"
                    placeholder=""
                    value={
                      this.state.num_commande ||
                      this.state.facturesFiltered[0].num_commande
                    }
                    onChange={this.handleMyUserInputs}
                  />
                </div>
              </div>
              <div className="">
                <div>
                  <div className="pa2 b">N° de confirmation de commande</div>
                  <input
                    className="white-dark pa1"
                    type="text"
                    name="num_confirmation_commande"
                    placeholder=""
                    value={
                      this.state.num_confirmation_commande ||
                      this.state.facturesFiltered[0].num_confirmation_commande
                    }
                    onChange={this.handleMyUserInputs}
                  />
                </div>
              </div>
              <div className="">
                <div>
                  <div className=" pa2 b">N° document de transport</div>
                  <input
                    className="white-dark pa1"
                    type="text"
                    name="num_document_transport"
                    placeholder=""
                    value={
                      this.state.num_document_transport ||
                      this.state.facturesFiltered[0].num_document_transport
                    }
                    onChange={this.handleMyUserInputs}
                  />
                </div>
              </div>
              <div className="">
                <div>
                  <div className=" pa2 b">N° facture</div>
                  <input
                    className="white-dark pa1"
                    type="text"
                    name="num_facture"
                    placeholder=""
                    value={
                      this.state.num_facture ||
                      this.state.facturesFiltered[0].num_facture
                    }
                    onChange={this.handleMyUserInputs}
                  />
                </div>
              </div>
              <div className="">
                <div>
                  <div className=" pa2 b">Date facture</div>
                  <input
                    className="white-dark pa1"
                    type="text"
                    name="date_facture"
                    placeholder=""
                    value={
                      this.state.date_facture ||
                      this.state.facturesFiltered[0].date_facture
                    }
                    onChange={this.handleMyUserInputs}
                  />
                </div>
              </div>
              <div className="">
                <div>
                  <div className=" pa2 b">Montant HT de la facture</div>
                  <input
                    className="white-dark pa1"
                    type="text"
                    name="montant_ht"
                    placeholder=""
                    value={
                      this.state.montant_ht ||
                      this.state.facturesFiltered[0].montant_ht
                    }
                    onChange={this.handleMyUserInputs}
                  />
                </div>
              </div>
              <div className="">
                <div>
                  <div className=" pa2 b">Montant TTC de la facture</div>
                  <input
                    className="white-dark pa1"
                    type="text"
                    name="montant_ttc"
                    placeholder=""
                    value={
                      this.state.montant_ttc ||
                      this.state.facturesFiltered[0].montant_ttc
                    }
                    onChange={this.handleMyUserInputs}
                  />
                </div>
              </div>
              <div className="">
                <div>
                  <div className=" pa2 b">Echeance de la facture</div>
                  <input
                    className="white-dark pa1"
                    type="text"
                    name="echeance_facture"
                    placeholder=""
                    value={
                      this.state.echeance_facture ||
                      this.state.facturesFiltered[0].echeance_facture
                    }
                    onChange={this.handleMyUserInputs}
                  />
                </div>
              </div>
              <div>
                {/* <div className=" pa2 b pt3">
                  Choisir l'échéance de la facture
                </div> */}

                <div className="dib pt3">
                  <input
                    type="checkbox"
                    name="paiement_echeance"
                    className="autreInput"
                    onClick={e => this.handleEcheanceOuLivraison(e, "Echeance")}
                  />
                  <label for="paiement_echeance">
                    Paiement à l'échéance de la facture
                  </label>
                </div>
                <div className="dib">
                  <input
                    type="checkbox"
                    name="paiement_livraison"
                    className="autreInput"
                    onClick={e =>
                      this.handleEcheanceOuLivraison(e, "Livraison")
                    }
                  />
                  <label for="ttc">Paiement à la livraison</label>
                </div>
              </div>
            </form>
            <div className="buttonsauvegarder tc pt1 ml4">
              <a
                className="f6 link dim br1 ph3 pv2 mt2 mb4 dib white bg-dark-blue"
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
export default Formulairefacture;
