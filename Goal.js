import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Goal extends Model {}

Goal.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    targetAmount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false
    },
    currentAmount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: '0.00'
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    aiRecommendedPlan: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    familyShared: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'Goal',
    tableName: 'goals',
    timestamps: true,
    indexes: [{ fields: ['userId'] }]
  }
);
