import User from "../models/User";
import jwt from "jsonwebtoken";

class SessionController {
    async store(req, res) {
        const { email, password } = req.body;
        
        const user = await User.findOne({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(400).json({ error: "Usuário não existe."});
        }

        if(!(await user.checkPassword(password))) {
            return res.status(400).json({ error: "Senha inválida."})
        }

        const {id, name} = user;
        return res.json({user: {
            id,
            name,
            email
        },
        token:
        jwt.sign({id}, authConfig.secret, {
            expiresIn: authConfig.expiresIn
        })
    })
    }
}

export default new SessionController();