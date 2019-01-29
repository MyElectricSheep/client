import React, { Component } from "react";
import supprimer from "./Icones_Arigoni/icone_supprimer.png";
import modifier from "./Icones_Arigoni/icone_modifier.png";
import { NavLink } from "react-router-dom";
import "./debiteurs.css";
import Axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

class Acomptes extends Component {
  state = {
    acomptes: [],
    acomptesFiltered: [],
    acomptesSearch: "",
    myReloadCounter: 0
  };

  reloadNow = id => {
    this.setState(previousState => ({
      acomptes: previousState.acomptes,
      acomptesFiltered: previousState.acomptesFiltered.filter(
        acompte => acompte.id !== id
      ),
      myReloadCounter: this.state.myReloadCounter + 1
    }));
    this.forceUpdate();
  };

  handleDelete = id => {
    const myId = id;
    confirmAlert({
      title: "Merci de confirmer",
      message: "Voulez-vous vraiment supprimer cet acompte ?",
      buttons: [
        {
          label: "Oui",
          onClick: () =>
            Axios.put(`/api/acomptes/${myId}`, {
              active: "false"
            })
              .then(response => {
                this.reloadNow(myId);
                alert(`L'acompte' a bien été supprimé.`);
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
    Axios.get("/api/acomptes")
      .then(response => {
        this.setState({
          // returns all acomptes
          acomptes: response.data,
          // returns all acomptes whose active status is true
          acomptesFiltered: response.data.filter(acompte => acompte.active)
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const myacomptes = this.state.acomptesFiltered;
    const myReloadCounter = this.state.myReloadCounter;
    return (
      <div className="acompte">
        <div className="fl w-60">
          <div className="title_créancier pl4">
            <h2 className="pt2 f4 lh-copy">Liste des acomptes</h2>
          </div>
        </div>

        {/* tableau */}
        <div className=" tableau fl w-100 pa4 ">
          <div className="overflow-auto">
            <table className="f6 w-100 center" cellSpacing="0">
              <thead>
                <tr className="stripe-dark">
                  <th>N° acompte</th>
                  <th>Date</th>
                  <th>montant HT</th>
                  <th>montant TTC</th>
                  <th>Modifier</th>
                  <th>Supprimer</th>
                </tr>
              </thead>
              <tbody className="lh-copy">
                {myacomptes
                  .sort((a, b) => b.id - a.id)
                  .slice(0, 10)
                  .map(acompte => {
                    return (
                      <tr
                        className="stripe-dark"
                        key={`${myReloadCounter}-${acompte.num_acompte}`}
                      >
                        <td>{acompte.num_acompte}</td>
                        <td>{acompte.date_acompte}</td>
                        <td>{acompte.montant_ht}</td>
                        <td>{acompte.montant_ttc}</td>
                        <td>
                          <NavLink to="/dashboard/formAcompte">
                            <img
                              className="icone pointer"
                              src={modifier}
                              alt="modifier"
                              onClick={() =>
                                this.props.pageChangeSub(
                                  "FormAcompte",
                                  `${acompte.id}`
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
                            onClick={() => this.handleDelete(acompte.id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            <div className="buttonacompte tc pt4">
              <NavLink
                to="/dashboard/formAcompte"
                className="f6 link dim br1 ph3 pv2 mt2 mb4 dib white bg-dark-blue "
                onClick={() => this.props.pageChangeSub("FormAcompte")}
              >
                Créer un acompte
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Acomptes;
