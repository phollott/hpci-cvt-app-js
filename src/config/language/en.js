export default {
  language: {
    locale: 'en',
    name: 'English'
  },
  common: {
    alert: {
      title: 'Alert'
    },
    badge: {
      new: 'New',
      updated: 'Updated'
    },
    button: {
      ok: 'OK',
      cancel: 'Cancel',
      remove: 'Remove'
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
      text: 'Health Product Information for Canadians',
      link: 'Alternative Format'
    },
    menu: {
      notificationsLabel: 'Notifications...',
      settingsLabel: 'Settings',
      languageLabel: 'Language...',
      termsAndPrivacyLabel: 'Terms of Use & Privacy',
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
    about: {
      introCard: {
        title: 'About',
        meta: 'The Canadian Health Products Mobile App is a Government of Canada app powered by live data from Health Canada that provides Canadians with evidence-based, trusted and unbiased information about health products approved for use in Canada.',
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
      }
    },
    notifications: {
      card: {
        title: 'Notifications',
        instructionText: ''
      },
      emptyText: 'There are no notifications to display at this time.'
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
        instructionText: 'Send a notification to...'
      },
      linkLabel: 'Add external link',
      button: {
        sendTitle: {
          self: 'Send to Self',
          all: 'Send to All'
        }
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
      productNote: 'Notes',
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
    portalLink: {
      title: 'Link to COVID-19 Portal',
      description: 'Go to the COVID-19 Portal for more information about this product.'
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
