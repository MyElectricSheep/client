import React, { Component } from "react";
import supprimer from "./Icones_Arigoni/icone_supprimer.png";
import modifier from "./Icones_Arigoni/icone_modifier.png";
import { NavLink } from "react-router-dom";
import "./debiteurs.css";
import Axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

class Avoirs extends Component {
  state = {
    avoirs: [],
    avoirsFiltered: [],
    avoirsSearch: "",
    myReloadCounter: 0
  };

  reloadNow = id => {
    this.setState(previousState => ({
      avoirs: previousState.avoirs,
      avoirsFiltered: previousState.avoirsFiltered.filter(
        avoir => avoir.id !== id
      ),
      myReloadCounter: this.state.myReloadCounter + 1
    }));
    this.forceUpdate();
  };

  handleDelete = id => {
    const myId = id;
    confirmAlert({
      title: "Merci de confirmer",
      message: "Voulez-vous vraiment supprimer cet avoir ?",
      buttons: [
        {
          label: "Oui",
          onClick: () =>
            Axios.put(`/api/avoirs/${myId}`, {
              active: "false"
            })
              .then(response => {
                this.reloadNow(myId);
                alert(`L'avoir a bien été supprimé.`);
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
    Axios.get("/api/avoirs")
      .then(response => {
        this.setState({
          // returns all avoirs
          avoirs: response.data,
          // returns all avoirs whose active status is true
          avoirsFiltered: response.data.filter(avoir => avoir.active)
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const myavoirs = this.state.avoirsFiltered;
    const myReloadCounter = this.state.myReloadCounter;
    return (
      <div className="avoir">
        <div className="fl w-60">
          <div className="title_créancier pl4">
            <h2 className="pt2 f4 lh-copy">Liste des avoirs</h2>
          </div>
        </div>

        {/* tableau */}
        <div className=" tableau fl w-100 pa4 ">
          <div className="overflow-auto">
            <table className="f6 w-100 center" cellSpacing="0">
              <thead>
                <tr className="stripe-dark">
                  <th>N° avoir</th>
                  <th>Date</th>
                  <th>montant HT</th>
                  <th>montant TTC</th>
                  <th>Modifier</th>
                  <th>Supprimer</th>
                </tr>
              </thead>
              <tbody className="lh-copy">
                {myavoirs
                  .sort((a, b) => b.id - a.id)
                  .slice(0, 10)
                  .map(avoir => {
                    return (
                      <tr
                        className="stripe-dark"
                        key={`${myReloadCounter}-${avoir.num_avoir}`}
                      >
                        <td>{avoir.num_avoir}</td>
                        <td>{avoir.date_avoir}</td>
                        <td>{avoir.montant_ht}</td>
                        <td>{avoir.montant_ttc}</td>
                        <td>
                          <NavLink to="/dashboard/formAvoir">
                            <img
                              className="icone pointer"
                              src={modifier}
                              alt="modifier"
                              onClick={() =>
                                this.props.pageChangeSub(
                                  "FormAvoir",
                                  `${avoir.id}`
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
                            onClick={() => this.handleDelete(avoir.id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            <div className="buttonavoir tc pt4">
              <NavLink
                to="/dashboard/formAvoir"
                className="f6 link dim br1 ph3 pv2 mt2 mb4 dib white bg-dark-blue "
                onClick={() => this.props.pageChangeSub("FormAvoir")}
              >
                Créer un avoir
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Avoirs;
