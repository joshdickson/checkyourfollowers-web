var mongoose	= require('mongoose');
var db 			= mongoose.connection;

var connectToServer = function() {
	mongoose.connect(process.env.MONGOHQ_URL, {
		server: {
			auto_reconnect: true,
		}
	});
};

db.on('connecting', function() {
	console.log('Connecting to MongoDB...');
})

db.on('error', function(error) {
	console.error(error);
	mongoose.disconnect();
})

db.on('disconnected', function() {
	console.log('MongoDB disconnected...');
	connectToServer();
})

// close the mongoose connection when if node process ends
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

connectToServer();

// export the class
module.exports = db;


