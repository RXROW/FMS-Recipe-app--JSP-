export const EMAIL_VALIDATION = {
    required: "Email is Required",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i,
      message: "Email is not valid",
    },
  };
  