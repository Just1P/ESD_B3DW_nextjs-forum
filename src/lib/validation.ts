/**
 * Utilitaires de validation pour les formulaires
 */

/**
 * Valide le format d'une adresse email
 * @param email - L'email à valider
 * @returns true si l'email est valide, false sinon
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Type pour le résultat de validation du mot de passe
 */
export type PasswordValidationResult = true | string;

/**
 * Valide un mot de passe selon les critères de sécurité
 * @param password - Le mot de passe à valider
 * @returns true si valide, ou un message d'erreur
 */
export function validatePassword(password: string): PasswordValidationResult {
  if (password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères";
  }
  if (!/[A-Z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une majuscule";
  }
  if (!/[a-z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une minuscule";
  }
  if (!/[0-9]/.test(password)) {
    return "Le mot de passe doit contenir au moins un chiffre";
  }
  return true;
}

/**
 * Vérifie que deux mots de passe correspondent
 * @param password - Le mot de passe
 * @param confirmPassword - La confirmation du mot de passe
 * @returns true si identiques, message d'erreur sinon
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): PasswordValidationResult {
  if (password !== confirmPassword) {
    return "Les mots de passe ne correspondent pas";
  }
  return true;
}

/**
 * Critères de validation du mot de passe (pour affichage)
 */
export const PASSWORD_REQUIREMENTS = [
  "Au moins 8 caractères",
  "Une majuscule",
  "Une minuscule",
  "Un chiffre",
] as const;
