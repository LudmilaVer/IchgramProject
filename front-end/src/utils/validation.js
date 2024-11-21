// src/utils/validation.js

export const validateField = (name, value, t) => {
    switch (name) {
      case "email":
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          return t("invalid_email");
        }
        return "";
      case "fullName":
        if (value.trim().length < 3) {
          return t("full_name_error");
        }
        return "";
      case "username":
        if (value.trim().length < 3) {
          return t("username_error");
        }
        return "";
      case "password":
        if (value.length < 6) {
          return t("password_error");
        }
        return "";
      default:
        return "";
    }
  };
  
  export const validateForm = (fields, t) => {
    const errors = {};
    Object.keys(fields).forEach((name) => {
      const error = validateField(name, fields[name], t);
      if (error) {
        errors[name] = error;
      }
    });
    return errors;
  };
  