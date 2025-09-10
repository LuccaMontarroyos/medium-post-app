import { Model } from "sequelize";

class Post extends Model {
    static init(sequelize) {
        super.init({
            title: Sequelize.STRING,
              text: Sequelize.STRING,
              resume: Sequelize.STRING,
              post_date: Sequelize.DATE,
        }, {
            sequelize
        })
    }
    
    static associate(models) {
        this.belongsTo(models.User, {foreignKey: 'user_id', as: 'users' });
    }
}

export default new Post();