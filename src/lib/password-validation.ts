export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
} as const;

export type PasswordValidationResult =
  | { valid: true }
  | { valid: false; error: string };

export function validatePassword(password: string): PasswordValidationResult {
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    return {
      valid: false,
      error: `Le mot de passe doit contenir au moins ${PASSWORD_REQUIREMENTS.minLength} caractères`,
    };
  }

  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: "Le mot de passe doit contenir au moins une majuscule",
    };
  }

  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    return {
      valid: false,
      error: "Le mot de passe doit contenir au moins une minuscule",
    };
  }

  if (PASSWORD_REQUIREMENTS.requireNumber && !/[0-9]/.test(password)) {
    return {
      valid: false,
      error: "Le mot de passe doit contenir au moins un chiffre",
    };
  }

  return { valid: true };
}

export function getPasswordRequirementsText(): string {
  const requirements: string[] = [];

  requirements.push(`Minimum ${PASSWORD_REQUIREMENTS.minLength} caractères`);

  if (PASSWORD_REQUIREMENTS.requireUppercase) {
    requirements.push("majuscule");
  }

  if (PASSWORD_REQUIREMENTS.requireLowercase) {
    requirements.push("minuscule");
  }

  if (PASSWORD_REQUIREMENTS.requireNumber) {
    requirements.push("chiffre");
  }

  return requirements.join(", avec ");
}
