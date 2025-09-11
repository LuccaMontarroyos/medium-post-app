import * as Yup from "yup";

export const postCreateSchema = Yup.object().shape({
  title: Yup.string().required(),
  text: Yup.string().required(),
  resume: Yup.string().required(),
  post_date: Yup.date().required(),
});
