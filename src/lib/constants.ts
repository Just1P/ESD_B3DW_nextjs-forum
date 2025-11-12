/**
 * Constantes de l'application
 */

/**
 * Messages de succès
 */
export const SUCCESS_MESSAGES = {
  SIGN_IN: "Connexion réussie !",
  SIGN_UP: "Inscription réussie !",
  SIGN_OUT: "Déconnexion réussie",
  PROFILE_UPDATED: "Profil mis à jour avec succès",
  CONVERSATION_CREATED: "Conversation créée avec succès !",
  CONVERSATION_DELETED: "Conversation supprimée avec succès !",
  MESSAGE_CREATED: "Message publié avec succès !",
  MESSAGE_UPDATED: "Message modifié avec succès !",
  MESSAGE_DELETED: "Message supprimé avec succès !",
  IMAGE_UPLOADED: "Image uploadée avec succès !",
  PASSWORD_RESET_EMAIL_SENT: "Email de réinitialisation envoyé !",
  PASSWORD_RESET: "Mot de passe réinitialisé avec succès !",
} as const;

/**
 * Messages d'erreur
 */
export const ERROR_MESSAGES = {
  GENERIC: "Une erreur est survenue. Veuillez réessayer.",
  NETWORK: "Erreur de connexion. Vérifiez votre connexion internet.",
  UNAUTHORIZED: "Vous devez être connecté pour effectuer cette action",
  FORBIDDEN: "Vous n'avez pas les permissions nécessaires",
  NOT_FOUND: "Ressource non trouvée",

  // Auth
  INVALID_CREDENTIALS: "Email ou mot de passe incorrect",
  EMAIL_NOT_FOUND: "Aucun compte trouvé avec cet email",
  EMAIL_ALREADY_EXISTS: "Cette adresse email est déjà utilisée",
  INVALID_TOKEN: "Token invalide ou expiré",

  // Validation
  REQUIRED_FIELD: "Ce champ est requis",
  INVALID_EMAIL: "Format d'email invalide",
  PASSWORD_TOO_SHORT: "Le mot de passe doit contenir au moins 8 caractères",
  PASSWORDS_DONT_MATCH: "Les mots de passe ne correspondent pas",

  // Operations
  CONVERSATION_CREATE_FAILED: "Échec de la création de la conversation",
  CONVERSATION_FETCH_FAILED: "Échec de la récupération de la conversation",
  CONVERSATION_DELETE_FAILED: "Échec de la suppression de la conversation",
  MESSAGE_CREATE_FAILED: "Échec de la création du message",
  MESSAGE_UPDATE_FAILED: "Échec de la modification du message",
  MESSAGE_DELETE_FAILED: "Échec de la suppression du message",
  VOTE_FAILED: "Erreur lors du vote",
  IMAGE_UPLOAD_FAILED: "Erreur lors de l'upload de l'image",
  PROFILE_UPDATE_FAILED: "Erreur lors de la mise à jour du profil",
} as const;

/**
 * Paramètres de validation
 */
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  BIO: {
    MAX_LENGTH: 500,
  },
  CONVERSATION_TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 200,
  },
  MESSAGE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 5000,
  },
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ACCEPTED_TYPES: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  },
} as const;

/**
 * Routes de l'application
 */
export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  ACCOUNT: "/account",
  CONVERSATION: (id: string) => `/conversations/${id}`,
  USER_PROFILE: (id: string) => `/users/${id}`,
} as const;

/**
 * Clés React Query
 */
export const QUERY_KEYS = {
  SESSION: ["session"],
  CONVERSATIONS: ["conversations"],
  CONVERSATION: (id: string) => ["conversation", id],
  MESSAGES: ["messages"],
  MESSAGE: (id: string) => ["message", id],
  USER: (id: string) => ["user", id],
  CURRENT_USER: ["currentUser"],
} as const;

/**
 * Durées (en millisecondes)
 */
export const DURATIONS = {
  TOAST: 3000,
  DEBOUNCE: 300,
  ANIMATION_SHORT: 150,
  ANIMATION_MEDIUM: 300,
  ANIMATION_LONG: 500,
} as const;
