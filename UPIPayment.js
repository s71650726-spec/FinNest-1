import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class UPIPayment extends Model {}

UPIPayment.init(
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
    payeeVPA: {
      type: DataTypes.STRING,
      allowNull: false
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'success', 'failed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.ENUM('PhonePe', 'Paytm', 'GooglePay', 'BHIM_UPI'),
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'UPIPayment',
    tableName: 'upi_payments',
    timestamps: false,
    indexes: [{ fields: ['userId'] }, { fields: ['transactionId'], unique: true }]
  }
);
