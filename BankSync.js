import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import crypto from 'crypto';

const ENCRYPTION_KEY = crypto.createHash('sha256').update(String(process.env.JWT_SECRET)).digest('base64').substr(0, 32);
const IV_LENGTH = 16;

function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  if (!text) return null;
  const parts = text.split(':');
  if (parts.length !== 2) return null;
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export class BankSync extends Model {
  getAccountNumber() {
    return decrypt(this.accountNumber);
  }
  setAccountNumber(value) {
    this.accountNumber = encrypt(value);
  }
  getPlaidAccessToken() {
    return decrypt(this.plaidAccessToken);
  }
  setPlaidAccessToken(value) {
    this.plaidAccessToken = encrypt(value);
  }
  getTrueLayerAccessToken() {
    return decrypt(this.truelayerAccessToken);
  }
  setTrueLayerAccessToken(value) {
    this.truelayerAccessToken = encrypt(value);
  }
}

BankSync.init(
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
    bankName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    accountNumber: {
      type: DataTypes.TEXT,
      allowNull: true,
      set(value) {
        this.setDataValue('accountNumber', encrypt(value));
      },
      get() {
        const encrypted = this.getDataValue('accountNumber');
        return decrypt(encrypted);
      }
    },
    lastSyncDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    syncStatus: {
      type: DataTypes.ENUM('pending', 'success', 'failed'),
      defaultValue: 'pending'
    },
    plaidAccessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      set(value) {
        this.setDataValue('plaidAccessToken', encrypt(value));
      },
      get() {
        const encrypted = this.getDataValue('plaidAccessToken');
        return decrypt(encrypted);
      }
    },
    truelayerAccessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      set(value) {
        this.setDataValue('truelayerAccessToken', encrypt(value));
      },
      get() {
        const encrypted = this.getDataValue('truelayerAccessToken');
        return decrypt(encrypted);
      }
    }
  },
  {
    sequelize,
    modelName: 'BankSync',
    tableName: 'bank_syncs',
    timestamps: true,
    indexes: [{ fields: ['userId'] }]
  }
);
