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
  num_solved: number;
  ac_easy: number;
  ac_medium: number;
  ac_hard: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export default (sequelize: any, DataTypes: any) =>{
  class User extends Model<UserAttributes, UserCreationAttributes> 
  implements UserAttributes{
    declare id: string;
    declare username: string;
    declare password: string;
    declare email: string;
    declare num_solved: number;
    declare ac_easy: number;
    declare ac_medium: number;
    declare ac_hard: number;

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
      validate: {
        isEmail: true
      }
    },
    num_solved: {
      type: DataTypes.INTEGER,
    },
    ac_easy: {
      type: DataTypes.INTEGER,
    },
    ac_medium: {
      type: DataTypes.INTEGER,
    },
    ac_hard: {
      type: DataTypes.INTEGER,
    },
  },{
    sequelize, 
    modelName: 'User'
  });
  return User
}