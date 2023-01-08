const app = require("./app");
const dotenv = require("dotenv");
const connectDataBase = require("./config/database");

//setting up config file
dotenv.config({ path: "backend/config/config.env" });

//Handle Uncaught Exceptions 
process.on('uncaughtException', err=>{
	console.log(`ERROR : ${err.message}`);
	console.log("Shutting Down due to Unhandled Exception");

		process.exit(1);

})

//connecting to mongoDB database

connectDataBase();

const server =app.listen(process.env.PORT, () => {
	console.log(
		`listening on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
	);
});

//Handle Unhandled promise rejection
process.on('unhandledRejection', err=>{
	console.log(`ERROR : ${err.message}`);
	console.log("Shutting Down Server due to Unhandled promise rejection");
	server.close(()=>{
		process.exit(1);
	})
})