'use strict';

class ValidationError extends Error {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    this.status = 400;
  }

  data() {
    return {
      name: this.name,
      status: this.status,
      message: this.message,
    };
  }
}

module.exports = ValidationError;
