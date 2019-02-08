import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import supprimer from "./Icones_Arigoni/icone_supprimer.png";
import modifier from "./Icones_Arigoni/icone_modifier.png";
import tick from "./Icones_Arigoni/tick.png";
import "./Facture.css";
import "./editaction.css";
import Axios from "axios";
import { cpus } from "os";

class EditAction extends Component {
  state = {
    selectedFacture: undefined,
    isSelected: false,
    isLoaded: false,
    actionFiltered: [],
    facturesFiltered: [],
    acomptesFiltered: [],
    avoirsFiltered: [],
    partielsFiltered: [],
    currentActionWithAllInfo: [],
    myReloadCounter: 0,
    num_commande: "",
    num_confirmation_commande: "",
    num_document_transport: "",
    num_facture: "",
    date_facture: "",
    montant_ht: "",
    montant_ttc: "",
    echeance_facture: "",
    intérets_capitalises: "",
    HTouTTCHono: undefined,
    HTHono: false,
    TTCHono: false,
    HTouTTC: undefined,
    HT: false,
    TTC: false,
    huit: false,
    dix: false,
    points: undefined,
    produits: false,
    services: false,
    honoraires: undefined,
    subtitle: false,
    date_fin: undefined,
    active: true
  };

  handleMyUserInputs = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSelectFacture = (event, id) => {
    if (this.state.isSelected === true && this.state.selectedFacture !== id) {
      alert("Vous ne pouvez sélectionner qu'une facture à la fois.");
      event.stopPropagation();
      event.preventDefault();
    } else {
      if (this.state.selectedFacture === undefined) {
        this.setState({
          selectedFacture: id,
          isSelected: !this.state.isSelected
        });
      } else {
        this.setState({
          selectedFacture: undefined,
          isSelected: !this.state.isSelected
        });
      }
    }
  };

  handleHTouTTC = (event, typeDeCalcul) => {
    if (
      (typeDeCalcul === "HT" && this.state.HTouTTC === "TTC") ||
      (typeDeCalcul === "TTC" && this.state.HTouTTC === "HT")
    ) {
      alert(
        "Vous pouvez sélectionner uniquement HT ou TTC pour le calcul des intérêts."
      );
      event.stopPropagation();
      event.preventDefault();
    } else {
      if (typeDeCalcul === "HT" && this.state.HT === false) {
        this.setState({
          HTouTTC: "HT",
          HT: true,
          TTC: false
        });
      } else if (typeDeCalcul === "HT" && this.state.HT === true) {
        this.setState({
          HTouTTC: "",
          HT: false,
          TTC: false
        });
      } else if (typeDeCalcul === "TTC" && this.state.TTC === false) {
        this.setState({
          HTouTTC: "TTC",
          HT: false,
          TTC: true
        });
      } else {
        this.setState({
          HTouTTC: "",
          HT: false,
          TTC: false
        });
      }
    }
  };

  handleHTouTTCHono = (event, typeDeCalcul) => {
    if (
      (typeDeCalcul === "HT" && this.state.HTouTTCHono === "TTC") ||
      (typeDeCalcul === "TTC" && this.state.HTouTTCHono === "HT")
    ) {
      alert(
        "Vous pouvez sélectionner uniquement HT ou TTC pour le montant de vos honoraires."
      );
      event.stopPropagation();
      event.preventDefault();
    } else {
      if (typeDeCalcul === "HT" && this.state.HTHono === false) {
        this.setState({
          HTouTTCHono: "HT",
          HTHono: true,
          TTCHono: false
        });
      } else if (typeDeCalcul === "HT" && this.state.HTHono === true) {
        this.setState({
          HTouTTCHono: "",
          HTHono: false,
          TTCHono: false
        });
      } else if (typeDeCalcul === "TTC" && this.state.TTCHono === false) {
        this.setState({
          HTouTTCHono: "TTC",
          HTHono: false,
          TTCHono: true
        });
      } else {
        this.setState({
          HTouTTCHono: "",
          HTHono: false,
          TTCHono: false
        });
      }
    }
  };

  handleType = (event, type) => {
    if (type === "produits" && this.state.produits === false) {
      this.setState({
        type: "produits",
        produits: true
      });
    } else if (type === "produits" && this.state.produits === true) {
      this.setState({
        type: "",
        produits: false
      });
    } else if (type === "services" && this.state.services === false) {
      this.setState({
        type: "services",
        services: true
      });
    } else {
      this.setState({
        type: "",
        services: false
      });
    }
  };

  handlePoints = (event, myPoints) => {
    if (
      (myPoints === "8" && this.state.points === "10") ||
      (myPoints === "10" && this.state.points === "8")
    ) {
      alert(
        "Vous pouvez sélectionner uniquement 8 ou 10 points pour le calcul des intérêts. Sinon, merci d'entrer la valeur manuellement."
      );
      event.stopPropagation();
      event.preventDefault();
    } else {
      if (myPoints === "8" && this.state.huit === false) {
        this.setState({
          points: "8",
          huit: true,
          dix: false
        });
      } else if (myPoints === "8" && this.state.huit === true) {
        this.setState({
          points: "",
          huit: false,
          dix: false
        });
      } else if (myPoints === "10" && this.state.dix === false) {
        this.setState({
          points: "10",
          huit: false,
          dix: true
        });
      } else {
        this.setState({
          points: "",
          huit: false,
          dix: false
        });
      }
    }
  };

