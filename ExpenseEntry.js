import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class ExpenseEntry extends Model {}

ExpenseEntry.init(
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
    amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    source: {
      type: DataTypes.ENUM('voice', 'photo', 'manual'),
      allowNull: false
    },
    receiptPhotoURL: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    }
  },
  {
    sequelize,
    modelName: 'ExpenseEntry',
    tableName: 'expense_entries',
    timestamps: true,
    indexes: [{ fields: ['userId'] }, { fields: ['entryDate'] }]
  }
);
