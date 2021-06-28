// eslint-disable-next-line import/prefer-default-export
export function selectLanguageText(state) {
  return state.settings.language.startsWith('fr') ? 'Français' : 'English';
}
