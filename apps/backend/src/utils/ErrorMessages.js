const ErrorMessages = {
    required: (field) => `${field} é obrigatório.`,
    min: (field, value) => `${field} deve ter no mínimo ${value} caracteres.`,
    email: (field) => `${field} deve ser um e-mail válido.`,
    oneOf: (field) => `${field} não confere.`,
    
  };
  
  export default ErrorMessages;