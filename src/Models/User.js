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
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: true
    }
  })

  return User
}
