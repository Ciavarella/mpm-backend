module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    spotifyId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  User.associate = models => {
    User.hasMany(models.Session, {
      as: 'Sessions',
      foreignKey: 'id'
    })
  }

  return User
}
