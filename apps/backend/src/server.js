import app from "./app.js";

const port = process.env.BACKEND_PORT;

app.listen(port, () => {
    console.log(`servidor rodando na porta ${port}`);
});