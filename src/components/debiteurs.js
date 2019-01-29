import React, { Component } from "react";
import supprimer from "./Icones_Arigoni/icone_supprimer.png";
import modifier from "./Icones_Arigoni/icone_modifier.png";
import { NavLink } from "react-router-dom";
import "./debiteurs.css";
import Axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

class Debiteurs extends Component {
  state = {
    debiteurs: [],
    debiteursFiltered: [],
    debiteursSearch: "",
    myReloadCounter: 0
  };

  reloadNow = id => {
    this.setState(previousState => ({
      debiteurs: previousState.debiteurs,
      debiteursFiltered: previousState.debiteursFiltered.filter(
        debiteur => debiteur.id !== id
      ),
      myReloadCounter: this.state.myReloadCounter + 1
    }));
    this.forceUpdate();
  };

  handleDelete = (id, denomination) => {
    const myId = id;
    confirmAlert({
      title: "Merci de confirmer",
      message: "Voulez-vous vraiment supprimer ce débiteur ?",
      buttons: [
        {
          label: "Oui",
          onClick: () =>
            Axios.put(`${REACT_APP_API}/api/debiteurs/${myId}`, {
              active: "false"
            })
              .then(response => {
                this.reloadNow(myId);
                alert(`Le débiteur ${denomination} a bien été supprimé.`);
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

  mySearch = () => {
    this.setState({
      debiteursFiltered: this.state.debiteursFiltered.filter(debiteur =>
        debiteur.denomination_sociale
          .toLowerCase()
          .includes(this.state.debiteursSearch.toLowerCase())
      )
    });
  };

  handleSearch = e => {
    this.setState(
      {
        debiteursSearch: e.target.value
      },
      () => {
        if (this.state.debiteursSearch.length > 0) {
          this.mySearch();
        } else {
          this.setState({
            debiteursFiltered: this.state.debiteurs.filter(
              debiteur => debiteur.active
            )
          });
        }
      }
    );
  };

  componentDidMount() {
    Axios.get(`${REACT_APP_API}/api/debiteurs`)
      .then(response => {
        this.setState({
          // returns all debiteurs
          debiteurs: response.data.filter(debiteur => debiteur.active),
          // returns all debiteurs whose active status is true
          debiteursFiltered: response.data.filter(debiteur => debiteur.active)
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const myDebiteurs = this.state.debiteursFiltered;
    const myReloadCounter = this.state.myReloadCounter;
    if (this.state.debiteurs[0] === undefined) {
      return (
        <div className="creancier">
          <div className="fl w-60">
            <div className="title_créancier pl4">
              <h1 className="f2 lh-copy nowrap">
                Informations sur les débiteurs
              </h1>
              <h2 className="pt2 f4 lh-copy">
                Vous n'avez pas encore créé de débiteur.
              </h2>
            </div>
            <div className="buttoncreancier pt2 pl4">
              <NavLink
                to="/dashboard/formCreancier"
                className="f6 link dim br1 ph3 pv2 mt2 mb4 dib white bg-dark-blue "
                onClick={() => this.props.pageChangeSub("FormDebiteur")}
              >
                Créer un débiteur
              </NavLink>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        //tableau informations des debiteurs
        <div className="creancier">
          <div className="fl w-60">
            <div className="title_créancier pl4">
              <h1 className="f2 lh-copy nowrap">
                Informations sur les débiteurs
              </h1>
              <h2 className="pt2 f4 lh-copy">Liste des débiteurs</h2>
            </div>
          </div>
          {/* searchbar */}
          <div className="fl w-40">
            <div className="wraparigo">
              <div className="searcharigo">
                <input
                  type="text"
                  className="searchTerm"
                  placeholder="trouver un débiteur"
                  onChange={this.handleSearch}
                />
                <button type="submit" className="searchButton">
                  <i className="fa fa-search" />
                </button>
              </div>
            </div>
          </div>

          {/* tableau */}
          <div className=" tableau fl w-100 pa4 ">
            <div className="overflow-auto">
              <table className="f6 w-100 center" cellSpacing="0">
                <thead>
                  <tr className="stripe-dark">
                    <th>Dénomination sociale</th>
                    <th>Forme juridique</th>
                    <th>Pays</th>
                    <th>Modifier</th>
                    <th>Supprimer</th>
                  </tr>
                </thead>
                <tbody className="lh-copy">
                  {myDebiteurs
                    .sort((a, b) => b.id - a.id)
                    .slice(0, 200)
                    .map(debiteur => {
                      return (
                        <tr
                          className="stripe-dark"
                          key={`${myReloadCounter}-${
                            debiteur.denomination_sociale
                          }`}
                        >
                          <td>{debiteur.denomination_sociale}</td>
                          <td>{debiteur.forme_juridique}</td>
                          <td>{debiteur.pays_siege}</td>
                          <td>
                            <NavLink to="/dashboard/formDebiteur">
                              <img
                                className="icone pointer"
                                src={modifier}
                                alt="modifier"
                                onClick={() =>
                                  this.props.pageChangeSub(
                                    "FormDebiteur",
                                    0,
                                    `${debiteur.id}`
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
                              onClick={() =>
                                this.handleDelete(
                                  debiteur.id,
                                  debiteur.denomination_sociale
                                )
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {/* Button créer un debiteurs */}
              <div className="buttoncreancier tc pt4">
                <NavLink
                  to="/dashboard/formDebiteur"
                  className="f6 link dim br1 ph3 pv2 mt2 mb4 dib white bg-dark-blue "
                  onClick={() => this.props.pageChangeSub("FormDebiteur")}
                >
                  Créer un débiteur
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Debiteurs;
