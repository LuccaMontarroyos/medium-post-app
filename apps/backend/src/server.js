import app from "./app.js";

app.listen(process.env.BACKEND_PORT, () => {
    console.log(`servidor rodando na porta ${process.env.BACKEND_PORT}`);
});