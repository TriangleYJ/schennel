const { MYSQL_ROOT_PASSWORD, MYSQL_HOST } = process.env

module.exports = {
  "development": {
    "username": "root",
    "password": MYSQL_ROOT_PASSWORD,
    "database": "schennel",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": MYSQL_ROOT_PASSWORD,
    "database": "schennel",
    "host": MYSQL_HOST,
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": MYSQL_ROOT_PASSWORD,
    "database": "schennel",
    "host": MYSQL_HOST,
    "dialect": "mysql"
  }
}
