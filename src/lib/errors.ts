import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@/generated/prisma";

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public errors?: unknown) {
    super(message, HTTP_STATUS.BAD_REQUEST, "VALIDATION_ERROR");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Non authentifié") {
    super(message, HTTP_STATUS.UNAUTHORIZED, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Accès refusé") {
    super(message, HTTP_STATUS.FORBIDDEN, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Ressource non trouvée") {
    super(message, HTTP_STATUS.NOT_FOUND, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflit de ressource") {
    super(message, HTTP_STATUS.CONFLICT, "CONFLICT");
  }
}

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
  timestamp: string;
}

export function formatErrorResponse(
  error: Error | AppError,
  includeStack = false
): ErrorResponse {
  const response: ErrorResponse = {
    error: error.message,
    timestamp: new Date().toISOString(),
  };

  if (error instanceof AppError && error.code) {
    response.code = error.code;
  }

  if (error instanceof ValidationError && error.errors) {
    response.details = error.errors;
  }

  if (includeStack && process.env.NODE_ENV === "development") {
    response.details = {
      ...((response.details as object) || {}),
      stack: error.stack,
    };
  }

  return response;
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      formatErrorResponse(
        new ValidationError("Erreur de validation", error.flatten().fieldErrors)
      ),
      { status: HTTP_STATUS.BAD_REQUEST }
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error);
  }

  if (error instanceof AppError) {
    return NextResponse.json(formatErrorResponse(error), {
      status: error.statusCode,
    });
  }

  const genericError = new AppError(
    process.env.NODE_ENV === "development"
      ? error instanceof Error
        ? error.message
        : "Une erreur est survenue"
      : "Une erreur est survenue",
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  );

  return NextResponse.json(formatErrorResponse(genericError), {
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  });
}

function handlePrismaError(
  error: Prisma.PrismaClientKnownRequestError
): NextResponse {
  switch (error.code) {
    case "P2002": {
      const target = (error.meta?.target as string[]) || [];
      return NextResponse.json(
        formatErrorResponse(
          new ConflictError(
            `Une ressource avec ce ${target.join(", ")} existe déjà`
          )
        ),
        { status: HTTP_STATUS.CONFLICT }
      );
    }

    case "P2025": {
      return NextResponse.json(
        formatErrorResponse(new NotFoundError("Ressource non trouvée")),
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }

    case "P2003": {
      return NextResponse.json(
        formatErrorResponse(
          new ValidationError("Référence à une ressource invalide")
        ),
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    default: {
      return NextResponse.json(
        formatErrorResponse(
          new AppError(
            process.env.NODE_ENV === "development"
              ? error.message
              : "Erreur de base de données"
          )
        ),
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
      );
    }
  }
}

export function successResponse<T>(
  data: T,
  status: number = HTTP_STATUS.OK
): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export function createdResponse<T>(data: T): NextResponse<T> {
  return NextResponse.json(data, { status: HTTP_STATUS.CREATED });
}

export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT });
}
