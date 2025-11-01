import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../config/database.js';

export class User extends Model {
  async validatePassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
      validate: { isEmail: true }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true
    },
    oauthProvider: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    oauthId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    biometricEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ['user'],
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.passwordHash && user.changed('passwordHash')) {
          const salt = await bcrypt.genSalt(12);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.passwordHash && user.changed('passwordHash')) {
          const salt = await bcrypt.genSalt(12);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      }
    }
  }
);
