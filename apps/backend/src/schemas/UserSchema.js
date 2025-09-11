import * as Yup from "yup";

export const userCreateSchema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("Senha obrigatória"),
});

export const userUpdateSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email("E-mail inválido."),
  oldPassword: Yup.string().min(6),
  password: Yup.string().min(6).when("oldPassword", (oldPassword, field) => oldPassword ? field.required() : field),
  confirmPassword: Yup.string().when("password", (password, field) => password ? field.required().oneOf([Yup.ref("password")]) : field
  ),
});
