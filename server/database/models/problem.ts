'use strict';

import {
  Model,
  Optional
}from "sequelize"

interface ProblemAttributes {
  id: number;
  name: string;
}

interface ProblemCreationAttributes extends Optional<ProblemAttributes, 'id'> {}

export default (sequelize: any, DataTypes: any) =>{
  class Problem extends Model<ProblemAttributes, ProblemCreationAttributes> 
  implements ProblemAttributes {
    id!: number;
    name!: string;
  
    public static associate(models: any) {
      // Problem.belongsToMany(models.User,{
      //   through: "UserProblems"
      // })
    }
  }
  Problem.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },{
    sequelize, 
    modelName: 'Problem'
  });
  return Problem
}