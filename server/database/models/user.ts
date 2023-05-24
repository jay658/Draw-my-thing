'use strict';

import {
  Model,
  Optional,
  UUIDV4
}from "sequelize"

export interface UserAttributes {
  id: string;
  username: string;
  password: string;
  email: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export default (sequelize: any, DataTypes: any) =>{
  class User extends Model<UserAttributes, UserCreationAttributes> 
  implements UserAttributes{
    declare id: string;
    declare username: string;
    declare password: string;
    declare email: string;

    public static associate(models: any) {
      User.hasMany(models.ProblemInfo)
    }
  };
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },{
    sequelize, 
    modelName: 'User'
  });
  return User
}