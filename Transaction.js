import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Transaction extends Model {}

Transaction.init(
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
    bankSyncId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'INR',
      validate: {
        len: [3, 3]
      }
    },
    merchantName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transactionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    isFraud: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    anomalyScore: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['bankSyncId'] },
      { fields: ['transactionDate'] }
    ]
  }
);
