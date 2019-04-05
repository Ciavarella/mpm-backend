module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    totalTime: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pausedTimes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    musicTime: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    userId: DataTypes.INTEGER
  })

  Session.associate = models => {
    Session.belongsTo(models.User, {
      as: 'User',
      foreignKey: 'userId'
    })
  }

  return Session
}
