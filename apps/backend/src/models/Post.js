import Sequelize, { Model } from "sequelize";

class Post extends Model {
    static init(sequelize) {
        super.init({
                title: Sequelize.STRING,
              text: Sequelize.STRING,
              resume: Sequelize.STRING,
              post_date: Sequelize.DATE,
              image: Sequelize.STRING,
        }, {
            sequelize
        })
    }
    
    static associate(models) {
        this.belongsTo(models.User, {foreignKey: 'user_id', as: 'users' });
    }
}

export default Post;