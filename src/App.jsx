import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import Chart from "chart.js/auto";
import logoJadci from "./assets/logo-jadci.png";
import heroJeunesse1 from "./assets/hero-jeunesse-1.jpg";
import heroJeunesse2 from "./assets/hero-jeunesse-2.jpg";
import heroJeunesse3 from "./assets/hero-jeunesse-3.jpg";
import "./App.css";

/* ================================================================== */
/* DONNÉES DE RÉFÉRENCE */
/* ================================================================== */

const heroBackgrounds = [heroJeunesse1, heroJeunesse2, heroJeunesse3];

const eglisesInitiales = [
  {
    id: 1,
    nom: "AD Temple de la Grâce",
    pasteur: "Pasteur Adama KONÉ",
    telephone: "+225 07 07 00 01 02",
    ville: "Abidjan",
    commune: "Cocody",
    quartier: "Riviera 2",
    localisation: "https://maps.google.com/?q=Cocody+Riviera+2+Abidjan",
    statut: "VALIDÉE",
    responsableId: null,
  },
  {
    id: 2,
    nom: "AD Temple de la Gloire",
    pasteur: "Pasteur Jean KOUASSI",
    telephone: "+225 05 05 00 03 04",
    ville: "Abidjan",
    commune: "Yopougon",
    quartier: "Selmer",
    localisation: "https://maps.google.com/?q=Yopougon+Selmer+Abidjan",
    statut: "VALIDÉE",
    responsableId: null,
  },
  {
    id: 3,
    nom: "AD Temple de la Victoire",
    pasteur: "Pasteur Emmanuel YAO",
    telephone: "+225 01 01 00 05 06",
    ville: "Bouaké",
    commune: "Bouaké",
    quartier: "Commerce",
    localisation: "https://maps.google.com/?q=Bouake+Commerce",
    statut: "VALIDÉE",
    responsableId: null,
  },
];

const produitsInitiaux = [
  {
    id: 1,
    nom: "Livre d'étude Biblique JADCI",
    categorie: "LIVRES",
    prix: 5000,
    description: "Guide complet pour l'affermissement de la jeunesse chrétienne.",
    stock: 25,
    image: "",
  },
  {
    id: 2,
    nom: "Polo Officiel JADCI",
    categorie: "VÊTEMENTS",
    prix: 10000,
    description: "Polo officiel brodé aux couleurs du mouvement JADCI.",
    stock: 15,
    image: "",
  },
  {
    id: 3,
    nom: "Mug Personnalisé JADCI",
    categorie: "GADGETS",
    prix: 3500,
    description: "Mug officiel en céramique pour vos moments de pause.",
    stock: 30,
    image: "",
  },
  {
    id: 4,
    nom: "Carte Membre Jeune JADCI",
    categorie: "SERVICES",
    prix: 1000,
    description: "Carte physique officielle avec votre matricule unique.",
    stock: 100,
    image: "",
  },
];

const articlesInitiaux = [
  {
    id: 1,
    titre: "Bienvenue sur la plateforme officielle JADCI",
    contenu:
      "Retrouvez ici les actualités, événements, vidéos et ressources pour l'épanouissement spirituel et social de la jeunesse.",
    image: "",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    documentUrl: "",
    datePublication: new Date().toISOString().slice(0, 10),
    categorie: "ACTUALITÉ",
  },
];

const directInitial = {
  actif: false,
  titre: "Direct Officiel JADCI",
  sousTitre: "Suivez en direct nos cultes, rassemblements et conférences.",
  facebookUrl: "https://facebook.com/JADCI",
  youtubeUrl: "https://youtube.com/@JADCI",
};

const comptesAdmin = [
  {
    matricule: "AGENT-X-26",
    motDePasse: "JADCI-X-2026",
    role: "GENERAL",
    label: "Administrateur Général",
  },
  {
    matricule: "ADM-MKT-26",
    motDePasse: "Treso-Store-26",
    role: "MARKETING",
    label: "Admin Marketing",
  },
  {
    matricule: "CO-ADM-26",
    motDePasse: "JADCI-Com26",
    role: "COM",
    label: "Admin Communication",
  },
];

/* ================================================================== */
/* UTILITAIRES */
/* ================================================================== */

function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error(`Erreur lors de la sauvegarde de ${key}`);
    }
  }, [key, value]);

  return [value, setValue];
}

const lireFichierEnBase64 = (fichier) =>
  new Promise((resolve, reject) => {
    if (!fichier) {
      resolve("");
      return;
    }
    const lecteur = new FileReader();
    lecteur.onload = () => resolve(lecteur.result);
    lecteur.onerror = reject;
    lecteur.readAsDataURL(fichier);
  });

const genererMatriculeJADCI = (genre, nom, isIvoirien, sequence) => {
  const g = genre === "FEMME" ? "F" : "H";
  const initial = (nom || "X").trim().charAt(0).toUpperCase();
  const mois = new Date().getMonth() + 1;
  const nat = isIvoirien ? "1" : "2";
  const annee = new Date().getFullYear().toString().slice(-2);
  const seq = String(sequence).padStart(4, "0");
  return `${g}${initial}${mois}${nat}K${annee}${seq}`;
};

const exporterExcel = (donnees, nomFeuille, nomFichier) => {
  if (!donnees || donnees.length === 0) return;
  const feuille = XLSX.utils.json_to_sheet(donnees);
  const classeur = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(classeur, feuille, nomFeuille.slice(0, 31));
  XLSX.writeFile(classeur, `${nomFichier}.xlsx`);
};

const exporterPDF = (contenu, titre, nomFichier) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(titre, 10, 10);
  doc.setFontSize(11);
  doc.text(contenu, 10, 20);
  doc.save(`${nomFichier}.pdf`);
};

/* ================================================================== */
/* COMPOSANT PRINCIPAL */
/* ================================================================== */

