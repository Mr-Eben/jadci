import { useState } from "react";
import logoJadci from "./assets/logo-jadci.png";
import "./App.css";

const demandesInitiales = [
  {
    id: 1,
    type: "Jeune",
    nom: "Kouassi Jean",
    telephone: "07 00 00 00 00",
    ville: "Abidjan",
    statut: "En attente",
  },
  {
    id: 2,
    type: "Responsable régional",
    nom: "Yao Marie",
    telephone: "05 00 00 00 00",
    ville: "Bouaké",
    statut: "En attente",
  },
];

function App() {
  const [page, setPage] = useState("accueil");
  const [adminConnecte, setAdminConnecte] = useState(false);
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [demandes, setDemandes] = useState(demandesInitiales);
  const [annonce, setAnnonce] = useState("");

  const [annonces, setAnnonces] = useState([
    "Bienvenue sur la plateforme officielle JADCI.",
    "Les inscriptions des jeunes et responsables régionaux sont ouvertes.",
    "Carte Jeune JADCI : 1 000 FCFA.",
  ]);

  const connexionAdmin = () => {
    if (motDePasse === "JADCI2026") {
      setAdminConnecte(true);
      setErreur("");
      setMotDePasse("");
    } else {
      setErreur("Mot de passe incorrect.");
    }
  };

  const traiterDemande = (id, nouveauStatut) => {
    setDemandes((liste) =>
      liste.map((demande) =>
        demande.id === id
          ? { ...demande, statut: nouveauStatut }
          : demande
      )
    );
  };

  const publierAnnonce = () => {
    if (!annonce.trim()) return;

    setAnnonces((liste) => [annonce.trim(), ...liste]);
    setAnnonce("");
  };

  const aller = (destination) => {
    setPage(destination);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const styles = {
    app: {
      minHeight: "100vh",
      background: "#f8f7ff",
      color: "#111827",
      fontFamily:
        "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },

    header: {
      background: "#ffffff",
      borderBottom: "1px solid #ebe7f7",
      position: "sticky",
      top: 0,
      zIndex: 100,
    },

    headerInner: {
      maxWidth: "1380px",
      margin: "0 auto",
      padding: "14px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "30px",
    },

    brand: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      minWidth: 0,
    },

    brandLogo: {
      width: "66px",
      height: "66px",
      objectFit: "contain",
      flexShrink: 0,
    },

    brandText: {
      minWidth: 0,
    },

    brandTitle: {
      margin: 0,
      color: "#5420a8",
      fontSize: "28px",
      fontWeight: 900,
      letterSpacing: "-1px",
    },

    brandSubtitle: {
      margin: "3px 0 0",
      color: "#64748b",
      fontSize: "14px",
      lineHeight: 1.4,
    },

    nav: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "6px",
      flexWrap: "wrap",
    },

    navButton: (active) => ({
      border: "none",
      borderRadius: "14px",
      padding: "13px 17px",
      background: active ? "#2456d8" : "transparent",
      color: active ? "#ffffff" : "#111827",
      fontSize: "16px",
      fontWeight: 750,
      cursor: "pointer",
      boxShadow: active
        ? "0 10px 24px rgba(37,86,216,.20)"
        : "none",
      transition: "all .2s ease",
    }),

    announcement: {
      background: "#4e2096",
      color: "#ffffff",
      display: "flex",
      alignItems: "stretch",
      minHeight: "54px",
    },

    announcementTitle: {
      background: "#2456d8",
      padding: "0 34px",
      display: "flex",
      alignItems: "center",
      fontWeight: 900,
      fontSize: "18px",
      whiteSpace: "nowrap",
    },

    announcementText: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px 25px",
      fontSize: "18px",
      fontWeight: 650,
      textAlign: "center",
    },

    main: {
      maxWidth: "1380px",
      margin: "0 auto",
      padding: "70px 40px 90px",
    },

    hero: {
      display: "grid",
      gridTemplateColumns: "1.05fr 0.95fr",
      alignItems: "center",
      gap: "70px",
      minHeight: "650px",
      marginBottom: "100px",
    },

    heroLeft: {
      minWidth: 0,
    },

    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 18px",
      borderRadius: "999px",
      background: "#f1eaff",
      border: "1px solid #ddccff",
      color: "#5420a8",
      fontWeight: 800,
      fontSize: "15px",
      marginBottom: "25px",
    },

    heroTitle: {
      margin: 0,
      color: "#111827",
      fontSize: "clamp(48px, 5.4vw, 78px)",
      lineHeight: 0.98,
      letterSpacing: "-3px",
      fontWeight: 900,
    },

    purple: {
      color: "#6428c7",
    },

    heroText: {
      maxWidth: "680px",
      margin: "30px 0 30px",
      color: "#60728b",
      fontSize: "20px",
      lineHeight: 1.7,
    },

    heroActions: {
      display: "flex",
      gap: "14px",
      flexWrap: "wrap",
    },

    button: {
      border: "none",
      borderRadius: "14px",
      padding: "15px 22px",
      background: "#2456d8",
      color: "#ffffff",
      fontWeight: 800,
      fontSize: "16px",
      cursor: "pointer",
      boxShadow: "0 12px 25px rgba(37,86,216,.20)",
      transition: "transform .2s ease",
    },

    secondaryButton: {
      border: "1px solid #d8c7ff",
      borderRadius: "14px",
      padding: "14px 22px",
      background: "#ffffff",
      color: "#5420a8",
      fontWeight: 800,
      fontSize: "16px",
      cursor: "pointer",
    },

    heroVisual: {
      position: "relative",
    },

    heroCard: {
      minHeight: "560px",
      borderRadius: "42px",
      padding: "50px 35px",
      background:
        "linear-gradient(145deg, #5420a8 0%, #702bd0 52%, #2456d8 100%)",
      color: "#ffffff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 30px 80px rgba(79,32,150,.25)",
    },

    heroDecorationOne: {
      position: "absolute",
      width: "230px",
      height: "230px",
      borderRadius: "50%",
      background: "rgba(255,255,255,.08)",
      top: "-80px",
      right: "-60px",
    },

    heroDecorationTwo: {
      position: "absolute",
      width: "180px",
      height: "180px",
      borderRadius: "50%",
      background: "rgba(255,255,255,.06)",
      bottom: "-70px",
      left: "-50px",
    },

    heroLogoCircle: {
      width: "255px",
      height: "255px",
      borderRadius: "50%",
      background: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "18px",
      boxSizing: "border-box",
      boxShadow: "0 20px 50px rgba(0,0,0,.18)",
      marginBottom: "35px",
      position: "relative",
      zIndex: 2,
    },

    heroLogo: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },

    heroCardText: {
      maxWidth: "500px",
      margin: 0,
      fontSize: "29px",
      lineHeight: 1.25,
      fontWeight: 850,
      position: "relative",
      zIndex: 2,
    },

    heroMission: {
      marginTop: "20px",
      color: "#fde047",
      fontSize: "22px",
      fontWeight: 900,
      position: "relative",
      zIndex: 2,
    },

    section: {
      marginBottom: "90px",
    },

    sectionHeader: {
      maxWidth: "760px",
      marginBottom: "35px",
    },

    sectionTitle: {
      margin: 0,
      color: "#172554",
      fontSize: "clamp(30px, 4vw, 44px)",
      fontWeight: 900,
      letterSpacing: "-1.5px",
    },

    sectionText: {
      color: "#64748b",
      fontSize: "18px",
      lineHeight: 1.7,
      margin: "12px 0 0",
    },

    cards: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "20px",
    },

    card: {
      background: "#ffffff",
      border: "1px solid #e8e3f3",
      borderRadius: "24px",
      padding: "28px",
      boxShadow: "0 12px 35px rgba(30,41,59,.06)",
    },

    cardIcon: {
      width: "58px",
      height: "58px",
      borderRadius: "17px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f1eaff",
      fontSize: "28px",
      marginBottom: "18px",
    },

    cardTitle: {
      margin: "0 0 10px",
      color: "#172554",
      fontSize: "20px",
      fontWeight: 850,
    },

    cardText: {
      margin: "0 0 20px",
      color: "#64748b",
      lineHeight: 1.65,
    },

    adminBox: {
      background: "#ffffff",
      borderRadius: "28px",
      border: "1px solid #e3d8f8",
      padding: "35px",
      boxShadow: "0 20px 55px rgba(76,29,149,.08)",
    },

    input: {
      width: "100%",
      boxSizing: "border-box",
      padding: "15px 17px",
      border: "1px solid #d4d9e5",
      borderRadius: "13px",
      fontSize: "16px",
      marginTop: "8px",
      marginBottom: "16px",
      outline: "none",
      fontFamily: "inherit",
    },

    tableWrapper: {
      overflowX: "auto",
    },

    table: {
      width: "100%",
      minWidth: "720px",
      borderCollapse: "collapse",
      marginTop: "20px",
    },

    th: {
      textAlign: "left",
      padding: "14px",
      background: "#f1efff",
      color: "#312e81",
      borderBottom: "1px solid #ddd6fe",
    },

    td: {
      padding: "14px",
      borderBottom: "1px solid #e8e8ef",
      color: "#475569",
    },

    footer: {
      background: "#151a35",
      color: "#ffffff",
      textAlign: "center",
      padding: "55px 25px",
    },

    footerLogo: {
      width: "80px",
      height: "80px",
      objectFit: "contain",
      background: "#ffffff",
      borderRadius: "50%",
      padding: "5px",
      marginBottom: "15px",
    },
  };

  const renderAccueil = () => (
    <>
      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.badge}>
            ✦ Plateforme officielle JADCI
          </div>

          <h1 style={styles.heroTitle}>
            Ensemble pour
            <br />
            une{" "}
            <span style={styles.purple}>
              jeunesse engagée
            </span>
          </h1>

          <p style={styles.heroText}>
            Bienvenue sur la plateforme numérique de la Jeunesse des
            Assemblées de Dieu de Côte d’Ivoire. Un espace pensé pour
            connecter, accompagner et servir la jeunesse.
          </p>

          <div style={styles.heroActions}>
            <button
              style={styles.button}
              onClick={() => aller("portail")}
            >
              🔐 Accéder au portail
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() => aller("boutique")}
            >
              🛍️ Découvrez la boutique
            </button>
          </div>
        </div>

        <div style={styles.heroVisual}>
          <div style={styles.heroCard}>
            <div style={styles.heroDecorationOne}></div>
            <div style={styles.heroDecorationTwo}></div>

            <div style={styles.heroLogoCircle}>
              <img
                src={logoJadci}
                alt="Logo JADCI"
                style={styles.heroLogo}
              />
            </div>

            <p style={styles.heroCardText}>
              Jeunesse des Assemblées
              <br />
              de Dieu de Côte d’Ivoire
            </p>

            <div style={styles.heroMission}>
              Foi • Service • Mission
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            Une plateforme au service de la jeunesse
          </h2>

          <p style={styles.sectionText}>
            Retrouvez les principaux services de la JADCI dans un seul
            espace.
          </p>
        </div>

        <div style={styles.cards}>
          <div style={styles.card}>
            <div style={styles.cardIcon}>👤</div>

            <h3 style={styles.cardTitle}>Espace Jeune</h3>

            <p style={styles.cardText}>
              Profil personnel, matricule unique, CV, photo et carte
              jeune JADCI.
            </p>

            <button
              style={styles.button}
              onClick={() => aller("utilisateurs")}
            >
              Mon espace
            </button>
          </div>

          <div style={styles.card}>
            <div style={styles.cardIcon}>🌍</div>

            <h3 style={styles.cardTitle}>
              Responsables régionaux
            </h3>

            <p style={styles.cardText}>
              Gestion des églises, projets, rapports, propositions et
              localisation.
            </p>

            <button
              style={styles.button}
              onClick={() => aller("utilisateurs")}
            >
              Découvrir
            </button>
          </div>

          <div style={styles.card}>
            <div style={styles.cardIcon}>🛍️</div>

            <h3 style={styles.cardTitle}>Boutique JADCI</h3>

            <p style={styles.cardText}>
              Livres, vêtements, gadgets et commandes de cartes jeunes.
            </p>

            <button
              style={styles.button}
              onClick={() => aller("boutique")}
            >
              Boutique
            </button>
          </div>

          <div style={styles.card}>
            <div style={styles.cardIcon}>📢</div>

            <h3 style={styles.cardTitle}>Annonces</h3>

            <p style={styles.cardText}>
              Programmes, événements, demandes, suggestions et
              informations officielles.
            </p>

            <button
              style={styles.button}
              onClick={() => aller("annonces")}
            >
              Voir les annonces
            </button>
          </div>
        </div>
      </section>
    </>
  );

  const renderPortail = () => {
    if (!adminConnecte) {
      return (
        <div className="login-page">
          <div style={styles.adminBox}>
            <div className="login-logo">
              <img src={logoJadci} alt="Logo JADCI" />
            </div>

            <h2 style={styles.sectionTitle}>
              Portail administrateur
            </h2>

            <p style={styles.sectionText}>
              Cet espace est réservé à l'administration générale de
              la JADCI.
            </p>

            <label>
              <strong>Mot de passe administrateur</strong>
            </label>

            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") connexionAdmin();
              }}
              placeholder="Entrez le mot de passe"
              style={styles.input}
            />

            {erreur && (
              <p className="error-message">
                ⚠️ {erreur}
              </p>
            )}

            <button
              style={{
                ...styles.button,
                width: "100%",
              }}
              onClick={connexionAdmin}
            >
              Se connecter
            </button>

            <p className="demo-password">
              Démonstration locale
              <br />
              Mot de passe temporaire :{" "}
              <strong>JADCI2026</strong>
            </p>
          </div>
        </div>
      );
    }

    return (
      <>
        <section style={styles.section}>
          <div className="dashboard-heading">
            <div>
              <h2 style={styles.sectionTitle}>
                Tableau de bord administrateur
              </h2>

              <p style={styles.sectionText}>
                Gestion générale de la plateforme JADCI.
              </p>
            </div>

            <button
              style={styles.secondaryButton}
              onClick={() => setAdminConnecte(false)}
            >
              🔒 Déconnexion
            </button>
          </div>

          <div style={styles.cards}>
            <div style={styles.card}>
              <div style={styles.cardIcon}>👥</div>
              <h3 style={styles.cardTitle}>Utilisateurs</h3>
              <strong className="dashboard-number">0</strong>
              <p style={styles.cardText}>Comptes actifs</p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardIcon}>⏳</div>
              <h3 style={styles.cardTitle}>Demandes</h3>
              <strong className="dashboard-number orange">
                {
                  demandes.filter(
                    (d) => d.statut === "En attente"
                  ).length
                }
              </strong>
              <p style={styles.cardText}>À traiter</p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardIcon}>🛍️</div>
              <h3 style={styles.cardTitle}>Commandes</h3>
              <strong className="dashboard-number green">0</strong>
              <p style={styles.cardText}>Commandes reçues</p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardIcon}>📢</div>
              <h3 style={styles.cardTitle}>Annonces</h3>
              <strong className="dashboard-number blue">
                {annonces.length}
              </strong>
              <p style={styles.cardText}>Annonces publiées</p>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.adminBox}>
            <h3 style={styles.cardTitle}>
              📋 Demandes à traiter
            </h3>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Nom</th>
                    <th style={styles.th}>Téléphone</th>
                    <th style={styles.th}>Ville</th>
                    <th style={styles.th}>Statut</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {demandes.map((demande) => (
                    <tr key={demande.id}>
                      <td style={styles.td}>{demande.type}</td>
                      <td style={styles.td}>{demande.nom}</td>
                      <td style={styles.td}>
                        {demande.telephone}
                      </td>
                      <td style={styles.td}>{demande.ville}</td>
                      <td style={styles.td}>
                        <span
                          className={
                            demande.statut === "En attente"
                              ? "status pending"
                              : demande.statut === "Validée"
                              ? "status validated"
                              : "status refused"
                          }
                        >
                          {demande.statut}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {demande.statut === "En attente" ? (
                          <div className="action-buttons">
                            <button
                              className="small-button success"
                              onClick={() =>
                                traiterDemande(
                                  demande.id,
                                  "Validée"
                                )
                              }
                            >
                              ✓
                            </button>

                            <button
                              className="small-button danger"
                              onClick={() =>
                                traiterDemande(
                                  demande.id,
                                  "Refusée"
                                )
                              }
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <strong>{demande.statut}</strong>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.adminBox}>
            <h3 style={styles.cardTitle}>
              📢 Publier une annonce officielle
            </h3>

            <textarea
              value={annonce}
              onChange={(e) => setAnnonce(e.target.value)}
              placeholder="Écrivez l'annonce officielle..."
              style={{
                ...styles.input,
                minHeight: "130px",
                resize: "vertical",
              }}
            />

            <button
              style={styles.button}
              onClick={publierAnnonce}
            >
              Publier l'annonce
            </button>

            <div className="announcement-list">
              {annonces.map((item, index) => (
                <div
                  key={index}
                  className="announcement-item"
                >
                  <span>📢</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  };

  const renderUtilisateurs = () => (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          Espace Utilisateurs
        </h2>

        <p style={styles.sectionText}>
          Choisissez votre espace pour accéder aux services JADCI.
        </p>
      </div>

      <div className="user-grid">
        <div style={styles.card}>
          <div style={styles.cardIcon}>👤</div>

          <h3 style={styles.cardTitle}>Espace Jeune</h3>

          <p style={styles.cardText}>
            Inscription, profil, matricule, CV, photo et carte
            Jeune JADCI.
          </p>

          <button style={styles.button}>
            Créer mon espace
          </button>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>🌍</div>

          <h3 style={styles.cardTitle}>
            Responsable régional
          </h3>

          <p style={styles.cardText}>
            Gestion des églises, projets, rapports et propositions
            régionales.
          </p>

          <button style={styles.button}>
            Créer mon espace
          </button>
        </div>
      </div>
    </section>
  );

  const renderBoutique = () => {
    const produits = [
      ["📖", "Livres évangéliques", "Livres et ressources chrétiennes"],
      ["👕", "Vêtements", "Articles et vêtements JADCI"],
      ["🎒", "Gadgets", "Accessoires et articles JADCI"],
      ["💳", "Carte Jeune", "Carte physique : 1 000 FCFA"],
    ];

    return (
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            🛍️ Boutique JADCI
          </h2>

          <p style={styles.sectionText}>
            Produits et services disponibles prochainement sur la
            plateforme.
          </p>
        </div>

        <div style={styles.cards}>
          {produits.map(([icon, title, text]) => (
            <div style={styles.card} key={title}>
              <div style={styles.cardIcon}>{icon}</div>

              <h3 style={styles.cardTitle}>{title}</h3>

              <p style={styles.cardText}>{text}</p>

              <button style={styles.button}>
                Voir le produit
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderAnnonces = () => (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          📢 Annonces JADCI
        </h2>

        <p style={styles.sectionText}>
          Programmes, événements et informations officielles.
        </p>
      </div>

      <div style={styles.cards}>
        {annonces.map((item, index) => (
          <div style={styles.card} key={index}>
            <div style={styles.cardIcon}>📢</div>

            <p style={styles.cardText}>
              {item}
            </p>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brand}>
            <img
              src={logoJadci}
              alt="Logo JADCI"
              style={styles.brandLogo}
            />

            <div style={styles.brandText}>
              <h1 style={styles.brandTitle}>JADCI</h1>

              <p style={styles.brandSubtitle}>
                Jeunesse des Assemblées de Dieu de Côte d'Ivoire
              </p>
            </div>
          </div>

          <nav style={styles.nav}>
            <button
              style={styles.navButton(page === "accueil")}
              onClick={() => aller("accueil")}
            >
              🏠 Accueil
            </button>

            <button
              style={styles.navButton(page === "portail")}
              onClick={() => aller("portail")}
            >
              🔐 Portail
            </button>

            <button
              style={styles.navButton(page === "utilisateurs")}
              onClick={() => aller("utilisateurs")}
            >
              👥 Utilisateurs
            </button>

            <button
              style={styles.navButton(page === "boutique")}
              onClick={() => aller("boutique")}
            >
              🛍️ Boutique
            </button>

            <button
              style={styles.navButton(page === "annonces")}
              onClick={() => aller("annonces")}
            >
              📢 Annonces
            </button>
          </nav>
        </div>
      </header>

      <div style={styles.announcement}>
        <div style={styles.announcementTitle}>
          📢 ANNONCE
        </div>

        <div style={styles.announcementText}>
          {annonces[0]}
        </div>
      </div>

      <main style={styles.main}>
        {page === "accueil" && renderAccueil()}
        {page === "portail" && renderPortail()}
        {page === "utilisateurs" && renderUtilisateurs()}
        {page === "boutique" && renderBoutique()}
        {page === "annonces" && renderAnnonces()}
      </main>

      <footer style={styles.footer}>
        <img
          src={logoJadci}
          alt="Logo JADCI"
          style={styles.footerLogo}
        />

        <h3 style={{ margin: "0 0 8px", fontSize: "25px" }}>
          JADCI
        </h3>

        <p style={{ margin: "0 0 8px", opacity: 0.85 }}>
          Jeunesse des Assemblées de Dieu de Côte d'Ivoire
        </p>

        <strong style={{ color: "#fde047" }}>
          Foi • Service • Mission
        </strong>

        <p
          style={{
            marginTop: "25px",
            opacity: 0.55,
            fontSize: "13px",
          }}
        >
          Plateforme JADCI — Version de développement
        </p>
      </footer>
    </div>
  );
}

export default App;