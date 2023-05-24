'use strict';

import {
  Model,
  Optional,
  UUIDV4
}from "sequelize"

import { difficulty_type } from "./problem";

const status = {
  ac: 'ac',
  notac: 'notac',
}

export type status_type = keyof typeof status

export interface ProblemInfoAttributes {
  id: string;
  user_id: string;
  problem_id: number;
  status?: status_type;
  notes?: string;
  follow_up?: Date;
  attempt_diffculty?: difficulty_type;
  time_to_complete?: number;
}

interface ProblemInfoCreationAttributes extends Optional<ProblemInfoAttributes, 'id'> {}

export default (sequelize: any, DataTypes: any) =>{
  class ProblemInfo extends Model<ProblemInfoAttributes, ProblemInfoCreationAttributes> 
  implements ProblemInfoAttributes{
    declare id: string;
    declare user_id: string;
    declare problem_id: number;
    declare status?: status_type;
    declare notes?: string;
    declare follow_up?: Date;
    declare attempt_diffculty?: difficulty_type;
    declare time_to_complete?: number;

    public static associate(models: any) {
      ProblemInfo.belongsTo(models.User)
      ProblemInfo.belongsTo(models.Problem)
    }
  };
  ProblemInfo.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    problem_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('ac', 'notac'),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    follow_up: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    attempt_diffculty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      allowNull: true,
    },
    time_to_complete: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },{
    sequelize, 
    modelName: 'ProblemInfo'
  });
  return ProblemInfo
}