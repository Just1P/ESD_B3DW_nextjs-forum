export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export type PasswordValidationResult = true | string;

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

export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): PasswordValidationResult {
  if (password !== confirmPassword) {
    return "Les mots de passe ne correspondent pas";
  }
  return true;
}

export const PASSWORD_REQUIREMENTS = [
  "Au moins 8 caractères",
  "Une majuscule",
  "Une minuscule",
  "Un chiffre",
] as const;
