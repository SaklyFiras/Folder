const mongoose = require('mongoose');

const mongooseDataBase = ( ) =>{
mongoose.connect(process.env.DB_LOCAL_URL
).then(con =>{ console.log(`mongoDb connected with HOST : ${con.connection.host}`);})

}

module.exports = mongooseDataBase;