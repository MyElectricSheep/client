import React, { Component } from "react";
import supprimer from "./Icones_Arigoni/icone_supprimer.png";
import modifier from "./Icones_Arigoni/icone_modifier.png";
import { NavLink } from "react-router-dom";
import "./debiteurs.css";
import Axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

class Creanciers extends Component {
  state = {
    creanciers: [],
    creanciersFiltered: [],
    creanciersSearch: "",
    myReloadCounter: 0
  };

  reloadNow = id => {
    this.setState(previousState => ({
      creanciers: previousState.creanciers,
      creanciersFiltered: previousState.creanciersFiltered.filter(
        creancier => creancier.id !== id
      ),
      myReloadCounter: this.state.myReloadCounter + 1
    }));
    this.forceUpdate();
  };

  handleDelete = (id, denomination) => {
    const myId = id;
    confirmAlert({
      title: "Merci de confirmer",
      message: "Voulez-vous vraiment supprimer ce créancier ?",
      buttons: [
        {
          label: "Oui",
          onClick: () =>
            Axios.put(`${REACT_APP_API}/api/creanciers/${myId}`, {
              active: "false"
            })
              .then(response => {
                this.reloadNow(myId);
                alert(`Le créancier ${denomination} a bien été supprimé.`);
                console.log(response);
              })
              .catch(error => {
                console.log(error);
              })
        },
        {
          label: "Non"
          // onClick: () => alert("Le créancier n'a pas été supprimé.")
        }
      ]
    });
  };

  mySearch = () => {
    this.setState({
      creanciersFiltered: this.state.creanciersFiltered.filter(creancier =>
        creancier.denomination_sociale
          .toLowerCase()
          .includes(this.state.creanciersSearch.toLowerCase())
      )
    });
  };

  handleSearch = e => {
    this.setState(
      {
        creanciersSearch: e.target.value
      },
      () => {
        if (this.state.creanciersSearch.length > 0) {
          this.mySearch();
        } else {
          this.setState({
            creanciersFiltered: this.state.creanciers.filter(
              creancier => creancier.active
            )
          });
        }
      }
    );
  };

  componentDidMount() {
    Axios.get(`${REACT_APP_API}/api/creanciers`)
      .then(response => {
        this.setState({
          // returns all creanciers
          creanciers: response.data.filter(creancier => creancier.active),
          // returns all creanciers whose active status is true
          creanciersFiltered: response.data.filter(
            creancier => creancier.active
          )
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const myCreanciers = this.state.creanciersFiltered;
    const myReloadCounter = this.state.myReloadCounter;
    if (this.state.creanciers[0] === undefined) {
      return (
        <div className="creancier">
          <div className="fl w-60">
            <div className="title_créancier pl4">
              <h1 className="f2 lh-copy nowrap">
                Informations sur les créanciers
              </h1>
              <h2 className="pt2 f4 lh-copy">
                Vous n'avez pas encore créé de créancier.
              </h2>
            </div>
            <div className="buttoncreancier pt2 pl4">
              <NavLink
                to="/dashboard/formCreancier"
                className="f6 link dim br1 ph3 pv2 mt2 mb4 dib white bg-dark-blue "
                onClick={() => this.props.pageChangeSub("FormCreancier")}
              >
                Créer un créancier
              </NavLink>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        //tableau informations des créanciers
        <div className="creancier">
          <div className="fl w-60">
            <div className="title_créancier pl4">
              <h1 className="f2 lh-copy nowrap">
                Informations sur les créanciers
              </h1>
              <h2 className="pt2 f4 lh-copy">Liste des créanciers</h2>
            </div>
          </div>
          {/* searchbar */}
          <div className="fl w-40">
            <div className="wraparigo">
              <div className="searcharigo">
                <input
                  type="text"
                  className="searchTerm"
                  placeholder="trouver un créancier"
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
                  {myCreanciers
                    .sort((a, b) => b.id - a.id)
                    .slice(0, 200)
                    .map(creancier => {
                      return (
                        <tr
                          className="stripe-dark"
                          key={`${myReloadCounter}-${
                            creancier.denomination_sociale
                          }`}
                        >
                          <td>{creancier.denomination_sociale}</td>
                          <td>{creancier.forme_juridique}</td>
                          <td>{creancier.pays_siege}</td>
                          <td>
                            <NavLink to="/dashboard/formCreancier">
                              <img
                                className="icone pointer"
                                src={modifier}
                                alt="modifier"
                                onClick={() =>
                                  this.props.pageChangeSub(
                                    "FormCreancier",
                                    `${creancier.id}`
                                  )
                                }
                                // onClick={this.handleModification}
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
                                  creancier.id,
                                  creancier.denomination_sociale
                                )
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {/* Button créer un créancier */}
              <div className="buttoncreancier tc pt4">
                <NavLink
                  to="/dashboard/formCreancier"
                  className="f6 link dim br1 ph3 pv2 mt2 mb4 dib white bg-dark-blue "
                  onClick={() => this.props.pageChangeSub("FormCreancier")}
                >
                  Créer un créancier
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Creanciers;
