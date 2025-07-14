module.exports = class AuthError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static BadRequest(message, errors = []) {
        return new AuthError(400, message, errors);
    }
    static Unauthorized() {
        return new AuthError(401, "User is not authorized");
    }
    static Forbidden(message) {
        return new AuthError(403, message);
    }
    static NotFound() {
        return new AuthError(404, "Resource not found");
    }
}