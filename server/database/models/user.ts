'use strict';

import {
  Model,
  Optional,
  UUIDV4
}from "sequelize"

interface UserAttributes {
  id: string;
  name: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export default (sequelize: any, DataTypes: any) =>{
  class User extends Model<UserAttributes, UserCreationAttributes> 
  implements UserAttributes{
    public id!: string;
    public name!: string;

    public static associate(models: any) {
      // User.belongsToMany(models.Problem,{
      //   through: "UserProblems"
      // })
    }
  };
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },{
    sequelize, 
    modelName: 'User'
  });
  return User
}