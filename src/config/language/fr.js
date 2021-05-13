export default {
  language: {
    locale: "fr",
    name: "Français"
  },
  common: {
    alert: {
      title: "Alerte",
      button: {
        ok: "OK",
        cancel: "Annuler"
      }
    },
    badge: {
      new: "Nouveau",
      updated: "Modifié"
    },
    message: {
      loading: "Chargement en course, veuillez patienter...",
      error: {
        bookmark: {
          add: "Impossible d'ajouter le favoris actuellement.",
          remove: "Impossible de supprimer le favoris actuellement."
        },
        loading: "Incapable de charger"
      }
    }
  },
  tab: {
    screen: {
      homeLabel: "Accueil",
      productsLabel: "Produits",
      bookmarksLabel: "Favoris"
    }
  },
  stack: {
    screen: {
      homeTitle: "Accueil",
      languageTitle: "Modifier la langue",
      productsTitle: "Produits de santé COVID-19",
      productDetailsTitle: "Description du produit",
      productResourceTitle: "Ressource",
      bookmarksTitle: "Favoris"
    }
  },
  home: {
    introCard: {
      title: "Vaccins et traitements pour la COVID-19",
      text: "Renseignements sur les vaccins et traitements autorisés pour la COVID-19, ainsi que ceux dont l’examen est actuellement en cours."
          + " Santé Canada s’engage à fournir l’information actualisée sur les vaccins et traitements pour la COVID-19."
    },
    button: {
      products: {
        title: "Vaccins et traitements"
      }
    },
    menu: {
      settingsLabel: "Paramètres",
      removeLabel: "Supprimer les données",
      languageLabel: "Langue...",
      privacyLabel: "Confidentialité",
      aboutLabel: "À propos",
      closeLabel: "Fermer",
      removeAlert: {
        title: "Supprimer les données",
        text: "Supprimer les paramètres et les favoris?"
      }
    },
    settings: {
      language: {
        touchText: "Français (Canada)"
      }
    }
  },
  products: {
    searchBar: {
      placeholder: ""
    },
    card: {
      instructionText: "Sélectionner un vaccin ou traitement pour en savoir plus.",
      offlineText: "Actuellement en mode hors-ligne, seuls les produits favoris sont disponibles."
    },
    buttons: {
      authorized: "Produits autorisées",
      application: "Autres demandes reçues"
    }
  },
  productDetails: {
    card: {
      companyNameLabel: "Entreprise: ",
      ingredientLabel: "Ingrédient: ",
      statusLabel: "État: ",
      approvalDateLabel: "Date d'approbation: "
    },
    tableHead: {
      din: 'DIN',
      strength: 'Concentration', 
      dosageForm: 'Forme posologique',
      administrationRoute: 'Voie d\'administration'
    },
    listItem: {
      publicationStatusLabel: "Statut de publication: ",
      publicationStatus: {
        pending: "En attendant",
        various: "Plusieurs"
      }
    }
  },
  bookmarks: {
    introText: "Vous n'avez ajouté aucun favori.",
    products: {
      searchBar: {
        placeholder: ""
      },
      card: {
        instructionText: "Sélectionner le produit de votre choix pour en savoir plus."
      },
      buttons: {
        authorized: "Produits autorisées"
      }
    }
  }
};
