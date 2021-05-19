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
      homeTitle: "Home",
      languageTitle: "Choose Language",
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
      removeLabel: "Remove Data",
      languageLabel: "Language...",
      privacyLabel: "Privacy",
      aboutLabel: "About",
      closeLabel: "Close",
      removeAlert: {
        title: "Remove Data",
        text: "Remove settings and bookmarks?"
      }
    },
    settings: {
      language: {
        touchText: "English (Canada)"
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
    }
  },
  productDetails: {
    card: {
      companyNameLabel: "Company Name: ",
      ingredientLabel: "Ingredient: ",
      statusLabel: "Status: ",
      approvalDateLabel: "Date of Approval: "
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
    }
  },
  bookmarks: {
    introText: "You have not added any bookmarks.",
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
      }
    }
  }
};
