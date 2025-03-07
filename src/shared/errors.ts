export class ApplicationError extends Error {
    public readonly originalError?: Error;
    public readonly code?: string;

    constructor(message: string, originalError?: Error, code?: string) {
        super(message);
        this.name = this.constructor.name;
        this.originalError = originalError;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class DatabaseError extends ApplicationError {
    constructor(message: string, originalError?: Error) {
        super(message, originalError, 'DATABASE_ERROR');
    }
}

export class RepositoryError extends ApplicationError {
    constructor(message: string, originalError?: Error) {
        super(message, originalError, 'REPOSITORY_ERROR');
    }
}

export class ServiceError extends ApplicationError {
    constructor(message: string, originalError?: Error) {
        super(message, originalError, 'SERVICE_ERROR');
    }
}

export class UseCaseError extends ApplicationError {
    constructor(message: string, originalError?: Error) {
        super(message, originalError, 'USE_CASE_ERROR');
    }
}

export class AdapterError extends ApplicationError {
    constructor(message: string, originalError?: Error) {
        super(message, originalError, 'ADAPTER_ERROR');
    }
}

export class SecurityPolicyViolantionError extends Error {
    constructor() {
        super('Text does not follow usage policies.');
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
