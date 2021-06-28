export default {
  language: {
    locale: 'en',
    name: 'English'
  },
  common: {
    alert: {
      title: 'Alert',
      button: {
        ok: 'OK',
        cancel: 'Cancel'
      }
    },
    badge: {
      new: 'New',
      updated: 'Updated'
    },
    message: {
      loading: 'Loading, please wait...',
      error: {
        bookmark: {
          add: 'Unable to create bookmark at this time.',
          remove: 'Unable to remove bookmark at this time.'
        }
      }
    },
    readText: {
      more: 'Read more',
      less: 'Show less'
    }
  },
  tab: {
    screen: {
      homeLabel: 'Home',
      productsLabel: 'Products',
      bookmarksLabel: 'Bookmarks'
    }
  },
  home: {
    introCard: {
      title: 'Canadian Health Products',
      meta: 'Your evidence-based, trusted and unbiased information source for health products approved in Canada.',
      text: 'The information provided is not a substitute for professional advice, diagnosis or treatment. Always consult a medical professional before you take, change or stop using health products.',
      link: 'See terms of use for more details.'
    },
    infoCard: {
      title: 'Health Product Information for Canadians',
      currentText: 'This early edition of the Canadian Health Products app includes:',
      futureText: 'Future editions will include these health products:',
      products: {
        covidTitle: 'COVID-19 Vaccines and Treatments',
        drugsTitle: 'Drugs (Prescription and OTC)',
        naturalTitle: 'Natural Health Products',
        devicesTitle: 'Medical Devices',
        veterinaryTitle: 'Veterinary Medications'
      }
    },
    menu: {
      settingsLabel: 'Settings',
      languageLabel: 'Language...',
      privacyLabel: 'Privacy',
      aboutLabel: 'About',
      closeLabel: 'Close',
      toolsLabel: 'Dev Tools',
      removeLabel: 'Remove Data',
      sendNotificationLabel: 'Send Notification...',
      removeAlert: {
        title: 'Remove Data',
        text: 'Remove settings and bookmarks?'
      }
    },
    settings: {
      language: {
        title: 'Choose Language',
        touchText: 'English (Canada)'
      }
    },
    pushNotification: {
      card: {
        title: 'Send Push Notification',
        instructionText: 'Send a notification to your device from either the app or via the external tool (press, select and copy the Expo Push Token before navigating to the external tool).'
      },
      button: {
        sendTitle: 'Send Push Notification',
        toolTitle: 'Expo Push Notification Tool'
      }
    }
  },
  products: {
    searchBar: {
      placeholder: ''
    },
    card: {
      title: 'COVID-19 Health Products',
      instructionText: 'Select a Vaccine or Treatment product to learn more.',
      offlineText: 'Currently in offline mode (no internet access is detected). Only bookmarked products are available.'
    },
    buttons: {
      left: 'Vaccines',
      right: 'Treatments'
    },
    emptyText: {
      left: 'No vaccine products match your filter.',
      right: 'No treatment products match your filter.'
    }
  },
  productDetails: {
    card: {
      companyNameLabel: 'Company Name',
      ingredientLabel: 'Active Ingredient(s)',
      statusLabel: 'Status',
      approvalDateLabel: 'Date of Approval',
      consumerInformationText: 'This information was provided by the drug’s manufacturer when this drug product was approved for sale in Canada. It is designed for consumers and care givers. It is a summary of information about the drug and will not tell you everything about the drug. Contact your doctor or pharmacist if you have any questions about the drug.'
    },
    metadata: {
      din: 'DIN',
      strength: 'Strength',
      dosageForm: 'Dosage Form',
      administrationRoute: 'Route of Administration'
    },
    listItem: {
      publicationStatusLabel: 'Publication Status: ',
      publicationStatus: {
        pending: 'Pending',
        various: 'Various'
      }
    },
    accordion: {
      pri: 'Product Information',
      pmi: 'Patient Medication Information',
      add: 'Additional Resource Links',
      reg: 'Regulatory Announcements'
    },
    emptyText: {
      reg: 'There are no regulatory announcements to display at this time.'
    }
  },
  bookmarks: {
    introText: 'You have not bookmarked any product.',
    products: {
      searchBar: {
        placeholder: ''
      },
      card: {
        title: 'Bookmarks',
        instructionText: 'Select one of your bookmarked products to learn more.'
      },
      buttons: {
        left: 'Vaccines',
        right: 'Treatments'
      },
      emptyText: {
        left: 'You have not added any vaccine products to your bookmarks.',
        right: 'You have not added any treatment products to your bookmarks.'
      }
    }
  }
};
