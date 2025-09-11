import Sequelize, { Model } from "sequelize";

class PostLike extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.STRING,
        post_id: Sequelize.STRING,
        is_deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
      },
      {
        sequelize,
      }
    );

    
  }
  
  static associate(models) {
    this.belongsTo(models.Post, { foreignKey: "post_id", as: "posts" });
    this.belongsTo(models.User, { foreignKey: "user_id", as: "users" });      
  }

}

export default new Postlike();
