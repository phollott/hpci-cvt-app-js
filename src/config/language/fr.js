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
        }
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
  home: {
    introCard: {
      title: "Vaccins et traitements pour la COVID-19",
      text: "Renseignements sur les vaccins et traitements autorisés pour la COVID-19."
          + " Santé Canada s’engage à fournir l’information actualisée sur les vaccins et traitements pour la COVID-19."
    },
    button: {
      products: {
        title: "Vaccins et traitements"
      }
    },
    menu: {
      settingsLabel: "Paramètres",
      languageLabel: "Langue...",
      privacyLabel: "Confidentialité",
      aboutLabel: "À propos",
      closeLabel: "Fermer",
      toolsLabel: "Outils de développement",
      removeLabel: "Supprimer les données",
      sendNotificationLabel: "Envoyer une notification...",
      removeAlert: {
        title: "Supprimer les données",
        text: "Supprimer les paramètres et les favoris?"
      }
    },
    settings: {
      language: {
        title: "Modifier la langue",
        touchText: "Français (Canada)"
      }
    },
    pushNotification: {
      card: {
        title: "Envoyer une notification",
        instructionText: "Envoyez une notification à votre appareil à partir de l’application ou de l’outil externe (appuyez, sélectionnez et copiez le 'Expo Push Token' avant de naviguer vers l’outil externe)."
      },
      notification: {
        heading: "Notification reçue",
        title: "Titre",
        body: "Message",
        data: "Les données"
      },
      button: {
        sendTitle: "Envoyer une notification",
        toolTitle: "Expo Push Notification Tool",
      }
    }
  },
  products: {
    searchBar: {
      placeholder: ""
    },
    card: {
      title: "Produits de santé COVID-19",
      instructionText: "Sélectionner un vaccin ou traitement pour en savoir plus.",
      offlineText: "Actuellement en mode hors-ligne, seuls les produits favoris sont disponibles."
    },
    buttons: {
      left: "Vaccins",
      right: "Traitements"
    },
    emptyText: {
      left: "Aucun vaccin ne correspond à vos paramètres.",
      right: "Aucun produit de traitement ne correspond à vos paramètres."
    }
  },
  productDetails: {
    card: {
      companyNameLabel: "Entreprise",
      ingredientLabel: "Ingrédient",
      statusLabel: "État",
      approvalDateLabel: "Date d'approbation",
      consumerInformationText: "Ces renseignements ont été fournis par le fabricant au moment de l'homologation de son produit pour la vente au Canada. Ils sont destinés aux consommateurs et aux soignants. Il s'agit d'un résumé qui ne contient pas tous les renseignements pertinents sur le produit. Contactez votre médecin ou pharmacien si vous avez des questions au sujet du produit."
    },
    metadata: {
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
    },
    accordion: {
      pri: "Information sur le produit",
      pmi: "Renseignments pour le patient sur le médicament",
      add: "Liens vers des ressources supplémentaires",
      reg: "Nouvelles"
    }
  },
  bookmarks: {
    introText: "Vous n'avez pas ajouté un produit à vos favoris.",
    products: {
      searchBar: {
        placeholder: ""
      },
      card: {
        title: "Favoris",
        instructionText: "Sélectionner le produit de votre choix pour en savoir plus."
      },
      buttons: {
        left: "Vaccins",
        right: "Traitements"
      },
      emptyText: {
        left: "Vous n'avez pas ajouté un vaccin à vos favoris.",
        right: "Vous n'avez pas ajouté un produit de traitement à vos favoris."
      }
    }
  }
};
