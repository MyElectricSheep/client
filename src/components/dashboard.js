import React, { Component } from "react";
import Compte from "./compte";
import Creanciers from "./creanciers";
import Debiteurs from "./debiteurs";
import Historique from "./Historique";
import Actions from "./actions";
import Header from "./Header";
import Nav from "./Nav";
import Formulairecreancier from "./formulairecreancier";
import Formulairedebiteur from "./formulairedebiteur";
import "./dashboard.css";
import Formulairefacture from "./formulairefacture";
import Formulairecompte from "./formulairecompte";
import EditAction from "./EditAction";
import Formulaireacompte from "./formulaireacompte";
import Formulairepartiel from "./formulairepartiel";
import FormulaireAvoirs from "./formulaireavoir";

class Dashboard extends Component {
  state = {
    activePage: "Compte",
    activeCreancier: "",
    creancierId: undefined,
    activeDebiteur: "",
    debiteurId: undefined,
    actionId: undefined
  };

  handlePageChange = (
    activePage,
    creancierId,
    debiteurId,
    actionId,
    creancier,
    debiteur,
    facture,
    acompte,
    avoir,
    partiel
  ) => {
    this.setState({
      activePage: activePage,
      activeCreancier: creancier,
      creancierId: creancierId,
      activeDebiteur: debiteur,
      debiteurId: debiteurId,
      actionId: actionId,
      factureId: facture,
      acompteId: acompte,
      avoirId: avoir,
      partielId: partiel
    });
  };

  handleDisplay = () => {
    if (this.state.activePage === "Compte") {
      return <Compte pageChangeSub={this.handlePageChange} />;
    } else if (this.state.activePage === "formulairecompte") {
      return <Formulairecompte pageChangeSub={this.handlePageChange} />;
    } else if (this.state.activePage === "Debiteurs") {
      return <Debiteurs pageChangeSub={this.handlePageChange} />;
    } else if (this.state.activePage === "Creanciers") {
      return <Creanciers pageChangeSub={this.handlePageChange} />;
    } else if (this.state.activePage === "Actions") {
      return <Actions pageChangeSub={this.handlePageChange} />;
    } else if (this.state.activePage === "Historique") {
      return <Historique pageChangeSub={this.handlePageChange} />;
    } else if (this.state.activePage === "FormFacture") {
      return (
        <Formulairefacture
          actionId={this.state.actionId}
          pageChangeSub={this.handlePageChange}
          creancier={this.state.activeCreancier}
          debiteur={this.state.activeDebiteur}
          facture={this.state.factureId}
        />
      );
    } else if (this.state.activePage === "FormAcompte") {
      return (
        <Formulaireacompte
          actionId={this.state.actionId}
          acompteId={this.state.acompteId}
          pageChangeSub={this.handlePageChange}
          creancier={this.state.activeCreancier}
          debiteur={this.state.activeDebiteur}
          facture={this.state.factureId}
        />
      );
    } else if (this.state.activePage === "FormPartiel") {
      return (
        <Formulairepartiel
          actionId={this.state.actionId}
          partielId={this.state.partielId}
          pageChangeSub={this.handlePageChange}
          creancier={this.state.activeCreancier}
          debiteur={this.state.activeDebiteur}
          facture={this.state.factureId}
        />
      );
    } else if (this.state.activePage === "FormAvoir") {
      return (
        <FormulaireAvoirs
          actionId={this.state.actionId}
          avoirId={this.state.avoirId}
          pageChangeSub={this.handlePageChange}
          creancier={this.state.activeCreancier}
          debiteur={this.state.activeDebiteur}
          facture={this.state.factureId}
        />
      );
    } else if (this.state.activePage === "FormCreancier") {
      return (
        <Formulairecreancier
          creancierId={this.state.creancierId}
          pageChangeSub={this.handlePageChange}
        />
      );
    } else if (this.state.activePage === "FormDebiteur") {
      return (
        <Formulairedebiteur
          debiteurId={this.state.debiteurId}
          pageChangeSub={this.handlePageChange}
        />
      );
    } else if (this.state.activePage === "EditAction") {
      return (
        <EditAction
          actionId={this.state.actionId}
          creancier={this.state.activeCreancier}
          debiteur={this.state.activeDebiteur}
          pageChangeSub={this.handlePageChange}
        />
      );
    } else {
      return "Page non existante";
    }
  };

  render() {
    if (this.state.activePage != null) {
      return (
        <div>
          <div className="fl w-20 fixed">
            <Nav pageChange={this.handlePageChange} />
          </div>
          <div className="fl w-80 ml-20">
            <Header />

            {this.handleDisplay()}
          </div>
        </div>
      );
    }
  }
}

export default Dashboard;
