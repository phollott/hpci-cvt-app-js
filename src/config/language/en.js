export default {
  language: {
    locale: "en",
    name: "English"
  },
  common: {
    alert: {
      title: "Alert",
      button: {
        ok: "OK",
        cancel: "Cancel"
      }
    },
    badge: {
      new: "New",
      updated: "Updated"
    },
    message: {
      loading: "Loading, please wait...",
      error: {
        bookmark: {
          add: "Unable to create bookmark at this time.",
          remove: "Unable to remove bookmark at this time."
        },
        loading: "Unable to load"
      }
    }
  },
  tab: {
    screen: {
      homeLabel: "Home",
      productsLabel: "Products",
      bookmarksLabel: "Bookmarks"
    }
  },
  stack: {
    screen: {
      languageTitle: "Choose Language",
      pushNotificationTitle: "Send Push Notification",
      productsTitle: "COVID-19 Health Products",
      productDetailsTitle: "Product Description",
      productResourceTitle: "Product Resource",
      bookmarksTitle: "Bookmarks"
    }
  },
  home: {
    introCard: {
      title: "COVID-19 Vaccines and Treatments",
      text: "Information on vaccines and treatments authorized for COVID-19."
          + " Health Canada is committed to providing up-to-date information related to vaccines and treatments for COVID-19."
    },
    button: {
      products: {
        title: "Vaccines and Treatments"
      }
    },
    menu: {
      settingsLabel: "Settings",
      languageLabel: "Language...",
      privacyLabel: "Privacy",
      aboutLabel: "About",
      closeLabel: "Close",
      toolsLabel: "Dev Tools",
      removeLabel: "Remove Data",
      sendNotificationLabel: "Send Notification...",
      removeAlert: {
        title: "Remove Data",
        text: "Remove settings and bookmarks?"
      }
    },
    settings: {
      language: {
        touchText: "English (Canada)"
      }
    },
    pushNotification: {
      notification: {
        heading: "Received Notification",
        title: "Title",
        body: "Body",
        data: "Data"
      },
      button: {
        sendTitle: "Send Push Notification",
        toolTitle: "Expo Push Notification Tool",
      }
    }
  },
  products: {
    searchBar: {
      placeholder: ""
    },
    card: {
      instructionText: "Select a Vaccine or Treatment product to learn more.",
      offlineText: "Currently in offline mode (no internet access is detected). Only bookmarked products are available."
    },
    buttons: {
      left: "Vaccines",
      right: "Treatments"
    },
    emptyText: {
      left: "No vaccine products match your filter.",
      right: "No treatment products match your filter."
    }
  },
  productDetails: {
    card: {
      companyNameLabel: "Company Name",
      ingredientLabel: "Ingredient",
      statusLabel: "Status",
      approvalDateLabel: "Date of Approval",
      consumerInformationText: "This information was provided by the drug’s manufacturer when this drug product was approved for sale in Canada. It is designed for consumers and care givers. It is a summary of information about the drug and will not tell you everything about the drug. Contact your doctor or pharmacist if you have any questions about the drug."
    },
    metadata: {
      din: 'DIN',
      strength: 'Strength', 
      dosageForm: 'Dosage Form',
      administrationRoute: 'Route of Administration'
    },
    listItem: {
      publicationStatusLabel: "Publication Status: ",
      publicationStatus: {
        pending: "Pending",
        various: "Various"
      }
    },
    accordion: {
      pri: "Product Information",
      pmi: "Patient Medication Information",
      add: "Additional Resource Links"
    }
  },
  bookmarks: {
    introText: "You have not bookmarked any product.",
    products: {
      searchBar: {
        placeholder: ""
      },
      card: {
        instructionText: "Select one of your bookmarked products to learn more."
      },
      buttons: {
        left: "Vaccines",
        right: "Treatments"
      },
      emptyText: {
        left: "You have not added any vaccine products to your bookmarks.",
        right: "You have not added any treatment products to your bookmarks."
      }
    }
  }
};
