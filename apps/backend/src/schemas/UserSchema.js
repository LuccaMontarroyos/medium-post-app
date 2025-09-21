import * as Yup from "yup";

export const userCreateSchema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Senha obrigatória"),
});

export const userUpdateSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email("E-mail inválido."),
  oldPassword: Yup.string().min(6),
  password: Yup.string()
    .min(6)
    .notRequired()
    .when("oldPassword", {
      is: (val) => !!val,
      then: (field) => field.required("Nova senha obrigatória"),
      otherwise: (field) => field.notRequired(),
    }),
  confirmPassword: Yup.string()
    .notRequired()
    .when("password", {
      is: (val) => !!val,
      then: (field) =>
        field
          .required("Confirmação de senha obrigatória")
          .oneOf([Yup.ref("password")], "Senhas não conferem"),
      otherwise: (field) => field.notRequired(),
    }),
});