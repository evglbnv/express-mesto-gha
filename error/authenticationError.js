class AuthenticationError extends Error {
  constructor(message) {
    super(message);

    this.name = 'Authentication Error';
    this.statusCode = 401;
  }
}

module.exports = { AuthenticationError };
