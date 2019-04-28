import React from "react";

// import supprimer from "./Icones_Arigoni/icone_supprimer.png";
import download from "./Icones_Arigoni/icone_upload.png";
import Axios from "axios";
import "./Historique.css";
import supprimer from "./Icones_Arigoni/icone_supprimer.png";
import modifier from "./Icones_Arigoni/icone_modifier.png";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

class Historique extends React.Component {
  state = {
    checkboxActive: true,
    actions: [],
    actionsActive: [],
    actionsNotActive: [],
    creanciers: [],
    debiteurs: []
  };

  componentDidMount() {
    Axios.get(`${process.env.REACT_APP_API}/api/actions`)
      .then(response => {
        this.setState({
          actions: response.data,
          // returns filtered actions
          actionsActive: response.data.filter(action => action.active === true),
          actionsNotActive: response.data.filter(
            action => action.active === false
          )
        });
      })
      .catch(error => {
        console.log(error);
      });
    Axios.get(`${process.env.REACT_APP_API}/api/creanciers`)
      .then(response => {
        this.setState({
          creanciers: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });
    Axios.get(`${process.env.REACT_APP_API}/api/debiteurs`)
      .then(response => {
        this.setState({
          debiteurs: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleTabSwitch = () => {
    return this.state.checkboxActive
      ? this.state.actionsActive
      : this.state.actionsNotActive;
  };

  downloadDoc = (doc, id) => {
    if (this.state.checkboxActive === true) {
      if (doc === "med") {
        let myAction = this.state.actionsActive.filter(
          action => action.id === id
        );
        let url = myAction[0].option_1;
        if (url !== null) {
          window.open(url);
        } else {
          alert(
            "Vous n'avez pas encore géréné ce document. Vous pouvez le faire dans la section action."
          );
        }
      } else if (doc === "idp") {
        let myAction = this.state.actionsActive.filter(
          action => action.id === id
        );
        let url = myAction[0].option_2;
        if (url !== null) {
          window.open(url);
        } else {
          alert(
            "Vous n'avez pas encore géréné ce document. Vous pouvez le faire dans la section action."
          );
        }
      } else if (doc === "tr") {
        let myAction = this.state.actionsActive.filter(
          action => action.id === id
        );
        let url = myAction[0].option_3;
        if (url !== null) {
          window.open(url);
        } else {
          alert(
            "Vous n'avez pas encore géréné ce document. Vous pouvez le faire dans la section action."
          );
        }
      }
    } else {
      if (doc === "med") {
        let myAction = this.state.actionsNotActive.filter(
          action => action.id === id
        );
        let url = myAction[0].option_1;
        if (url !== null) {
          window.open(url);
        } else {
          alert(
            "Vous n'avez pas encore géréné ce document. Vous pouvez le faire dans la section action."
          );
        }
      } else if (doc === "idp") {
        let myAction = this.state.actionsNotActive.filter(
          action => action.id === id
        );
        let url = myAction[0].option_2;
        if (url !== null) {
          window.open(url);
        } else {
          alert(
            "Vous n'avez pas encore géréné ce document. Vous pouvez le faire dans la section action."
          );
        }
      } else if (doc === "tr") {
        let myAction = this.state.actionsNotActive.filter(
          action => action.id === id
        );
        let url = myAction[0].option_3;
        if (url !== null) {
          window.open(url);
        } else {
          alert(
            "Vous n'avez pas encore géréné ce document. Vous pouvez le faire dans la section action."
          );
        }
      }
    }
  };

  handleDelete = (id, denomination) => {
    if (this.state.checkboxActive === false) {
      // alert(`L'action ${denomination} est déjà clôturée.`);
      confirmAlert({
        title: "Merci de confirmer",
        message: `L'action ${denomination} est clôturée. Êtes-vous sûr de vouloir la rendre active à nouveau?`,
        buttons: [
          {
            label: "Oui",
            onClick: () =>
              Axios.put(`${process.env.REACT_APP_API}/api/actions/${id}`, {
                active: "true"
              })
                .then(response => {
                  Axios.get(`${process.env.REACT_APP_API}/api/actions`)
                    .then(response => {
                      this.setState({
                        actions: response.data,
                        // returns filtered actions
                        actionsActive: response.data.filter(
                          action => action.active === true
                        ),
                        actionsNotActive: response.data.filter(
                          action => action.active === false
                        )
                      });
                    })
                    .catch(error => {
                      console.log(error);
                    });
                  alert(`L'action ${denomination} est de nouveau active.`);
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
    } else {
      confirmAlert({
        title: "Merci de confirmer",
        message: `Voulez-vous vraiment clôturer l'action ${denomination}?`,
        buttons: [
          {
            label: "Oui",
            onClick: () =>
              Axios.put(`${process.env.REACT_APP_API}/api/actions/${id}`, {
                active: "false"
              })
                .then(response => {
                  Axios.get(`${process.env.REACT_APP_API}/api/actions`)
                    .then(response => {
                      this.setState({
                        actions: response.data,
                        // returns filtered actions
                        actionsActive: response.data.filter(
                          action => action.active === true
                        ),
                        actionsNotActive: response.data.filter(
                          action => action.active === false
                        )
                      });
                    })
                    .catch(error => {
                      console.log(error);
                    });

                  alert(`L'action ${denomination} a bien été clôturée.`);
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
    }
  };

  handleCheckbox = () => {
    this.setState({
      checkboxActive: !this.state.checkboxActive
    });
  };

  handleCheckboxDisplay = () => {
    return this.state.checkboxActive ? "actions en cours" : "actions clôturées";
  };

  handleCreancier = actionId => {
    const selectedAction = this.state.actions.filter(a => a.id === actionId);
    const myCreancier = this.state.creanciers.filter(
      c => c.id === selectedAction[0].creancierId
    );
    return myCreancier[0].denomination_sociale;
  };

  handleDebiteur = actionId => {
    const selectedAction = this.state.actions.filter(a => a.id === actionId);
    const myDebiteur = this.state.debiteurs.filter(
      c => c.id === selectedAction[0].debiteurId
    );
    return myDebiteur[0].denomination_sociale;
  };

  render() {
    const actionsActive = this.handleTabSwitch();
    if (
      this.state.creanciers[0] !== undefined &&
      this.state.debiteurs[0] !== undefined &&
      this.state.actions[0] !== undefined
    ) {
      return (
        <div>
          <div className="fl w-100">
            <div className="title_débiteur pl4">
              <h1 className="f2 tc lh-copy"> Historique des actions </h1>
            </div>
            <div className="fl w-100 ">
              <div className="fl w-100 tc">
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

              <div className="fl w-40" />
            </div>
            {/* tableau */}
            <div className="fl w-100 pt2 pl4 pr4 ">
              <div className="overflow-auto">
                <table className="f6 w-100 center" cellSpacing="0">
                  <thead>
                    <tr className="stripe-dark">
                      <th className="fw6 tl pa3 bg-white tc">Créancier</th>
                      <th className="fw6 tl pa3 bg-white tc">Débiteur</th>
                      <th className="fw6 tl pa3 bg-white tc">
                        Nom de l'action
                      </th>
                      <th className="fw6 tl pa3 bg-white tc">
                        Modifier statut
                      </th>
                      <th className="fw6 tl pa3 bg-white tc">
                        Mise en demeure
                      </th>
                      <th className="fw6 tl pa3 bg-white tc">
                        Injonction de payer
                      </th>
                      <th className="fw6 tl pa3 bg-white tc">Tableau recap</th>
                    </tr>
                  </thead>
                  <tbody className="lh-copy">
                    {actionsActive
                      .sort((a, b) => b.id - a.id)
                      .slice(0, 500)
                      .map(action => {
                        return (
                          <tr className="stripe-dark tc" key={`${action.id}`}>
                            <td>{this.handleCreancier(action.id)}</td>
                            <td>{this.handleDebiteur(action.id)}</td>
                            <td>{action.nom_action}</td>
                            <td>
                              <img
                                className="icone pointer"
                                src={supprimer}
                                alt="Modifier le statut de l'action"
                                onClick={() =>
                                  this.handleDelete(
                                    action.id,
                                    action.nom_action
                                  )
                                }
                              />
                            </td>
                            <td>
                              <img
                                className="icone download pointer"
                                src={download}
                                alt="download"
                                onClick={() =>
                                  this.downloadDoc("med", action.id)
                                }
                              />
                            </td>
                            <td>
                              <img
                                className="icone download pointer"
                                src={download}
                                alt="download"
                                onClick={() =>
                                  this.downloadDoc("idp", action.id)
                                }
                              />
                            </td>
                            <td>
                              <img
                                className="icone download pointer"
                                src={download}
                                alt="download"
                                onClick={() =>
                                  this.downloadDoc("tr", action.id)
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    } else
      return (
        <h1 className="f2 tc lh-copy">
          {" "}
          Il n'y a pas encore d'actions dans l'historique.{" "}
        </h1>
      );
  }
}

export default Historique;
