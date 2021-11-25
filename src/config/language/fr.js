export default {
  language: {
    locale: 'fr',
    name: 'Français'
  },
  common: {
    alert: {
      title: 'Alerte'
    },
    badge: {
      new: 'Nouveau',
      updated: 'Mise à jour'
    },
    button: {
      ok: 'OK',
      cancel: 'Annuler',
      remove: 'Supprimer'
    },
    message: {
      loading: 'Chargement en course, veuillez patienter...',
      error: {
        bookmark: {
          add: 'Impossible d’ajouter le favoris actuellement.',
          remove: 'Impossible de supprimer le favoris actuellement.'
        }
      }
    },
    readText: {
      more: 'Découvrir plus',
      less: 'Masquer'
    }
  },
  tab: {
    screen: {
      homeLabel: 'Accueil',
      productsLabel: 'Produits',
      bookmarksLabel: 'Favoris'
    }
  },
  home: {
    introCard: {
      title: 'Produits de santé canadiens',
      text: 'Information sur les produits de santé pour les Canadiens',
      link: 'Format alternatif'
    },
    menu: {
      aboutLabel: 'À propos',
      termsAndPrivacyLabel: 'Conditions et confidentialité',
      settingsLabel: 'Paramètres',
      languageLabel: 'Langue...',
      notificationsLabel: 'Notifications...',
      closeLabel: 'Fermer',
      toolsLabel: 'Outils de développement',
      removeLabel: 'Supprimer les données',
      sendNotificationLabel: 'Envoyer une notification...',
      removeAlert: {
        title: 'Supprimer les données',
        text: 'Supprimer les paramètres et les favoris?'
      }
    },
    about: {
      introCard: {
        title: 'À propos',
        meta: 'L’application mobile Produits de Santé Canadiens est une application du gouvernement du Canada alimentée par des données en direct de Santé Canada qui fournit aux Canadiens des informations factuelles, fiables et impartiales sur les produits de santé dont l’utilisation est approuvée au Canada.',
        text: 'Les informations fournies ne remplacent pas les conseils professionnels, un diagnostic ou un traitement. Consultez toujours un professionnel de la santé avant de prendre, de changer ou d’arrêter d’utiliser des produits de santé.',
        link: 'Voir les conditions d’utilisation pour plus de détails.'
      },
      infoCard: {
        title: 'Information sur les produits de santé pour les Canadiens',
        currentText: 'Cette première édition de l’application Produits de santé canadiens comprend:',
        futureText: 'Les prochaines éditions incluront ces produits de santé:',
        products: {
          covidTitle: 'Vaccins et traitements pour la COVID-19',
          drugsTitle: 'Médicaments (ordonnance, vente libre)',
          naturalTitle: 'Produits de santé naturels',
          devicesTitle: 'Dispositifs médicaux',
          veterinaryTitle: 'Médicaments vétérinaires'
        }
      }
    },
    notifications: {
      card: {
        title: 'Notifications',
        instructionText: ''
      },
      emptyText: 'Il n’y a actuellement aucun notification à afficher.'
    },
    settings: {
      language: {
        title: 'Modifier la langue',
        touchText: 'Français (Canada)'
      }
    },
    pushNotification: {
      card: {
        title: 'Envoyer une notification',
        instructionText: 'Envoyez une notification à...'
      },
      linkLabel: 'Ajouter un lien externe',
      button: {
        sendTitle: {
          self: 'Envoyer à soi-même',
          all: 'Envoyer à tous'
        }
      }
    }
  },
  products: {
    searchBar: {
      placeholder: ''
    },
    card: {
      title: 'Produits de santé COVID-19',
      instructionText: 'Sélectionner un vaccin ou traitement pour en savoir plus.',
      offlineText: 'Actuellement en mode hors-ligne, seuls les produits favoris sont disponibles.'
    },
    buttons: {
      left: 'Vaccins',
      right: 'Traitements'
    },
    emptyText: {
      left: 'Aucun vaccin ne correspond à vos paramètres.',
      right: 'Aucun produit de traitement ne correspond à vos paramètres.'
    }
  },
  productDetails: {
    card: {
      companyNameLabel: 'Entreprise',
      ingredientLabel: 'Ingrédient(s) actif',
      statusLabel: 'État',
      approvalDateLabel: 'Date d’approbation',
      productNote: 'Note',
      consumerInformationText: 'Ces renseignements ont été fournis par le fabricant au moment de l’homologation de son produit pour la vente au Canada. Ils sont destinés aux consommateurs et aux soignants. Il s’agit d’un résumé qui ne contient pas tous les renseignements pertinents sur le produit. Contactez votre médecin ou pharmacien si vous avez des questions au sujet du produit.'
    },
    metadata: {
      din: 'DIN',
      strength: 'Concentration', 
      dosageForm: 'Forme posologique',
      administrationRoute: 'Voie d’administration'
    },
    listItem: {
      publicationStatusLabel: 'Statut de publication: ',
      publicationStatus: {
        pending: 'En attendant',
        various: 'Plusieurs'
      }
    },
    accordion: {
      pri: 'Information sur le produit',
      pmi: 'Renseignments pour le patient sur le médicament',
      add: 'Liens vers des ressources supplémentaires',
      reg: 'Nouvelles'
    },
    portalLink: {
      title: 'Liens vers le Portail COVID-19',
      description: 'Rendez-vous sur le Portail COVID-19 pour plus d’informations sur ce produit.'
    },
    emptyText: {
      reg: 'Il n’y a actuellement aucun nouvelle à afficher.'
    }
  },
  bookmarks: {
    introText: 'Vous n’avez pas ajouté un produit à vos favoris.',
    products: {
      searchBar: {
        placeholder: ''
      },
      card: {
        title: 'Favoris',
        instructionText: 'Sélectionner le produit de votre choix pour en savoir plus.'
      },
      buttons: {
        left: 'Vaccins',
        right: 'Traitements'
      },
      emptyText: {
        left: 'Vous n’avez pas ajouté un vaccin à vos favoris.',
        right: 'Vous n’avez pas ajouté un produit de traitement à vos favoris.'
      }
    }
  }
};
