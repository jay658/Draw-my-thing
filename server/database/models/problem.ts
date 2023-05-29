'use strict';

import {
  Model,
  Optional
}from "sequelize"

const difficulty = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard'
}

export type difficulty_type = keyof typeof difficulty

export interface ProblemAttributes {
  id: number;
  title: string;
  difficulty: difficulty_type;
  url: string;
  paid_only: boolean;
  total_accepted: number;
  total_submitted: number;
}

interface ProblemCreationAttributes extends Optional<ProblemAttributes, 'id'> {}

export class Problem extends Model<ProblemAttributes, ProblemCreationAttributes> implements ProblemAttributes {
  declare id: number;
  declare title: string;
  declare difficulty: difficulty_type;
  declare url: string;
  declare paid_only: boolean;
  declare total_accepted: number;
  declare total_submitted: number;

  public static associate(models: any) {
    Problem.hasMany(models.ProblemInfo)
  }
}

export default (sequelize: any, DataTypes: any) =>{

  Problem.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paid_only: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    total_accepted: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_submitted: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },{
    sequelize, 
    modelName: 'Problem'
  });
  return Problem
}