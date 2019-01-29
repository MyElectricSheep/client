import React, { Component } from "react";
import supprimer from "./Icones_Arigoni/icone_supprimer.png";
import modifier from "./Icones_Arigoni/icone_modifier.png";
import { NavLink } from "react-router-dom";
import "./debiteurs.css";
import Axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

class Factures extends Component {
  state = {
    factures: [],
    facturesFiltered: [],
    facturesSearch: "",
    myReloadCounter: 0
  };

  reloadNow = id => {
    this.setState(previousState => ({
      factures: previousState.factures,
      facturesFiltered: previousState.facturesFiltered.filter(
        facture => facture.id !== id
      ),
      myReloadCounter: this.state.myReloadCounter + 1
    }));
    this.forceUpdate();
  };

  handleDelete = id => {
    const myId = id;
    confirmAlert({
      title: "Merci de confirmer",
      message: "Voulez-vous vraiment supprimer cette facture ?",
      buttons: [
        {
          label: "Oui",
          onClick: () =>
            Axios.put(`${REACT_APP_API}/api/factures/${myId}`, {
              active: "false"
            })
              .then(response => {
                this.reloadNow(myId);
                alert(`La facture a bien été supprimée.`);
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
    Axios.get(`${REACT_APP_API}/api/factures`)
      .then(response => {
        this.setState({
          // returns all factures
          factures: response.data,
          // returns all factures whose active status is true
          facturesFiltered: response.data.filter(facture => facture.active)
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const myfactures = this.state.facturesFiltered;
    const myReloadCounter = this.state.myReloadCounter;
    return (
      <div className="facture">
        <div className="fl w-60">
          <div className="title_créancier pl4">
            <h2 className="pt2 f4 lh-copy">Liste des factures</h2>
          </div>
        </div>

        {/* tableau */}
        <div className=" tableau fl w-100 pa4 ">
          <div className="overflow-auto">
            <table className="f6 w-100 center" cellSpacing="0">
              <thead>
                <tr className="stripe-dark">
                  <th>N° facture </th>
                  <th>Date de facture </th>

                  <th>Montant TTC </th>
                  <th>Echéance facture </th>

                  <th>Modifier</th>
                  <th>Supprimer</th>
                </tr>
              </thead>
              <tbody className="lh-copy">
                {myfactures
                  .sort((a, b) => b.id - a.id)
                  .slice(0, 10)
                  .map(facture => {
                    return (
                      <tr
                        className="stripe-dark"
                        key={`${myReloadCounter}-${facture.num_facture}`}
                      >
                        <td>{facture.num_facture}</td>
                        <td>{facture.date_facture}</td>

                        <td>{facture.montant_ttc}</td>
                        <td>{facture.echeance_facture}</td>

                        <td>
                          <NavLink to="/dashboard/formFacture">
                            <img
                              className="icone pointer"
                              src={modifier}
                              alt="modifier"
                              onClick={() =>
                                this.props.pageChangeSub(
                                  "FormFacture",
                                  `${facture.id}`
                                )
                              }
                            />
                          </NavLink>
                        </td>
                        <td>
                          <img
                            className="icone pointer"
                            src={supprimer}
                            alt="supprimer"
                            onClick={() => this.handleDelete(facture.id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            <div className="buttonfacture tc pt4">
              <NavLink
                to="/dashboard/formFacture"
                className="f6 link dim br1 ph3 pv2 mt2 mb4 dib white bg-dark-blue "
                onClick={() => this.props.pageChangeSub("FormFacture")}
              >
                Créer une facture
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Factures;
