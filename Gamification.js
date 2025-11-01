import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Gamification extends Model {}

Gamification.init(
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    xpPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    badges: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    streakCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastActiveDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    familyLeaderboardRank: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Gamification',
    tableName: 'gamifications',
    timestamps: false
  }
);
