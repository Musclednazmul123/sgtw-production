import 'dotenv/config';
export default {
  _connection:
    'mongodb+srv://doadmin:4Xvw17prjzH65809@db-mongodb-nyc1-43817-d82ac8c7.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=db-mongodb-nyc1-43817',
  _local: 'mongodb://127.0.0.1:27017/' + process.env.DATABASE_NAME || 'test',
};
