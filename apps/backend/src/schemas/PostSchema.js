import Yup from "yup";

export const postSchema = Yup.object().shape({
    title: Yup.string().required(),
    text: Yup.string().required(),
    resume: Yup.string().required(),
});

