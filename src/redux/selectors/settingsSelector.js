export function selectLanguageText(state) {
  return state.settings.language.startsWith('fr') ? 'Français' : 'English';
}