export default function App() {
  const [page, setPage] = useState("accueil");
  const [indexFond, setIndexFond] = useState(0);

  // Annonces & Médias
  const [annonces, setAnnonces] = useLocalStorageState("jadci_annonces_v4", [
    "Bienvenue sur la plateforme officielle de la Jeunesse des Assemblées de Dieu de Côte d'Ivoire (JADCI).",
    "Les inscriptions pour les Espaces Jeunes et Responsables sont ouvertes.",
    "Commandez vos articles officiels sur la Boutique en ligne.",
  ]);
  const [annonceActive, setAnnonceActive] = useState(0);
  const [nouvelleAnnonce, setNouvelleAnnonce] = useState("");

  const [articles, setArticles] = useLocalStorageState(
    "jadci_articles_v4",
    articlesInitiaux
  );
  const [direct, setDirect] = useLocalStorageState("jadci_direct_v4", directInitial);

  // Églises & Annuaire
  const [eglises, setEglises] = useLocalStorageState("jadci_eglises_v4", eglisesInitiales);
  const [rechercheEglise, setRechercheEglise] = useState("");

  // Boutique & Produits
  const [produits, setProduits] = useLocalStorageState("jadci_produits_v4", produitsInitiaux);
  const [panier, setPanier] = useState([]);
  const [commandeMessage, setCommandeMessage] = useState("");

  // Séquences globales
  const [seqUtilisateur, setSeqUtilisateur] = useLocalStorageState("jadci_seq_user_v4", 1);
  const [seqRecu, setSeqRecu] = useLocalStorageState("jadci_seq_recu_v4", 1);

  // Comptes Jeunes et Responsables
  const [comptesJeunes, setComptesJeunes] = useLocalStorageState("jadci_comptes_jeunes_v4", []);
  const [comptesResponsables, setComptesResponsables] = useLocalStorageState(
    "jadci_comptes_resp_v4",
    []
  );

  const [jeuneConnecte, setJeuneConnecte] = useLocalStorageState("jadci_session_jeune_v4", null);
  const [responsableConnecte, setResponsableConnecte] = useLocalStorageState(
    "jadci_session_resp_v4",
    null
  );

  const [typeEspaceForm, setTypeEspaceForm] = useState("jeune");
  const [modeEspace, setModeEspace] = useState("connexion");
  const [messageEspace, setMessageEspace] = useState("");

  // Formulaires
  const [formConnexion, setFormConnexion] = useState({ email: "", motDePasse: "" });
  const [formInscription, setFormInscription] = useState({
    nom: "",
    genre: "HOMME",
    nationaliteIvoirienne: true,
    telephone: "",
    email: "",
    motDePasse: "",
    confirmation: "",
  });

  // Profils détaillés Jeunes
  const [formProfilJeune, setFormProfilJeune] = useState({
    dateNaissance: "",
    eglise: "",
    baptemeEau: "NON",
    situationMatrimoniale: "CÉLIBATAIRE",
    photoProfile: "",
    cv: "",
  });

  // Profils détaillés Responsables
  const [formProfilResponsable, setFormProfilResponsable] = useState({
    dateNaissance: "",
    eglise: "",
    baptemeEau: "NON",
    situationMatrimoniale: "CÉLIBATAIRE",
    photoProfile: "",
  });

  // Requêtes, Projets, Candidatures
  const [requetes, setRequetes] = useLocalStorageState("jadci_requetes_v4", []);
  const [projets, setProjets] = useLocalStorageState("jadci_projets_v4", []);
  const [candidatures, setCandidatures] = useLocalStorageState("jadci_candidatures_v4", []);
  const [recommandations, setRecommandations] = useLocalStorageState(
    "jadci_recommandations_v4",
    []
  );
  const [rapports, setRapports] = useLocalStorageState("jadci_rapports_v4", []);
  const [convocations, setConvocations] = useLocalStorageState("jadci_convocations_v4", []);

  // Administration
  const [adminSession, setAdminSession] = useState(null);
  const [identifiantAdminInput, setIdentifiantAdminInput] = useState("");
  const [motDePasseAdminInput, setMotDePasseAdminInput] = useState("");
  const [erreurAdmin, setErreurAdmin] = useState("");
  const [adminTab, setAdminTab] = useState("dashboard");

  // Nouveaux produits (Admin Marketing)
  const [nouveauProduit, setNouveauProduit] = useState({
    nom: "",
    prix: 0,
    categorie: "VÊTEMENTS",
    description: "",
    stock: 10,
    image: "",
  });

  // Animations Carrousel
  useEffect(() => {
    if (annonces.length > 0) {
      const timer = setInterval(() => {
        setAnnonceActive((i) => (i + 1) % annonces.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [annonces.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndexFond((i) => (i + 1) % heroBackgrounds.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const aller = (destination) => {
    setPage(destination);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================================================================== */
  /* INSCRIPTIONS & CONNEXIONS */
  /* ================================================================== */

  const traiterInscription = (e) => {
    e.preventDefault();
    const {
      nom,
      genre,
      nationaliteIvoirienne,
      telephone,
      email,
      motDePasse,
      confirmation,
    } = formInscription;

    if (!nom.trim() || !telephone.trim() || !email.trim() || !motDePasse.trim()) {
      setMessageEspace("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (motDePasse !== confirmation) {
      setMessageEspace("Les mots de passe ne correspondent pas.");
      return;
    }

    const emailExiste = [...comptesJeunes, ...comptesResponsables].some(
      (c) => c.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (emailExiste) {
      setMessageEspace("Un compte avec cette adresse email existe déjà.");
      return;
    }

    const matricule = genererMatriculeJADCI(genre, nom, nationaliteIvoirienne, seqUtilisateur);
    setSeqUtilisateur(seqUtilisateur + 1);

    const nouveauCompte = {
      id: Date.now(),
      matricule,
      nom: nom.trim(),
      genre,
      nationaliteIvoirienne,
      telephone: telephone.trim(),
      email: email.trim(),
      motDePasse,
      commandes: [],
      requetes: [],
      projets: [],
      candidatures: [],
      recommandations: [],
      rapports: [],
      convocations: [],
      dateCreation: new Date().toLocaleDateString("fr-FR"),
      ...formProfilJeune,
      ...formProfilResponsable,
    };

    if (typeEspaceForm === "jeune") {
      setComptesJeunes((prev) => [...prev, nouveauCompte]);
      setJeuneConnecte(nouveauCompte);
      setResponsableConnecte(null);
    } else {
      setComptesResponsables((prev) => [...prev, nouveauCompte]);
      setResponsableConnecte(nouveauCompte);
      setJeuneConnecte(null);
    }

    setMessageEspace("");
    setFormInscription({
      nom: "",
      genre: "HOMME",
      nationaliteIvoirienne: true,
      telephone: "",
      email: "",
      motDePasse: "",
      confirmation: "",
    });
    setFormProfilJeune({
      dateNaissance: "",
      eglise: "",
      baptemeEau: "NON",
      situationMatrimoniale: "CÉLIBATAIRE",
      photoProfile: "",
      cv: "",
    });
  };

  const traiterConnexion = (e) => {
    e.preventDefault();
    const { email, motDePasse } = formConnexion;

    if (typeEspaceForm === "jeune") {
      const compte = comptesJeunes.find(
        (c) => c.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (!compte || compte.motDePasse !== motDePasse) {
        setMessageEspace("Identifiants incorrects pour l'Espace Jeune.");
        return;
      }
      setJeuneConnecte(compte);
      setResponsableConnecte(null);
    } else {
      const compte = comptesResponsables.find(
        (c) => c.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (!compte || compte.motDePasse !== motDePasse) {
        setMessageEspace("Identifiants incorrects pour l'Espace Responsable.");
        return;
      }
      setResponsableConnecte(compte);
      setJeuneConnecte(null);
    }

    setMessageEspace("");
    setFormConnexion({ email: "", motDePasse: "" });
  };

  const deconnecterTout = () => {
    setJeuneConnecte(null);
    setResponsableConnecte(null);
  };

  const majProfilJeune = (champs) => {
    if (!jeuneConnecte) return;
    const maj = { ...jeuneConnecte, ...champs };
    setJeuneConnecte(maj);
    setComptesJeunes((list) => list.map((c) => (c.id === maj.id ? maj : c)));
  };

  const majProfilResponsable = (champs) => {
    if (!responsableConnecte) return;
    const maj = { ...responsableConnecte, ...champs };
    setResponsableConnecte(maj);
    setComptesResponsables((list) => list.map((c) => (c.id === maj.id ? maj : c)));
  };

  /* ================================================================== */
  /* ÉGLISES & ANNUAIRE */
  /* ================================================================== */

  const soumettreNouvelleEglise = (e) => {
    e.preventDefault();
    if (!responsableConnecte) return;
    const form = new FormData(e.target);
    const nouvelle = {
      id: Date.now(),
      nom: form.get("nom").toString().trim(),
      pasteur: form.get("pasteur").toString().trim(),
      telephone: form.get("telephone").toString().trim(),
      ville: form.get("ville").toString().trim(),
      commune: form.get("commune").toString().trim(),
      quartier: form.get("quartier").toString().trim(),
      localisation: form.get("localisation").toString().trim(),
      statut: "EN ATTENTE",
      responsableId: responsableConnecte.id,
    };
    setEglises((prev) => [...prev, nouvelle]);
    e.target.reset();
    setMessageEspace("Église soumise avec succès. Elle apparaîtra après validation.");
  };

  const eglisesValidees = useMemo(
    () => eglises.filter((e) => e.statut === "VALIDÉE"),
    [eglises]
  );
  const eglisesFiltrees = useMemo(() => {
    const q = rechercheEglise.toLowerCase().trim();
    if (!q) return eglisesValidees;
    return eglisesValidees.filter(
      (e) =>
        e.nom.toLowerCase().includes(q) ||
        e.ville.toLowerCase().includes(q) ||
        (e.commune || "").toLowerCase().includes(q) ||
        (e.quartier || "").toLowerCase().includes(q)
    );
  }, [eglisesValidees, rechercheEglise]);

  /* ================================================================== */
  /* BOUTIQUE & COMMANDES */
  /* ================================================================== */

  const ajouterAuPanier = (prod) => {
    if (prod.stock <= 0) {
      setCommandeMessage(`${prod.nom} n'est pas disponible.`);
      return;
    }
    setPanier((ancien) => {
      const existe = ancien.find((item) => item.id === prod.id);
      if (existe) {
        return ancien.map((item) =>
          item.id === prod.id ? { ...item, quantite: item.quantite + 1 } : item
        );
      }
      return [...ancien, { ...prod, quantite: 1 }];
    });
    setCommandeMessage(`${prod.nom} ajouté au panier.`);
  };

  const modifierQuantite = (id, delta) => {
    setPanier((ancien) =>
      ancien
        .map((item) => (item.id === id ? { ...item, quantite: Math.max(0, item.quantite + delta) } : item))
        .filter((item) => item.quantite > 0)
    );
  };

  const totalPanier = useMemo(() => panier.reduce((sum, i) => sum + i.prix * i.quantite, 0), [panier]);

  const passerCommandeBoutique = () => {
    const compteActif = jeuneConnecte || responsableConnecte;
    if (!compteActif) {
      setCommandeMessage("Veuillez vous connecter à votre Espace Personnel pour passer commande.");
      return;
    }
    if (panier.length === 0) {
      setCommandeMessage("Votre panier est vide.");
      return;
    }

    const nouvelleCommande = {
      id: Date.now(),
      ref: `CMD-${Date.now().toString().slice(-6)}`,
      articles: panier.map((p) => ({ nom: p.nom, quantite: p.quantite, prix: p.prix })),
      total: totalPanier,
      date: new Date().toLocaleDateString("fr-FR"),
      statut: "EN ATTENTE DE PAIEMENT",
      codeRecu: "",
      datePaiement: "",
    };

    setProduits((prev) =>
      prev.map((p) => {
        const item = panier.find((i) => i.id === p.id);
        return item ? { ...p, stock: Math.max(0, p.stock - item.quantite) } : p;
      })
    );

    if (jeuneConnecte) {
      majProfilJeune({ commandes: [nouvelleCommande, ...(jeuneConnecte.commandes || [])] });
    } else {
      majProfilResponsable({ commandes: [nouvelleCommande, ...(responsableConnecte.commandes || [])] });
    }

    setPanier([]);
    setCommandeMessage("Commande enregistrée. Finalisez le paiement depuis votre espace personnel.");
  };

  const payerCommandeDepuisEspace = (commandeId) => {
    const compteActif = jeuneConnecte || responsableConnecte;
    if (!compteActif) return;

    const codeRecu = `JAD-2026-${String(seqRecu).padStart(6, "0")}`;
    setSeqRecu(seqRecu + 1);

    const datePaiement = new Date().toLocaleDateString("fr-FR");

    const majCommandes = (compteActif.commandes || []).map((cmd) =>
      cmd.id === commandeId ? { ...cmd, statut: "PAYÉE", codeRecu, datePaiement } : cmd
    );

    if (jeuneConnecte) {
      majProfilJeune({ commandes: majCommandes });
    } else {
      majProfilResponsable({ commandes: majCommandes });
    }
  };

  const genererRecuPDF_A4 = (cmd, compte) => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    doc.setFillColor(84, 32, 168);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("JADCI — REÇU DE PAIEMENT OFFICIEL", 15, 22);
    doc.setFontSize(11);
    doc.text("Jeunesse des Assemblées de Dieu de Côte d'Ivoire", 15, 30);

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(11);

    doc.text(`Acheteur / Client : ${compte.nom}`, 15, 55);
    doc.text(`Matricule unique : ${compte.matricule}`, 15, 63);
    doc.text(`Téléphone : ${compte.telephone}`, 15, 71);
    doc.text(`Email : ${compte.email}`, 15, 79);

    doc.text(`Référence Commande : ${cmd.ref || "CMD-" + cmd.id}`, 120, 55);
    doc.text(`Code Unique Reçu : ${cmd.codeRecu}`, 120, 63);
    doc.text(`Date de Paiement : ${cmd.datePaiement}`, 120, 71);
    doc.text(`Statut : ${cmd.statut}`, 120, 79);

    doc.line(15, 87, 195, 87);

    doc.setFontSize(12);
    doc.text("Désignation des Articles", 15, 97);
    doc.text("Qté", 120, 97);
    doc.text("Prix Unitaire", 145, 97);
    doc.text("Total", 175, 97);

    doc.line(15, 101, 195, 101);

    let y = 111;
    doc.setFontSize(11);
    (cmd.articles || []).forEach((art) => {
      doc.text(art.nom, 15, y);
      doc.text(String(art.quantite), 122, y);
      doc.text(`${art.prix.toLocaleString("fr-FR")} FCFA`, 145, y);
      doc.text(`${(art.prix * art.quantite).toLocaleString("fr-FR")} FCFA`, 175, y);
      y += 8;
    });

    doc.line(15, y, 195, y);
    y += 12;

    doc.setFontSize(14);
    doc.text(`MONTANT TOTAL PAYÉ : ${cmd.total.toLocaleString("fr-FR")} FCFA`, 15, y);

    doc.save(`Recu_JADCI_${cmd.codeRecu}.pdf`);
  };

  /* ================================================================== */
  /* REQUÊTES & PROJETS */
  /* ================================================================== */

  const soumettreRequete = (e, typeRequete) => {
    e.preventDefault();
    const compteActif = jeuneConnecte || responsableConnecte;
    if (!compteActif) return;

    const form = new FormData(e.target);
    const nouvelleRequete = {
      id: Date.now(),
      compte_id: compteActif.id,
      compte_nom: compteActif.nom,
      compte_matricule: compteActif.matricule,
      type: typeRequete,
      titre: form.get("titre").toString().trim(),
      description: form.get("description").toString().trim(),
      dateCreation: new Date().toLocaleDateString("fr-FR"),
      statut: "SOUMISE",
    };

    setRequetes((prev) => [...prev, nouvelleRequete]);
    e.target.reset();
    setMessageEspace("Requête soumise avec succès.");
  };

  const soumettreProjet = (e) => {
    e.preventDefault();
    const compteActif = jeuneConnecte || responsableConnecte;
    if (!compteActif) return;

    const form = new FormData(e.target);
    const nouveauProjet = {
      id: Date.now(),
      compte_id: compteActif.id,
      compte_nom: compteActif.nom,
      compte_matricule: compteActif.matricule,
      titre: form.get("titre").toString().trim(),
      description: form.get("description").toString().trim(),
      objectifs: form.get("objectifs").toString().trim(),
      budget: Number(form.get("budget")) || 0,
      dateDebutProvisoire: form.get("dateDebut").toString().trim(),
      dateCreation: new Date().toLocaleDateString("fr-FR"),
      statut: "EN ATTENTE",
    };

    setProjets((prev) => [...prev, nouveauProjet]);
    e.target.reset();
    setMessageEspace("Projet soumis avec succès.");
  };

  /* ================================================================== */
  /* ADMINISTRATION */
  /* ================================================================== */

  const connecterAdmin = (e) => {
    e.preventDefault();
    const identifiant = identifiantAdminInput.trim();
    const mdp = motDePasseAdminInput;

    const trouve = comptesAdmin.find((a) => a.matricule === identifiant && a.motDePasse === mdp);
    if (!trouve) {
      setErreurAdmin("Matricule ou mot de passe Administrateur incorrect.");
      return;
    }
    setAdminSession(trouve);
    setErreurAdmin("");
    setIdentifiantAdminInput("");
    setMotDePasseAdminInput("");
    setAdminTab("dashboard");
  };

  const exporterToutesDonneesExcel = () => {
    const tJeunes = comptesJeunes.map((j) => ({
      Matricule: j.matricule,
      Nom: j.nom,
      Telephone: j.telephone,
      Email: j.email,
      Genre: j.genre,
      Ivoirien: j.nationaliteIvoirienne ? "Oui" : "Non",
      Creation: j.dateCreation,
    }));

    const tResponsables = comptesResponsables.map((r) => ({
      Matricule: r.matricule,
      Nom: r.nom,
      Telephone: r.telephone,
      Email: r.email,
      Genre: r.genre,
      Ivoirien: r.nationaliteIvoirienne ? "Oui" : "Non",
      Creation: r.dateCreation,
    }));

    const tCommandes = [];
    [...comptesJeunes, ...comptesResponsables].forEach((c) => {
      (c.commandes || []).forEach((cmd) => {
        tCommandes.push({
          CompteMat: c.matricule,
          CompteNom: c.nom,
          RefCommande: cmd.ref,
          Total: cmd.total,
          Statut: cmd.statut,
          DateCommande: cmd.date,
          DatePaiement: cmd.datePaiement || "N/A",
          CodeRecu: cmd.codeRecu || "N/A",
        });
      });
    });

    const tRequetes = requetes.map((r) => ({
      CompteMat: r.compte_matricule,
      CompteNom: r.compte_nom,
      Type: r.type,
      Titre: r.titre,
      Statut: r.statut,
      DateCreation: r.dateCreation,
    }));

    const tProjets = projets.map((p) => ({
      CompteMat: p.compte_matricule,
      CompteNom: p.compte_nom,
      Titre: p.titre,
      Budget: p.budget,
      Statut: p.statut,
      DateCreation: p.dateCreation,
    }));

    const tEglises = eglises.map((e) => ({
      Nom: e.nom,
      Pasteur: e.pasteur,
      Telephone: e.telephone,
      Ville: e.ville,
      Commune: e.commune,
      Statut: e.statut,
    }));

    exporterExcel(tJeunes, "Jeunes", "JADCI_Export_Jeunes");
    exporterExcel(tResponsables, "Responsables", "JADCI_Export_Responsables");
    exporterExcel(tCommandes, "Commandes", "JADCI_Export_Commandes");
    exporterExcel(tRequetes, "Requetes", "JADCI_Export_Requetes");
    exporterExcel(tProjets, "Projets", "JADCI_Export_Projets");
    exporterExcel(tEglises, "Eglises", "JADCI_Export_Eglises");
  };

  const calculerChiffresAffaires = () => {
    let totalPayements = 0;
    let nombreCommandes = 0;

    [...comptesJeunes, ...comptesResponsables].forEach((c) => {
      (c.commandes || []).forEach((cmd) => {
        if (cmd.statut === "PAYÉE") {
          totalPayements += cmd.total;
          nombreCommandes++;
        }
      });
    });

    return { totalPayements, nombreCommandes };
  };

  const { totalPayements, nombreCommandes } = calculerChiffresAffaires();

  /* ================================================================== */
  /* RENDU VISUEL */
  /* ================================================================== */

  return (
    <div style={styles.app}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brand} onClick={() => aller("accueil")}>
            <img src={logoJadci} alt="Logo JADCI" style={styles.brandLogo} />
            <div>
              <h1 style={styles.brandTitle}>JADCI</h1>
              <p style={styles.brandSubtitle}>Jeunesse des Assemblées de Dieu de Côte d'Ivoire</p>
            </div>
          </div>

          <nav style={styles.nav}>
            <button
              style={styles.navButton(page === "accueil")}
              onClick={() => aller("accueil")}
            >
              ACCUEIL
            </button>
            <button
              style={styles.navButton(page === "actualites")}
              onClick={() => aller("actualites")}
            >
              ACTUALITÉS
            </button>
            <button
              style={styles.navButton(page === "boutique")}
              onClick={() => aller("boutique")}
            >
              BOUTIQUE
            </button>
            <button
              style={styles.navButton(page === "eglises")}
              onClick={() => aller("eglises")}
            >
              ÉGLISES
            </button>
            <button
              style={styles.navButton(page === "espaces")}
              onClick={() => aller("espaces")}
            >
              ESPACES
            </button>
            <button
              style={styles.navButton(page === "admin")}
              onClick={() => aller("admin")}
            >
              PORTAIL ADMIN
            </button>
          </nav>
        </div>
      </header>

      {/* BANNEAU D'ANNONCES */}
      {annonces.length > 0 && (
        <div style={styles.announcement}>
          <span style={styles.announcementTitle}>ANNONCE</span>
          <span style={styles.announcementText}>{annonces[annonceActive]}</span>
        </div>
      )}

      {/* CONTENU PRINCIPAL */}
      <main style={styles.main}>
        {/* PAGE ACCUEIL */}
        {page === "accueil" && (
          <section>
            <div style={styles.hero}>
              {heroBackgrounds.map((bg, idx) => (
                <div
                  key={idx}
                  style={styles.heroBackgroundLayer(bg, idx === indexFond)}
                />
              ))}

              <div style={styles.heroContent}>
                <span style={styles.badge}>Mouvement National de la Jeunesse</span>
                <h1 style={styles.heroTitle}>
                  Bienvenue sur la plateforme <span style={styles.purple}>JADCI</span>
                </h1>
                <p style={styles.heroText}>
                  Un espace unifié pour impacter, former, connecter la jeunesse chrétienne et valoriser
                  chaque jeune et responsable au service du Royaume.
                </p>
                <div style={styles.heroActions}>
                  <button style={styles.button} onClick={() => aller("espaces")}>
                    Rejoindre l'Espace Personnel
                  </button>
                  <button style={styles.secondaryButton} onClick={() => aller("actualites")}>
                    Consulter les Actualités
                  </button>
                </div>
              </div>

              <div style={styles.heroCard}>
                <div style={styles.heroLogoCircle}>
                  <img src={logoJadci} alt="Logo JADCI" style={{ width: "100%" }} />
                </div>
                <h3 style={{ margin: 0, marginBottom: "8px", fontSize: "16px", fontWeight: "700" }}>
                  Jeunesse, Foi & Action
                </h3>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.4 }}>
                  Trouvez votre église, participez aux projets et accédez à vos ressources officielles.
                </p>
              </div>
            </div>

            {direct.actif && (
              <div style={{ ...styles.card, backgroundColor: "#f0f4ff", marginTop: "30px" }}>
                <h3 style={{ marginTop: 0, color: "#5420a8" }}>DIRECT JADCI</h3>
                <p>
                  <strong>{direct.titre}</strong> - {direct.sousTitre}
                </p>
                <div style={{ display: "flex", gap: "12px", marginTop: "15px" }}>
                  {direct.youtubeUrl && (
                    <a href={direct.youtubeUrl} target="_blank" rel="noopener noreferrer" style={styles.button}>
                      Regarder sur YouTube
                    </a>
                  )}
                  {direct.facebookUrl && (
                    <a href={direct.facebookUrl} target="_blank" rel="noopener noreferrer" style={styles.button}>
                      Suivre sur Facebook
                    </a>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {/* PAGE ACTUALITÉS */}
        {page === "actualites" && (
          <section>
            <h2 style={styles.pageTitle}>Actualités et Médiathèque JADCI</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {articles.map((art) => (
                <div key={art.id} style={styles.card}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#7c3aed" }}>
                    {art.categorie} — {art.datePublication}
                  </span>
                  <h3 style={{ marginTop: "12px", marginBottom: "8px" }}>{art.titre}</h3>
                  <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#475569" }}>{art.contenu}</p>
                  {art.image && (
                    <img src={art.image} alt={art.titre} style={{ width: "100%", borderRadius: "8px", marginTop: "12px" }} />
                  )}
                  {art.videoUrl && (
                    <a href={art.videoUrl} target="_blank" rel="noopener noreferrer" style={{ ...styles.button, display: "inline-block", marginTop: "12px" }}>
                      Visionner la vidéo
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PAGE BOUTIQUE */}
        {page === "boutique" && (
          <section>
            <h2 style={styles.pageTitle}>Boutique Officielle JADCI</h2>
            {commandeMessage && <div style={styles.alertBox}>{commandeMessage}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "30px" }}>
              {/* Produits */}
              <div>
                <h3>Nos Produits</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "15px" }}>
                  {produits.map((p) => (
                    <div key={p.id} style={styles.card}>
                      {p.image ? (
                        <img src={p.image} alt={p.nom} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }} />
                      ) : (
                        <div style={{ width: "100%", height: "200px", backgroundColor: "#e2e8f0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          Image indisponible
                        </div>
                      )}
                      <span style={{ display: "inline-block", fontSize: "11px", fontWeight: "600", color: "#7c3aed", marginTop: "12px" }}>
                        {p.categorie}
                      </span>
                      <h4 style={{ margin: "8px 0" }}>{p.nom}</h4>
                      <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "10px" }}>{p.description}</p>
                      <p style={{ fontSize: "16px", fontWeight: "700", color: "#5420a8", marginBottom: "8px" }}>
                        {p.prix.toLocaleString("fr-FR")} FCFA
                      </p>
                      <div style={{ marginBottom: "12px", fontSize: "12px", color: p.stock > 0 ? "#16a34a" : "#dc2626", fontWeight: "600" }}>
                        Stock : {p.stock > 0 ? `${p.stock} unités` : "Rupture"}
                      </div>
                      <button
                        style={{ ...styles.button, width: "100%" }}
                        onClick={() => ajouterAuPanier(p)}
                        disabled={p.stock === 0}
                      >
                        Ajouter au panier
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Panier */}
              <div>
                <h3>Votre Panier</h3>
                <div style={styles.card}>
                  {panier.length === 0 ? (
                    <p style={{ color: "#64748b" }}>Votre panier est vide.</p>
                  ) : (
                    <>
                      {panier.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingBottom: "12px",
                            marginBottom: "12px",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: "600" }}>{item.nom}</p>
                            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                              {item.prix.toLocaleString("fr-FR")} FCFA
                            </p>
                          </div>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <button style={styles.smallBtn} onClick={() => modifierQuantite(item.id, -1)}>
                              -
                            </button>
                            <span style={{ minWidth: "30px", textAlign: "center" }}>{item.quantite}</span>
                            <button style={styles.smallBtn} onClick={() => modifierQuantite(item.id, 1)}>
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                      <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "2px solid #e2e8f0" }}>
                        <p style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
                          Total : {totalPanier.toLocaleString("fr-FR")} FCFA
                        </p>
                        <button
                          style={{ ...styles.button, width: "100%", marginTop: "12px" }}
                          onClick={passerCommandeBoutique}
                        >
                          Passer la commande
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PAGE ÉGLISES */}
        {page === "eglises" && (
          <section>
            <h2 style={styles.pageTitle}>Annuaire des Églises Assemblées de Dieu</h2>
            <input
              type="text"
              placeholder="Rechercher une église par nom, ville ou quartier..."
              value={rechercheEglise}
              onChange={(e) => setRechercheEglise(e.target.value)}
              style={{ ...styles.input, marginBottom: "20px", maxWidth: "500px" }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
              {eglisesFiltrees.map((e) => (
                <div key={e.id} style={styles.card}>
                  <h3 style={{ marginTop: 0, color: "#5420a8" }}>{e.nom}</h3>
                  <p style={{ margin: "8px 0", fontSize: "13px" }}>
                    <strong>Pasteur :</strong> {e.pasteur}
                  </p>
                  <p style={{ margin: "8px 0", fontSize: "13px" }}>
                    <strong>Ville/Commune :</strong> {e.ville} {e.commune && `(${e.commune})`}
                  </p>
                  <p style={{ margin: "8px 0", fontSize: "13px" }}>
                    <strong>Quartier :</strong> {e.quartier || "N/A"}
                  </p>
                  <p style={{ margin: "8px 0", fontSize: "13px" }}>
                    <strong>Contact :</strong> {e.telephone || "N/A"}
                  </p>
                  {e.localisation && (
                    <a href={e.localisation} target="_blank" rel="noopener noreferrer" style={{ ...styles.button, display: "inline-block", marginTop: "12px", fontSize: "13px" }}>
                      Voir sur Google Maps
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PAGE ESPACES */}
        {page === "espaces" && (
          <section>
            {!jeuneConnecte && !responsableConnecte ? (
              // Sélection du type d'espace
              <>
                <h2 style={styles.pageTitle}>Vos Espaces Personnels</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "40px" }}>
                  <button
                    style={{
                      ...styles.card,
                      padding: "30px",
                      textAlign: "center",
                      cursor: "pointer",
                      border: typeEspaceForm === "jeune" ? "3px solid #5420a8" : "1px solid #e2e8f0",
                      backgroundColor: typeEspaceForm === "jeune" ? "#f5f3ff" : "#ffffff",
                    }}
                    onClick={() => {
                      setTypeEspaceForm("jeune");
                      setMessageEspace("");
                    }}
                  >
                    <h3 style={{ marginTop: 0, color: "#5420a8" }}>Espace Jeune</h3>
                    <p style={{ color: "#64748b" }}>
                      Inscription et connexion pour les jeunes membres de la JADCI
                    </p>
                  </button>

                  <button
                    style={{
                      ...styles.card,
                      padding: "30px",
                      textAlign: "center",
                      cursor: "pointer",
                      border: typeEspaceForm === "responsable" ? "3px solid #5420a8" : "1px solid #e2e8f0",
                      backgroundColor: typeEspaceForm === "responsable" ? "#f5f3ff" : "#ffffff",
                    }}
                    onClick={() => {
                      setTypeEspaceForm("responsable");
                      setMessageEspace("");
                    }}
                  >
                    <h3 style={{ marginTop: 0, color: "#5420a8" }}>Espace Responsable</h3>
                    <p style={{ color: "#64748b" }}>
                      Inscription et connexion pour les responsables et pasteurs
                    </p>
                  </button>
                </div>

                {/* Formulaire */}
                <div style={{ maxWidth: "500px", margin: "0 auto" }}>
                  <h3 style={{ textAlign: "center" }}>
                    {modeEspace === "connexion" ? "Connexion" : "Inscription"} -{" "}
                    {typeEspaceForm === "jeune" ? "Jeune JADCI" : "Responsable JADCI"}
                  </h3>
                  {messageEspace && <div style={styles.alertBox}>{messageEspace}</div>}

                  {modeEspace === "connexion" ? (
                    <form onSubmit={traiterConnexion}>
                      <input
                        type="email"
                        placeholder="Adresse email"
                        value={formConnexion.email}
                        onChange={(e) => setFormConnexion({ ...formConnexion, email: e.target.value })}
                        style={styles.input}
                        required
                      />
                      <input
                        type="password"
                        placeholder="Mot de passe"
                        value={formConnexion.motDePasse}
                        onChange={(e) => setFormConnexion({ ...formConnexion, motDePasse: e.target.value })}
                        style={styles.input}
                        required
                      />
                      <button type="submit" style={{ ...styles.button, width: "100%" }}>
                        Se connecter
                      </button>
                      <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#64748b" }}>
                        Pas encore de compte?{" "}
                        <button
                          type="button"
                          style={{ background: "none", border: "none", color: "#5420a8", fontWeight: "600", cursor: "pointer" }}
                          onClick={() => setModeEspace("inscription")}
                        >
                          S'inscrire
                        </button>
                      </p>
                    </form>
                  ) : (
                    <form onSubmit={traiterInscription}>
                      <input
                        type="text"
                        placeholder="Nom complet"
                        value={formInscription.nom}
                        onChange={(e) => setFormInscription({ ...formInscription, nom: e.target.value })}
                        style={styles.input}
                        required
                      />
                      <select
                        value={formInscription.genre}
                        onChange={(e) => setFormInscription({ ...formInscription, genre: e.target.value })}
                        style={styles.input}
                      >
                        <option value="HOMME">Homme</option>
                        <option value="FEMME">Femme</option>
                      </select>
                      <label style={{ display: "flex", alignItems: "center", marginBottom: "12px", fontSize: "14px" }}>
                        <input
                          type="checkbox"
                          checked={formInscription.nationaliteIvoirienne}
                          onChange={(e) => setFormInscription({ ...formInscription, nationaliteIvoirienne: e.target.checked })}
                          style={{ marginRight: "8px" }}
                        />
                        Nationalité Ivoirienne
                      </label>
                      <input
                        type="tel"
                        placeholder="Téléphone"
                        value={formInscription.telephone}
                        onChange={(e) => setFormInscription({ ...formInscription, telephone: e.target.value })}
                        style={styles.input}
                        required
                      />
                      <input
                        type="email"
                        placeholder="Adresse email"
                        value={formInscription.email}
                        onChange={(e) => setFormInscription({ ...formInscription, email: e.target.value })}
                        style={styles.input}
                        required
                      />
                      <input
                        type="password"
                        placeholder="Mot de passe"
                        value={formInscription.motDePasse}
                        onChange={(e) => setFormInscription({ ...formInscription, motDePasse: e.target.value })}
                        style={styles.input}
                        required
                      />
                      <input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        value={formInscription.confirmation}
                        onChange={(e) => setFormInscription({ ...formInscription, confirmation: e.target.value })}
                        style={styles.input}
                        required
                      />
                      <button type="submit" style={{ ...styles.button, width: "100%" }}>
                        Créer mon compte
                      </button>
                      <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#64748b" }}>
                        Déjà inscrit?{" "}
                        <button
                          type="button"
                          style={{ background: "none", border: "none", color: "#5420a8", fontWeight: "600", cursor: "pointer" }}
                          onClick={() => setModeEspace("connexion")}
                        >
                          Se connecter
                        </button>
                      </p>
                    </form>
                  )}
                </div>
              </>
            ) : (
              // Espace Personnel Connecté
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                  <h2 style={styles.pageTitle}>
                    {jeuneConnecte ? "Espace Personnel Jeune" : "Espace Responsable JADCI"}
                  </h2>
                  <button style={styles.button} onClick={deconnecterTout}>
                    Déconnexion
                  </button>
                </div>

                {(() => {
                  const compteActif = jeuneConnecte || responsableConnecte;
                  return (
                    <>
                      {/* Profil */}
                      <div style={styles.card}>
                        <h3>Profil Utilisateur</h3>
                        <p>Nom : <strong>{compteActif.nom}</strong></p>
                        <p>Matricule unique : <strong>{compteActif.matricule}</strong></p>
                        <p>Email : <strong>{compteActif.email}</strong></p>
                        <p>Téléphone : <strong>{compteActif.telephone}</strong></p>
                        <p>Membre depuis : <strong>{compteActif.dateCreation}</strong></p>
                      </div>

                      {/* Église pour Responsable */}
                      {responsableConnecte && (
                        <div style={{ ...styles.card, marginTop: "20px" }}>
                          <h3>Enregistrer une Église</h3>
                          <form onSubmit={soumettreNouvelleEglise} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            <input type="text" name="nom" placeholder="Nom de l'église" style={styles.input} required />
                            <input type="text" name="pasteur" placeholder="Nom du pasteur" style={styles.input} required />
                            <input type="tel" name="telephone" placeholder="Téléphone" style={styles.input} required />
                            <input type="text" name="ville" placeholder="Ville" style={styles.input} required />
                            <input type="text" name="commune" placeholder="Commune" style={styles.input} />
                            <input type="text" name="quartier" placeholder="Quartier" style={styles.input} />
                            <input
                              type="url"
                              name="localisation"
                              placeholder="Lien Google Maps"
                              style={{ ...styles.input, gridColumn: "1 / -1" }}
                            />
                            <button type="submit" style={{ ...styles.button, gridColumn: "1 / -1" }}>
                              Proposer l'église
                            </button>
                          </form>
                        </div>
                      )}

                      {/* Commandes */}
                      <div style={{ ...styles.card, marginTop: "20px" }}>
                        <h3>Vos Commandes et Reçus</h3>
                        {(compteActif.commandes || []).length === 0 ? (
                          <p style={{ color: "#64748b" }}>Aucune commande enregistrée pour le moment.</p>
                        ) : (
                          <div style={{ display: "grid", gap: "12px" }}>
                            {compteActif.commandes.map((cmd) => (
                              <div key={cmd.id} style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                  <div>
                                    <p style={{ margin: "0 0 8px 0", fontWeight: "600" }}>
                                      Réf : {cmd.ref || "CMD-" + cmd.id} — Date : {cmd.date}
                                    </p>
                                    <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
                                      Total : {cmd.total.toLocaleString("fr-FR")} FCFA
                                    </p>
                                  </div>
                                  <span
                                    style={{
                                      padding: "4px 12px",
                                      borderRadius: "20px",
                                      fontSize: "12px",
                                      fontWeight: "600",
                                      backgroundColor: cmd.statut === "PAYÉE" ? "#d1fae5" : "#fed7aa",
                                      color: cmd.statut === "PAYÉE" ? "#065f46" : "#92400e",
                                    }}
                                  >
                                    {cmd.statut}
                                  </span>
                                </div>
                                {cmd.statut !== "PAYÉE" ? (
                                  <button
                                    style={{ ...styles.button, marginTop: "12px", fontSize: "13px" }}
                                    onClick={() => payerCommandeDepuisEspace(cmd.id)}
                                  >
                                    Payer en ligne
                                  </button>
                                ) : (
                                  <button
                                    style={{ ...styles.button, marginTop: "12px", fontSize: "13px" }}
                                    onClick={() => genererRecuPDF_A4(cmd, compteActif)}
                                  >
                                    Télécharger Reçu PDF
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </section>
        )}

        {/* PAGE ADMIN */}
        {page === "admin" && (
          <section>
            {!adminSession ? (
              // Connexion Admin
              <div style={{ maxWidth: "400px", margin: "0 auto" }}>
                <h2 style={{ textAlign: "center" }}>Portail Administration JADCI</h2>
                {erreurAdmin && <div style={styles.alertBox}>{erreurAdmin}</div>}
                <form onSubmit={connecterAdmin}>
                  <input
                    type="text"
                    placeholder="Matricule Administrateur"
                    value={identifiantAdminInput}
                    onChange={(e) => setIdentifiantAdminInput(e.target.value)}
                    style={styles.input}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={motDePasseAdminInput}
                    onChange={(e) => setMotDePasseAdminInput(e.target.value)}
                    style={styles.input}
                    required
                  />
                  <button type="submit" style={{ ...styles.button, width: "100%" }}>
                    Se connecter au Portail
                  </button>
                </form>
              </div>
            ) : (
              // Panneau Admin
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                  <h2 style={styles.pageTitle}>Panneau de Contrôle Admin</h2>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#64748b" }}>
                      Connecté en tant que : <strong>{adminSession.label}</strong> ({adminSession.role})
                    </p>
                    <button style={styles.button} onClick={() => setAdminSession(null)}>
                      Déconnexion Admin
                    </button>
                  </div>
                </div>

                {/* Tabs Admin */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
                  <button
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px 8px 0 0",
                      border: "none",
                      backgroundColor: adminTab === "dashboard" ? "#5420a8" : "#f1f5f9",
                      color: adminTab === "dashboard" ? "#ffffff" : "#475569",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                    onClick={() => setAdminTab("dashboard")}
                  >
                    Tableau de bord
                  </button>
                  {(adminSession.role === "GENERAL" || adminSession.role === "COM") && (
                    <button
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px 8px 0 0",
                        border: "none",
                        backgroundColor: adminTab === "communication" ? "#5420a8" : "#f1f5f9",
                        color: adminTab === "communication" ? "#ffffff" : "#475569",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                      onClick={() => setAdminTab("communication")}
                    >
                      Communication
                    </button>
                  )}
                  {(adminSession.role === "GENERAL" || adminSession.role === "MARKETING") && (
                    <button
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px 8px 0 0",
                        border: "none",
                        backgroundColor: adminTab === "marketing" ? "#5420a8" : "#f1f5f9",
                        color: adminTab === "marketing" ? "#ffffff" : "#475569",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                      onClick={() => setAdminTab("marketing")}
                    >
                      Boutique & Produits
                    </button>
                  )}
                  {adminSession.role === "GENERAL" && (
                    <button
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px 8px 0 0",
                        border: "none",
                        backgroundColor: adminTab === "eglises" ? "#5420a8" : "#f1f5f9",
                        color: adminTab === "eglises" ? "#ffffff" : "#475569",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                      onClick={() => setAdminTab("eglises")}
                    >
                      Validation Églises
                    </button>
                  )}
                </div>

                {/* TAB Dashboard */}
                {adminTab === "dashboard" && (
                  <div>
                    <h3>Statistiques Plateforme</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "30px" }}>
                      <div style={styles.card}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Jeunes Inscrits</p>
                        <p style={{ margin: "8px 0 0 0", fontSize: "28px", fontWeight: "700", color: "#5420a8" }}>
                          {comptesJeunes.length}
                        </p>
                      </div>
                      <div style={styles.card}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Responsables</p>
                        <p style={{ margin: "8px 0 0 0", fontSize: "28px", fontWeight: "700", color: "#5420a8" }}>
                          {comptesResponsables.length}
                        </p>
                      </div>
                      <div style={styles.card}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Églises Validées</p>
                        <p style={{ margin: "8px 0 0 0", fontSize: "28px", fontWeight: "700", color: "#5420a8" }}>
                          {eglisesValidees.length}
                        </p>
                      </div>
                      <div style={styles.card}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Produits Boutique</p>
                        <p style={{ margin: "8px 0 0 0", fontSize: "28px", fontWeight: "700", color: "#5420a8" }}>
                          {produits.length}
                        </p>
                      </div>
                      <div style={styles.card}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Commandes Payées</p>
                        <p style={{ margin: "8px 0 0 0", fontSize: "28px", fontWeight: "700", color: "#16a34a" }}>
                          {nombreCommandes}
                        </p>
                      </div>
                      <div style={styles.card}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>Chiffre d'affaires (FCFA)</p>
                        <p style={{ margin: "8px 0 0 0", fontSize: "22px", fontWeight: "700", color: "#16a34a" }}>
                          {totalPayements.toLocaleString("fr-FR")}
                        </p>
                      </div>
                    </div>

                    <div style={styles.card}>
                      <h3>Exports des Données</h3>
                      <p style={{ color: "#64748b", marginBottom: "16px" }}>
                        Téléchargez les données de la plateforme pour exploitation en Excel.
                      </p>
                      <button style={{ ...styles.button, width: "100%" }} onClick={exporterToutesDonneesExcel}>
                        Exporter Toutes les Données (Excel)
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB Communication */}
                {adminTab === "communication" && (
                  <div>
                    <h3>Gestion du Banneau d'Annonces</h3>
                    <div style={styles.card}>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                        <input
                          type="text"
                          placeholder="Nouvelle annonce"
                          value={nouvelleAnnonce}
                          onChange={(e) => setNouvelleAnnonce(e.target.value)}
                          style={{ ...styles.input, marginBottom: 0, flex: 1 }}
                        />
                        <button
                          style={styles.button}
                          onClick={() => {
                            if (!nouvelleAnnonce.trim()) return;
                            setAnnonces((prev) => [...prev, nouvelleAnnonce.trim()]);
                            setNouvelleAnnonce("");
                          }}
                        >
                          Ajouter
                        </button>
                      </div>
                      <div style={{ display: "grid", gap: "8px" }}>
                        {annonces.map((ann, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "12px",
                              backgroundColor: "#f8fafc",
                              borderRadius: "8px",
                            }}
                          >
                            <p style={{ margin: 0, flex: 1 }}>{ann}</p>
                            <button
                              style={styles.smallBtn}
                              onClick={() => setAnnonces((prev) => prev.filter((_, i) => i !== idx))}
                            >
                              Supprimer
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB Marketing */}
                {adminTab === "marketing" && (
                  <div>
                    <h3>Ajouter un Produit à la Boutique</h3>
                    <div style={styles.card}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <input
                          type="text"
                          placeholder="Nom du produit"
                          value={nouveauProduit.nom}
                          onChange={(e) => setNouveauProduit({ ...nouveauProduit, nom: e.target.value })}
                          style={styles.input}
                        />
                        <input
                          type="number"
                          placeholder="Prix (FCFA)"
                          value={nouveauProduit.prix}
                          onChange={(e) => setNouveauProduit({ ...nouveauProduit, prix: Number(e.target.value) })}
                          style={styles.input}
                        />
                        <input
                          type="number"
                          placeholder="Stock"
                          value={nouveauProduit.stock}
                          onChange={(e) => setNouveauProduit({ ...nouveauProduit, stock: Number(e.target.value) })}
                          style={styles.input}
                        />
                        <select
                          value={nouveauProduit.categorie}
                          onChange={(e) => setNouveauProduit({ ...nouveauProduit, categorie: e.target.value })}
                          style={styles.input}
                        >
                          <option value="VÊTEMENTS">Vêtements</option>
                          <option value="LIVRES">Livres</option>
                          <option value="GADGETS">Gadgets</option>
                          <option value="SERVICES">Services</option>
                        </select>
                      </div>
                      <textarea
                        placeholder="Description du produit"
                        value={nouveauProduit.description}
                        onChange={(e) => setNouveauProduit({ ...nouveauProduit, description: e.target.value })}
                        style={{ ...styles.input, height: "80px", marginBottom: "16px" }}
                      />
                      <button
                        style={{ ...styles.button, width: "100%" }}
                        onClick={() => {
                          if (!nouveauProduit.nom || !nouveauProduit.prix) {
                            alert("Remplissez le nom et le prix.");
                            return;
                          }
                          setProduits((prev) => [...prev, { ...nouveauProduit, id: Date.now() }]);
                          setNouveauProduit({
                            nom: "",
                            prix: 0,
                            categorie: "VÊTEMENTS",
                            description: "",
                            stock: 10,
                            image: "",
                          });
                          alert("Produit ajouté.");
                        }}
                      >
                        Enregistrer le Produit
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB Églises */}
                {adminTab === "eglises" && (
                  <div>
                    <h3>Valider les Églises Soumises</h3>
                    {eglises.filter((e) => e.statut === "EN ATTENTE").length === 0 ? (
                      <p style={styles.alertBox}>Aucune église en attente de validation.</p>
                    ) : (
                      <div style={{ display: "grid", gap: "12px" }}>
                        {eglises
                          .filter((e) => e.statut === "EN ATTENTE")
                          .map((e) => (
                            <div key={e.id} style={styles.card}>
                              <h4 style={{ margin: "0 0 8px 0" }}>
                                {e.nom} — Pasteur : {e.pasteur}
                              </h4>
                              <p style={{ margin: "4px 0", fontSize: "13px", color: "#64748b" }}>
                                Ville : {e.ville} ({e.commune}) | Tel : {e.telephone}
                              </p>
                              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                                <button
                                  style={styles.button}
                                  onClick={() =>
                                    setEglises((prev) =>
                                      prev.map((item) => (item.id === e.id ? { ...item, statut: "VALIDÉE" } : item))
                                    )
                                  }
                                >
                                  Valider
                                </button>
                                <button
                                  style={{ ...styles.button, backgroundColor: "#dc2626" }}
                                  onClick={() => setEglises((prev) => prev.filter((item) => item.id !== e.id))}
                                >
                                  Refuser
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

/* ================================================================== */
/* STYLES INLINE */
/* ================================================================== */

const styles = {
  app: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    color: "#1e293b",
  },
  header: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  headerInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },
  brandLogo: {
    height: "45px",
    width: "auto",
  },
  brandTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
    color: "#5420a8",
  },
  brandSubtitle: {
    margin: 0,
    fontSize: "11px",
    color: "#64748b",
  },
  nav: {
    display: "flex",
    gap: "8px",
  },
  navButton: (active) => ({
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: active ? "#5420a8" : "transparent",
    color: active ? "#ffffff" : "#475569",
    fontWeight: active ? "600" : "500",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  }),
  announcement: {
    backgroundColor: "#5420a8",
    color: "#ffffff",
    padding: "8px 20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "13px",
    animation: "slide 10s linear infinite",
  },
  announcementTitle: {
    fontWeight: "700",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "11px",
  },
  announcementText: {
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 20px",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "20px",
    color: "#0f172a",
  },
  hero: {
    position: "relative",
    borderRadius: "20px",
    overflow: "hidden",
    padding: "60px 40px",
    color: "#ffffff",
    marginBottom: "30px",
    minHeight: "360px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroBackgroundLayer: (bg, active) => ({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `linear-gradient(135deg, rgba(84, 32, 168, 0.9), rgba(15, 23, 42, 0.75)), url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: active ? 1 : 0,
    transition: "opacity 1s ease-in-out",
    zIndex: 1,
  }),
  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "600px",
  },
  badge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  heroTitle: {
    fontSize: "36px",
    fontWeight: "800",
    margin: "15px 0",
    lineHeight: 1.2,
  },
  purple: {
    color: "#c084fc",
  },
  heroText: {
    fontSize: "16px",
    opacity: 0.9,
    lineHeight: 1.5,
    marginBottom: "25px",
  },
  heroActions: {
    display: "flex",
    gap: "12px",
  },
  heroCard: {
    position: "relative",
    zIndex: 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    maxWidth: "280px",
    textAlign: "center",
  },
  heroLogoCircle: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    padding: "8px",
    margin: "0 auto 12px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  button: {
    backgroundColor: "#5420a8",
    color: "#ffffff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    padding: "10px 18px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  smallBtn: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "12px",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    marginBottom: "12px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  alertBox: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#166534",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
  },
};