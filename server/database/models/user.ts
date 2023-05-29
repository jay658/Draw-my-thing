'use strict';

import {
  FindOptions,
  Model,
  Optional,
  UUIDV4
}from "sequelize"

import db from ".";

export interface UserAttributes {
  id?: string;
  username: string;
  email?: string;
  num_solved?: number;
  ac_easy?: number;
  ac_medium?: number;
  ac_hard?: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes{
  declare id: string;
  declare username: string;
  declare email: string;
  declare num_solved: number;
  declare ac_easy: number;
  declare ac_medium: number;
  declare ac_hard: number;
  
  public static associate(models: any) {
    User.hasMany(models.ProblemInfo)
  }

  public static async createUser(info: UserAttributes): Promise<User> {
    return db.User.create(info)
  }

  public static async findUser (options: FindOptions): Promise<User> {
    return db.User.findOne(options)
  }
};

export default (sequelize: any, DataTypes: any) =>{

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
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    num_solved: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ac_easy: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ac_medium: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ac_hard: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },{
    sequelize, 
    modelName: 'User'
  });

  return User
}