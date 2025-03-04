export const EMAIL_VALIDATION = {
    required: "Email is Required",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
      message: "Email is not valid",
    },
  };

  export const PASSWORD_VALIDATION = {
    required: "Password is required",
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      message: "Password must have at least one uppercase, one lowercase, one digit, one special character, and be at least 6 characters long",
    },
  };