  handleMed = () => {
    //set today's date
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; // january is 0
    let yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }

    today = dd + "/" + mm + "/" + yyyy; // date for the word document
    let today_file = dd + "-" + mm + "-" + yyyy; // date for the file name
    let creancier_filename = this.props.creancier;
    let debiteur_filename = this.props.debiteur;
    let nom = `${today_file} - Mise en demeure - ${creancier_filename} contre ${debiteur_filename}.docx`;
    Axios.get(
      `${process.env.REACT_APP_API}/api/documents/createMed/${
        this.props.actionId
      }`
    ).then(data =>
      window.open(`https://arigoback.herokuapp.com/documents/${nom}`)
    );
    Axios.put(
      `${process.env.REACT_APP_API}/api/actions/${this.props.actionId}`,
      {
        option_1: `https://arigoback.herokuapp.com/documents/${nom}`
      }
    );
  };

  handleInjonction = () => {
    //set today's date
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; // january is 0
    let yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }

    today = dd + "/" + mm + "/" + yyyy; // date for the word document
    let today_file = dd + "-" + mm + "-" + yyyy; // date for the file name
    let creancier_filename = this.props.creancier;
    let debiteur_filename = this.props.debiteur;
    let nom = `${today_file} - Injonction de payer - ${creancier_filename} contre ${debiteur_filename}.docx`;
    Axios.get(
      `${process.env.REACT_APP_API}/api/documents/createInjonction/${
        this.props.actionId
      }`
    ).then(data =>
      window.open(`https://arigoback.herokuapp.com/documents/${nom}`)
    );
    Axios.put(
      `${process.env.REACT_APP_API}/api/actions/${this.props.actionId}`,
      {
        option_2: `https://arigoback.herokuapp.com/documents/${nom}`
      }
    );
  };

  handleRecap = () => {
    //set today's date
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; // january is 0
    let yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }

    today = dd + "/" + mm + "/" + yyyy; // date for the word document
    let today_file = dd + "-" + mm + "-" + yyyy; // date for the file name
    let creancier_filename = this.props.creancier;
    let debiteur_filename = this.props.debiteur;
    let nom = `${today_file} - Tableau de calcul des intérêts - ${creancier_filename} contre ${debiteur_filename}.docx`;
    Axios.get(
      `${process.env.REACT_APP_API}/api/documents/createRecap/${
        this.props.actionId
      }`
    ).then(data =>
      window.open(`https://arigoback.herokuapp.com/documents/${nom}`)
    );
    Axios.put(
      `${process.env.REACT_APP_API}/api/actions/${this.props.actionId}`,
      {
        option_3: `https://arigoback.herokuapp.com/documents/${nom}`
      }
    );
  };

  handleDelete = (id, denomination, type) => {
    const typeMessageInitial = whatType => {
      if (whatType === "factures") {
        return `Voulez-vous vraiment supprimer cette facture ?`;
      } else if (whatType === "acomptes") {
        return `Voulez-vous vraiment supprimer cet acompte ?`;
      } else if (whatType === "avoirs") {
        return `Voulez-vous vraiment supprimer cet avoir ?`;
      } else if (whatType === "partiels") {
        return `Voulez-vous vraiment supprimer ce paiement partiel ?`;
      }
    };

    const typeMessageConfirm = whatType => {
      if (whatType === "factures") {
        return `La facture ${denomination} a bien été supprimée.`;
      } else if (whatType === "acomptes") {
        return `L'acompte ${denomination} a bien été supprimé.`;
      } else if (whatType === "avoirs") {
        return `L'avoir ${denomination} a bien été supprimé.`;
      } else if (whatType === "partiels") {
        return `Le paiement partiel ${denomination} a bien été supprimé.`;
      }
    };

    const myMessageInitial = typeMessageInitial(type);
    const myMessageConfirm = typeMessageConfirm(type);

    confirmAlert({
      title: "Merci de confirmer",
      message: myMessageInitial,
      buttons: [
        {
          label: "Oui",
          onClick: () =>
            Axios.put(`${process.env.REACT_APP_API}/api/${type}/${id}`, {
              active: "false"
            })
              .then(response => {
                alert(myMessageConfirm);
                console.log(response);
                this.setState({
                  isUpdated: false
                });
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

  handleSaveOptions = () => {
    let myActionId = this.props.actionId;

    if (
      this.state.honoraires !== undefined &&
      this.state.honoraires !== "" &&
      this.state.points !== undefined &&
      (this.state.TTC === true || this.state.HT === true) &&
      (this.state.HTHono === true || this.state.TTCHono === true) &&
      (this.state.produits === true || this.state.services === true) &&
      this.state.date_fin !== undefined
    ) {
      // const getFullCreanceTTC = () => {
      //   let result = this.state.currentActionWithAllInfo;
      //   let getSum = (total, num) => {
      //     return total + num;
      //   };
      //   let totalCreanceTTC = [];

      //   for (let i = 0; i < result.factures.length; i++) {
      //     let maFacture = [];

      //     maFacture.push(result.factures[i].montant_ttc);

      //     let mesAcomptes = [];

      //     for (let j = 0; j < result.factures[i].acomptes.length; j++) {
      //       mesAcomptes.push(result.factures[i].acomptes[j].montant_ttc);
      //     }

      //     let mesAvoirs = [];

      //     for (let k = 0; k < result.factures[i].avoirs.length; k++) {
      //       mesAvoirs.push(result.factures[i].avoirs[k].montant_ttc);
      //     }

      //     let mesPaiementsPartiels = [];

      //     for (let l = 0; l < result.factures[i].partiels.length; l++) {
      //       mesPaiementsPartiels.push(
      //         result.factures[i].partiels[l].montant_ttc
      //       );
      //     }

      //     let totalAcomptes =
      //       mesAcomptes[0] === undefined ? 0 : mesAcomptes.reduce(getSum);
      //     let totalAvoirs =
      //       mesAvoirs[0] === undefined ? 0 : mesAvoirs.reduce(getSum);
      //     let totalPartiels =
      //       mesPaiementsPartiels[0] === undefined
      //         ? 0
      //         : mesPaiementsPartiels.reduce(getSum);

      //     // console.log(
      //     //   result.factures[i].montant_ttc,
      //     //   totalAcomptes,
      //     //   totalAvoirs,
      //     //   totalPartiels
      //     // );

      //     totalCreanceTTC.push(
      //       result.factures[i].montant_ttc -
      //         totalAcomptes -
      //         totalAvoirs -
      //         totalPartiels
      //     );
      //   }
      //   let finalTotalResultCreanceTTC = totalCreanceTTC.reduce(getSum);
      //   if (
      //     finalTotalResultCreanceTTC === null ||
      //     finalTotalResultCreanceTTC === isNaN ||
      //     finalTotalResultCreanceTTC === undefined
      //   ) {
      //     return 0;
      //   } else return finalTotalResultCreanceTTC;
      // };

      const getFullCreanceTTC = () => {
        let result = this.state.currentActionWithAllInfo;
        let factures = result.factures.filter(facture => {
          return facture.active === true;
        });

        let acomptes = factures.map(facture => {
          return facture.acomptes.filter(acompte => {
            return acompte.active === true;
          });
        });

        let avoirs = factures.map(facture => {
          return facture.avoirs.filter(avoir => {
            return avoir.active === true;
          });
        });

        let partiels = factures.map(facture => {
          return facture.partiels.filter(partiel => {
            return partiel.active === true;
          });
        });

        let getSum = (total, num) => {
          return total + num;
        };
        let totalCreanceTTC = [];

        let mesFactures = [];
        for (let i = 0; i < factures.length; i++) {
          mesFactures.push(factures[i].montant_ttc);
        }

        let mesAcomptes = [];
        if (acomptes[0][0] !== undefined) {
          for (let j = 0; j < acomptes[0].length; j++) {
            mesAcomptes.push(acomptes[0][j].montant_ttc);
          }
        }

        let mesAvoirs = [];
        if (avoirs[0][0] !== undefined) {
          for (let k = 0; k < avoirs[0].length; k++) {
            mesAvoirs.push(avoirs[0][k].montant_ttc);
          }
        }

        let mesPaiementsPartiels = [];
        if (partiels[0][0] !== undefined) {
          for (let l = 0; l < partiels[0].length; l++) {
            mesPaiementsPartiels.push(partiels[0][l].montant_ttc);
          }
        }

        let totalFactures =
          mesFactures[0] === undefined ? 0 : mesFactures.reduce(getSum);
        let totalAcomptes =
          mesAcomptes[0] === undefined ? 0 : mesAcomptes.reduce(getSum);
        let totalAvoirs =
          mesAvoirs[0] === undefined ? 0 : mesAvoirs.reduce(getSum);
        let totalPartiels =
          mesPaiementsPartiels[0] === undefined
            ? 0
            : mesPaiementsPartiels.reduce(getSum);

        totalCreanceTTC =
          totalFactures - totalAcomptes - totalAvoirs - totalPartiels;
        // console.log(totalCreanceTTC);

        // let finalTotalResultCreanceHT = totalCreanceTTC.reduce(getSum);
        if (
          totalCreanceTTC === null ||
          totalCreanceTTC === isNaN ||
          totalCreanceTTC === undefined
        ) {
          return 0;
        } else return totalCreanceTTC;
      };

      const getFullCreanceHT = () => {
        let result = this.state.currentActionWithAllInfo;
        let factures = result.factures.filter(facture => {
          return facture.active === true;
        });

        let acomptes = factures.map(facture => {
          return facture.acomptes.filter(acompte => {
            return acompte.active === true;
          });
        });

        let avoirs = factures.map(facture => {
          return facture.avoirs.filter(avoir => {
            return avoir.active === true;
          });
        });

        let partiels = factures.map(facture => {
          return facture.partiels.filter(partiel => {
            return partiel.active === true;
          });
        });

        let getSum = (total, num) => {
          return total + num;
        };
        let totalCreanceHT = [];

        let mesFactures = [];
        for (let i = 0; i < factures.length; i++) {
          mesFactures.push(factures[i].montant_ht);
        }

        let mesAcomptes = [];
        if (acomptes[0][0] !== undefined) {
          for (let j = 0; j < acomptes[0].length; j++) {
            mesAcomptes.push(acomptes[0][j].montant_ht);
          }
        }

        let mesAvoirs = [];
        if (avoirs[0][0] !== undefined) {
          for (let k = 0; k < avoirs[0].length; k++) {
            mesAvoirs.push(avoirs[0][k].montant_ht);
          }
        }

        let mesPaiementsPartiels = [];
        if (partiels[0][0] !== undefined) {
          for (let l = 0; l < partiels[0].length; l++) {
            mesPaiementsPartiels.push(partiels[0][l].montant_ht);
          }
        }

        let totalFactures =
          mesFactures[0] === undefined ? 0 : mesFactures.reduce(getSum);
        let totalAcomptes =
          mesAcomptes[0] === undefined ? 0 : mesAcomptes.reduce(getSum);
        let totalAvoirs =
          mesAvoirs[0] === undefined ? 0 : mesAvoirs.reduce(getSum);
        let totalPartiels =
          mesPaiementsPartiels[0] === undefined
            ? 0
            : mesPaiementsPartiels.reduce(getSum);

        totalCreanceHT =
          totalFactures - totalAcomptes - totalAvoirs - totalPartiels;
        // console.log(totalCreanceHT);

        // let finalTotalResultCreanceHT = totalCreanceHT.reduce(getSum);
        if (
          totalCreanceHT === null ||
          totalCreanceHT === isNaN ||
          totalCreanceHT === undefined
        ) {
          return 0;
        } else return totalCreanceHT;
      };

      let myFullCreanceTTC = getFullCreanceTTC();
      let myFullCreanceHT = getFullCreanceHT();

      // console.log(myFullCreanceTTC, myFullCreanceHT);

      confirmAlert({
        title: "Merci de confirmer",
        message: "Etes vous sûr de vouloir sauvegarder ces options ?",
        buttons: [
          {
            label: "Oui",
            onClick: () =>
              Axios.put(
                `${process.env.REACT_APP_API}/api/actions/${myActionId}`,
                {
                  honoraires: this.state.honoraires,
                  option_ttc_hono: this.state.TTCHono,
                  option_ttc_factures: this.state.TTC,
                  produits: this.state.produits,
                  services: this.state.services,
                  taux_interets: this.state.points,
                  date: this.state.date_fin,
                  calcul_solde_du: myFullCreanceHT, // full creance en HT
                  calcul_total_creance: myFullCreanceTTC // full creance en TTC
                }
              )
                .then(response => {
                  alert("Vos options ont bien été sauvegardées.");
                  console.log(response);
                  // this.setState({
                  // isUpdated: false
                  // });
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
      alert("Merci de cocher toutes les options pour poursuivre.");
    }
  };

  handleAcomptesAvoirs = () => {
    const myAcomptes = this.state.acomptesFiltered.filter(
      ac => ac.factureId === this.state.selectedFacture
    );
    const myAvoirs = this.state.avoirsFiltered.filter(
      av => av.factureId === this.state.selectedFacture
    );
    const myPartiels = this.state.partielsFiltered.filter(
      pa => pa.factureId === this.state.selectedFacture
    );
    if (this.state.isSelected !== true) {
      return (
        <p className="f2 lh-title tc">
          Merci de sélectionner une facture pour visualiser les paiements
          associés
        </p>
      );
    } else {
      return (
        <div>
          <p className="f2 mt3 mb2 lh-title tc">
            Liste des paiements liés à cette facture
          </p>
          <div className="acompte">
            <div className="fl w-60">
              <div className="title_créancier pl4">
                <h2 className="pt2 f4 lh-copy">Liste des acomptes</h2>
              </div>
            </div>

            {/* tableau */}
            <div className=" tableau fl w-100 pa4 tc">
              <div className="overflow-auto">
                <table className="f6 w-100 center tc" cellSpacing="0">
                  <thead>
                    <tr className="stripe-dark">
                      <th className="tc">N° acompte</th>
                      <th className="tc">Date</th>
                      <th className="tc">montant HT</th>
                      <th className="tc">montant TTC</th>
                      <th className="tc">Modifier</th>
                      <th className="tc">Supprimer</th>
                    </tr>
                  </thead>
                  <tbody className="lh-copy">
                    {myAcomptes
                      .sort((a, b) => b.id - a.id)
                      .slice(0, 50)
                      .map(acompte => {
                        return (
                          <tr
                            className="stripe-dark"
                            key={`${acompte.num_acompte}`}
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
                                      0,
                                      0,
                                      this.props.actionId,
                                      this.props.creancier,
                                      this.props.debiteur,
                                      this.state.selectedFacture,
                                      acompte.id
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
                                    acompte.id,
                                    acompte.num_acompte,
                                    "acomptes"
                                  )
                                }
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
                    onClick={() =>
                      this.props.pageChangeSub(
                        "FormAcompte",
                        0,
                        0,
                        this.props.actionId,
                        this.props.creancier,
                        this.props.debiteur,
                        this.state.selectedFacture
                      )
                    }
                  >
                    Créer un acompte
                  </NavLink>
                </div>
              </div>
            </div>
          </div>

          <div className="fl w-100">
            <div className="avoir">
              <div className="fl w-60">
                <div className="title_créancier pl4">
                  <h2 className="pt2 f4 lh-copy">Liste des avoirs</h2>
                </div>
              </div>

              {/* tableau */}
              <div className=" tableau fl w-100 pa4 tc">
                <div className="overflow-auto">
                  <table className="f6 w-100 center tc" cellSpacing="0">
                    <thead>
                      <tr className="stripe-dark">
                        <th className="tc">N° avoir</th>
                        <th className="tc">Date</th>
                        <th className="tc">montant HT</th>
                        <th className="tc">montant TTC</th>
                        <th className="tc">Modifier</th>
                        <th className="tc">Supprimer</th>
                      </tr>
                    </thead>
                    <tbody className="lh-copy">
                      {myAvoirs
                        .sort((a, b) => b.id - a.id)
                        .slice(0, 50)
                        .map(avoir => {
                          return (
                            <tr
                              className="stripe-dark"
                              key={`${avoir.num_avoir}`}
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
                                        0,
                                        0,
                                        this.props.actionId,
                                        this.props.creancier,
                                        this.props.debiteur,
                                        this.state.selectedFacture,
                                        0,
                                        avoir.id
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
                                      avoir.id,
                                      avoir.num_avoir,
                                      "avoirs"
                                    )
                                  }
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
                      onClick={() =>
                        this.props.pageChangeSub(
                          "FormAvoir",
                          0,
                          0,
                          this.props.actionId,
                          this.props.creancier,
                          this.props.debiteur,
                          this.state.selectedFacture
                        )
                      }
                    >
                      Créer un avoir
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="fl w-100">
            <div className="avoir">
              <div className="fl w-60">
                <div className="title_créancier pl4">
                  <h2 className="pt2 f4 lh-copy">
                    Liste des autres paiements partiels
                  </h2>
                </div>
              </div>

              {/* tableau */}
              <div className=" tableau fl w-100 pa4 tc">
                <div className="overflow-auto">
                  <table className="f6 w-100 center tc" cellSpacing="0">
                    <thead>
                      <tr className="stripe-dark">
                        <th className="tc">N° paiement</th>
                        <th className="tc">Date</th>
                        <th className="tc">montant HT</th>
                        <th className="tc">montant TTC</th>
                        <th className="tc">Modifier</th>
                        <th className="tc">Supprimer</th>
                      </tr>
                    </thead>
                    <tbody className="lh-copy">
                      {myPartiels
                        .sort((a, b) => b.id - a.id)
                        .slice(0, 50)
                        .map(partiel => {
                          return (
                            <tr
                              className="stripe-dark"
                              key={`${partiel.num_partiel}`}
                            >
                              <td>{partiel.num_partiel}</td>
                              <td>{partiel.date_partiel}</td>
                              <td>{partiel.montant_ht}</td>
                              <td>{partiel.montant_ttc}</td>
                              <td>
                                <NavLink to="/dashboard/formPartiel">
                                  <img
                                    className="icone pointer"
                                    src={modifier}
                                    alt="modifier"
                                    onClick={() =>
                                      this.props.pageChangeSub(
                                        "FormPartiel",
                                        0,
                                        0,
                                        this.props.actionId,
                                        this.props.creancier,
                                        this.props.debiteur,
                                        this.state.selectedFacture,
                                        0,
                                        0,
                                        partiel.id
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
                                      partiel.id,
                                      partiel.num_partiel,
                                      "partiels"
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>

                  <div className="buttonavoir tc pt4">
                    <NavLink
                      to="/dashboard/formPartiel"
                      className="f6 link dim br1 ph3 pv2 mt2 mb4 dib white bg-dark-blue "
                      onClick={() =>
                        this.props.pageChangeSub(
                          "FormPartiel",
                          0,
                          0,
                          this.props.actionId,
                          this.props.creancier,
                          this.props.debiteur,
                          this.state.selectedFacture
                        )
                      }
                    >
                      Créer un paiement partiel
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  componentDidMount() {
    Axios.get(`${process.env.REACT_APP_API}/api/actions`)
      .then(response => {
        this.setState({
          actionFiltered: response.data.filter(
            action => action.id === this.props.actionId
          ),
          subtitle: true
        });
      })
      .catch(error => {
        console.log(error);
      });
    Axios.get(`${process.env.REACT_APP_API}/api/factures`)
      .then(response => {
        this.setState({
          facturesFiltered: response.data
            .filter(facture => facture.active)
            .filter(facture => facture.actionId === this.props.actionId)
        });
      })
      .catch(error => {
        console.log(error);
      });
    // const filterByID = item => {
    //   let length = this.state.facturesFiltered.length;
    //   for (let i = 0; i < length; i++) {
    //     if (item.factureId === this.state.facturesFiltered[i].id) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   }
    // };
    Axios.get(`${process.env.REACT_APP_API}/api/acomptes`)
      .then(response => {
        this.setState({
          acomptesFiltered: response.data.filter(acompte => acompte.active)
          // .filter(filterByID)
        });
      })
      .catch(error => {
        console.log(error);
      });
    Axios.get(`${process.env.REACT_APP_API}/api/avoirs`)
      .then(response => {
        this.setState({
          avoirsFiltered: response.data.filter(avoir => avoir.active),
          // .filter(filterByID),
          isLoaded: true
        });
      })
      .catch(error => {
        console.log(error);
      });
    Axios.get(`${process.env.REACT_APP_API}/api/partiels`)
      .then(response => {
        this.setState({
          partielsFiltered: response.data.filter(partiel => partiel.active)
          // .filter(filterByID)
        });
      })
      .catch(error => {
        console.log(error);
      });
    Axios.get(`${process.env.REACT_APP_API}/api/actions/${this.props.actionId}`)
      .then(response => {
        this.setState({
          currentActionWithAllInfo: response.data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleSubTitle = () => {
    if (this.state.subtitle === true) {
      let nom_action = this.state.actionFiltered[0].nom_action;
      let creancier = this.props.creancier;
      let debiteur = this.props.debiteur;
      return (
        <div>
          {nom_action}: {creancier} vs. {debiteur}
        </div>
      );
    } else return null;
  };

  tick = () => {
    if (this.state.points !== undefined) {
      return <img className="icone pl2" src={tick} alt="ok" />;
    } else {
      return null;
    }
  };

  tick2 = () => {
    if (this.state.HTouTTC === "HT") {
      return (
        <div>
          <span>Les calculs seront effectués sur les montants HT</span>
          <img className="icone pl2 pt4" src={tick} alt="ok" />
        </div>
      );
    } else if (this.state.HTouTTC === "TTC") {
      return (
        <div>
          <span>Les calculs seront effectués sur les montants TTC</span>
          <img className="icone pl2 pt4" src={tick} alt="ok" />
        </div>
      );
    } else return null;
  };

  tick3 = () => {
    if (this.state.produits === true && this.state.services === true) {
      return (
        <div>
          <span>
            La transaction concerne des produits vendus et des services fournis
          </span>
          <img className="icone pl2 pt4" src={tick} alt="ok" />
        </div>
      );
    } else if (this.state.services === true) {
      return (
        <div>
          <span>La transaction concerne des services fournis</span>
          <img className="icone pl2 pt4" src={tick} alt="ok" />
        </div>
      );
    } else if (this.state.produits === true) {
      return (
        <div>
          <span>La transaction concerne des produits vendus</span>
          <img className="icone pl2 pt4" src={tick} alt="ok" />
        </div>
      );
    } else
      return (
        <p className="pt4">
          La transaction concerne-t-elle des produits vendus, des services
          fournis, ou les deux ?
        </p>
      );
  };

  tick4 = () => {
    if (
      this.state.HTouTTCHono === "HT" &&
      this.state.honoraires !== undefined &&
      this.state.honoraires !== ""
    ) {
      return (
        <div>
          <span>
            Le montant de vos honoraires est de {this.state.honoraires} € HT
          </span>
          <img className="icone pl2 pt4" src={tick} alt="ok" />
        </div>
      );
    } else if (
      this.state.HTouTTCHono === "TTC" &&
      this.state.honoraires !== undefined &&
      this.state.honoraires !== ""
    ) {
      return (
        <div>
          <span>
            Le montant de vos honoraires est de {this.state.honoraires} € TTC
          </span>
          <img className="icone pl2 pt4" src={tick} alt="ok" />
        </div>
      );
    } else return null;
  };

  tick5 = () => {
    if (this.state.date_fin === undefined || this.state.date_fin === "") {
      return (
        <div>
          <p className="pt4">
            Merci de rentrer une date au format (JJ/MM/AAAA) ex: 20/12/2018
          </p>
        </div>
      );
    } else if (this.state.date_fin !== undefined) {
      return (
        <div>
          <span>
            La date de fin de calcul des intérêts est le {this.state.date_fin}.
          </span>
          <img className="icone pl2 pt4" src={tick} alt="ok" />
        </div>
      );
    } else return null;
  };

  tick6 = () => {
    if (
      this.state.honoraires !== undefined &&
      this.state.honoraires !== "" &&
      this.state.points !== undefined &&
      (this.state.TTC === true || this.state.HT === true) &&
      (this.state.HTHono === true || this.state.TTCHono === true) &&
      (this.state.produits === true || this.state.services === true) &&
      this.state.date_fin !== undefined
    ) {
      return (
        <div>
          <span>Toutes les options sont bien sélectionnées.</span>
          <img className="icone pl2 pt4" src={tick} alt="ok" />
        </div>
      );
    } else {
      return (
        <div>
          <p className="pt4">
            Veuillez sélectionner toutes les options avant de sauvegarder.
          </p>
        </div>
      );
    }
  };

  handlePreviousInfo = () => {
    if (this.state.actionFiltered[0].honoraires !== null) {
      let hono =
        this.state.actionFiltered[0].option_ttc_hono === true ? "TTC" : "HT";
      let calcul =
        this.state.actionFiltered[0].option_ttc_factures === true
          ? "TTC"
          : "HT";
      let produits =
        this.state.actionFiltered[0].produits === true
          ? "- produits vendus"
          : null;
      let services =
        this.state.actionFiltered[0].services === true
          ? "- services fournis"
          : null;
      return (
        <div className="fl w-100 pt3 tc">
          <p className="f4 underline">
            Les options préalablement sauvegardées pour cette action sont les
            suivantes:
          </p>
          <ul>
            <li className="noStyleForLists">
              - Intérêts calculés avec le taux de la BCE +{" "}
              {this.state.actionFiltered[0].taux_interets} points.
            </li>
            <li className="noStyleForLists">
              - Intérêts calculés sur les montants {calcul} des documents.
            </li>
            <li className="noStyleForLists">
              - Transaction concernant des: {produits} {services}.
            </li>
            <li className="noStyleForLists">
              - Honoraires de mon cabinet pour cette action:{" "}
              {this.state.actionFiltered[0].honoraires} € {hono}.
            </li>
            <li className="noStyleForLists">
              - Date de fin de calcul des intérêts:{" "}
              {this.state.actionFiltered[0].date}.
            </li>
          </ul>
        </div>
      );
    }
  };

  componentDidUpdate() {
    if (
      this.state.isUpdated === false &&
      this.state.actionFiltered !== undefined
    ) {
      Axios.get(`${process.env.REACT_APP_API}/api/factures`)
        .then(response => {
          this.setState({
            facturesFiltered: response.data
              .filter(facture => facture.active)
              .filter(facture => facture.actionId === this.props.actionId),
            isUpdated: true
          });
        })
        .catch(error => {
          console.log(error);
        });
      // const filterByID = item => {
      //   let length = this.state.facturesFiltered.length;
      //   for (let i = 0; i < length; i++) {
      //     if (item.factureId === this.state.facturesFiltered[i].id) {
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   }
      // };
      Axios.get(`${process.env.REACT_APP_API}/api/acomptes`)
        .then(response => {
          this.setState({
            acomptesFiltered: response.data.filter(acompte => acompte.active),
            isUpdated: true
            // .filter(filterByID)
          });
        })
        .catch(error => {
          console.log(error);
        });
      Axios.get(`${process.env.REACT_APP_API}/api/avoirs`)
        .then(response => {
          this.setState({
            avoirsFiltered: response.data.filter(avoir => avoir.active),
            // .filter(filterByID),
            isUpdated: true,
            isLoaded: true
          });
        })
        .catch(error => {
          console.log(error);
        });
      Axios.get(`${process.env.REACT_APP_API}/api/partiels`)
        .then(response => {
          this.setState({
            partielsFiltered: response.data.filter(partiel => partiel.active)
            // .filter(filterByID)
          });
        })
        .catch(error => {
          console.log(error);
        });
      Axios.get(
        `${process.env.REACT_APP_API}/api/actions/${this.props.actionId}`
      ).then(response => {
        this.setState({
          currentActionWithAllInfo: response.data
        });
      });
    }
  }

  render() {
    const myFactures = this.state.facturesFiltered;

    if (this.state.isLoaded === true && this.state.subtitle === true) {
      return (
        <div className="Factureimpayee ml4">
          <div className="fl w-100 tc">
            <p className="f1 mt4 mb4">Centre de gestion des actions</p>
            <p className="f2 mt3 mb2 lh-title">{this.handleSubTitle()}</p>
          </div>

          <div className="facture">
            <div className="fl w-60">
              <div className="title_créancier pl4">
                <h2 className="pt4 f4 lh-copy">Liste des factures</h2>
              </div>
            </div>

            {/* tableau */}
            <div className=" tableau fl w-100 pa4 tc">
              <div className="overflow-auto">
                <table className="f6 w-100 center tc" cellSpacing="0">
                  <thead>
                    <tr className="stripe-dark">
                      <th className="tc">N° facture </th>
                      <th className="tc">Date de facture </th>

                      <th className="tc">Montant TTC </th>
                      <th className="tc">Echéance facture </th>

                      <th className="tc">Modifier</th>
                      <th className="tc">Supprimer</th>

                      <th className="tc">Sélectionner</th>
                    </tr>
                  </thead>
                  <tbody className="lh-copy">
                    {myFactures
                      .sort((a, b) => b.id - a.id)
                      .slice(0, 50)
                      .map(facture => {
                        return (
                          <tr
                            className="stripe-dark"
                            key={`${facture.num_facture}`}
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
                                      0,
                                      0,
                                      this.props.actionId,
                                      this.props.creancier,
                                      this.props.debiteur,
                                      facture.id
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
                                    facture.id,
                                    facture.num_facture,
                                    "factures"
                                  )
                                }
                              />
                            </td>
                            <td>
                              {/* <form> */}
                              <input
                                type="checkbox"
                                className="autreInput"
                                onClick={e =>
                                  this.handleSelectFacture(e, facture.id)
                                }
                                // name="selectFacture"
                                // value="selectFacture"
                                // id="selectFacture"
                              />
                              {/* <label for="selectFacture" /> */}
                              {/* </form> */}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>

                <div className="buttonfacture tc pt4">
                  <NavLink
                    to="/dashboard/formFacture"
                    className="f6 link dim br1 ph3 pv2 mt2 dib white bg-dark-blue "
                    onClick={() =>
                      this.props.pageChangeSub(
                        "FormFacture",
                        0,
                        0,
                        this.props.actionId,
                        this.props.creancier,
                        this.props.debiteur
                      )
                    }
                  >
                    Créer une facture
                  </NavLink>
                </div>
              </div>
            </div>
          </div>

          <div className="fl w-100">{this.handleAcomptesAvoirs()}</div>
          <div className="fl w-100 bt">
            <p className="f2 lh-title tc">Options supplémentaires</p>
            <div className="fl w-50 pa2 tc">
              <p className="f3">Choisir le taux d'intérêt appliqué:</p>
              <div className="pt4">
                <input
                  type="checkbox"
                  name="8points"
                  className="autreInput"
                  onClick={e => this.handlePoints(e, "8")}
                />
                <label for="8points">BCE + 8 points</label>
              </div>
              <div className="pt4">
                <input
                  type="checkbox"
                  name="10points"
                  className="autreInput"
                  onClick={e => this.handlePoints(e, "10")}
                />
                <label for="10points">BCE + 10 points</label>
              </div>
              <div className="pl3 pt4">
                <span className="pr2">
                  Le taux retenu sera de celui de la BCE +
                </span>
                <input
                  type="text"
                  className="autreInput2"
                  name="points"
                  onChange={this.handleMyUserInputs}
                  value={this.state.points}
                />
                <span className="pl2"> points</span>
                {this.tick()}
              </div>
            </div>
            <div className="fl w-50 pa2 tc">
              <p className="f3">Choisir le montant appliqué au calcul:</p>
              <div className="pt4">
                <input
                  type="checkbox"
                  name="ht"
                  className="autreInput"
                  onClick={e => this.handleHTouTTC(e, "HT")}
                />
                <label for="8points">HT</label>
              </div>
              <div className="pt4">
                <input
                  type="checkbox"
                  name="ttc"
                  className="autreInput"
                  onClick={e => this.handleHTouTTC(e, "TTC")}
                />
                <label for="10points">TTC</label>
              </div>
              {this.tick2()}
            </div>
            <div className="fl w-100 pt3">
              <div className="fl w-50 pa2 tc">
                <p className="f3">Choisir le type de transaction concerné:</p>
                <div className="pt4">
                  <input
                    type="checkbox"
                    name="produits"
                    className="autreInput"
                    onClick={e => this.handleType(e, "produits")}
                  />
                  <label for="produits">Produits vendus</label>
                </div>
                <div className="pt4">
                  <input
                    type="checkbox"
                    name="services"
                    className="autreInput"
                    onClick={e => this.handleType(e, "services")}
                  />
                  <label for="services">Services fournis</label>
                </div>
                {this.tick3()}
              </div>
              <div className="fl w-50 pa2 tc">
                <p className="f3">Choisir le montant de mes honoraires:</p>
                <div className="pt4 pl3">
                  <input
                    type="text"
                    name="honoraires"
                    onChange={this.handleMyUserInputs}
                    className="autreInput3"
                  />
                  <label for="honoraires"> Euros.</label>
                </div>
                <div className="dib pt3">
                  <input
                    type="checkbox"
                    name="ht"
                    className="autreInput"
                    onClick={e => this.handleHTouTTCHono(e, "HT")}
                  />
                  <label for="ht">HT</label>
                </div>
                <div className="dib">
                  <input
                    type="checkbox"
                    name="ttc"
                    className="autreInput"
                    onClick={e => this.handleHTouTTCHono(e, "TTC")}
                  />
                  <label for="ttc">TTC</label>
                </div>
                {this.tick4()}
              </div>
            </div>

            <div className="fl w-100 pt3">
              <div className="fl w-50 pa2 tc">
                <p className="f3">
                  Choisir la date finale de calcul des intérêts:
                </p>
                <div className="pt4 pl3">
                  <input
                    type="text"
                    name="date_fin"
                    onChange={this.handleMyUserInputs}
                    className="autreInput4"
                  />
                  <label for="date_fin" />
                  {this.tick5()}
                </div>
              </div>
              <div className="fl w-50 pa2 tc">
                <p className="f3">Sauvegarder mes options:</p>
                <div className="fl w-100 pt2 tc">
                  <span
                    className="f6 link dim br1 ph3 pv2 mt4 dib white bg-dark-blue"
                    href="#0"
                    onClick={() => this.handleSaveOptions()}
                  >
                    Sauvegarder
                  </span>
                  {this.tick6()}
                </div>
              </div>

              {this.handlePreviousInfo()}
            </div>

            <div className="fl w-100 pt3 pb4">
              <p className="f2 lh-title tc bt pt4 ">Génération des documents</p>
              <div className="fl w-third pa2 tc">
                <div className="">
                  <span
                    className="f6 link dim br1 ph3 pv2 mt4 mb4 mr6 dib white bg-dark-blue"
                    href="#0"
                    onClick={() => this.handleMed()}
                  >
                    Générer mise en demeure
                  </span>
                </div>
              </div>
              <div className="fl w-third pa2 tc">
                <div className="">
                  <span
                    className="f6 link dim br1 ph3 pv2 mt4 mb4 mr6 dib white bg-dark-blue"
                    href="#0"
                    onClick={() => this.handleInjonction()}
                  >
                    Générer injonction de payer
                  </span>
                </div>
              </div>
              <div className="fl w-third pa2 tc">
                <div className="">
                  <span
                    className="f6 link dim br1 ph3 pv2 mt4 mb4 mr6 dib white bg-dark-blue"
                    href="#0"
                    onClick={() => this.handleRecap()}
                  >
                    Générer tableau récapitulatif
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else return null;
  }
}

export default EditAction;
