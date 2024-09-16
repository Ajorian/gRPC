const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the protobuf
const packageDefinition = protoLoader.loadSync('average.proto', {});
const averageProto = grpc.loadPackageDefinition(packageDefinition).AverageService;

// Implement the CalculateAverage function
function calculateAverage(call, callback) {
    const numbers = call.request.numbers;
    if (!numbers || numbers.length === 0) {
        return callback({
            code: grpc.status.INVALID_ARGUMENT,
            details: 'No numbers provided.'
        });
    }
    
    const average = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    callback(null, { average });
}

// Create the gRPC server
const server = new grpc.Server();
server.addService(averageProto.service, { CalculateAverage: calculateAverage });

// Bind the server to the specified port
const PORT = process.env.PORT || 50051;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Error starting server:', err);
        return;
    }
    console.log(`Server running at http://0.0.0.0:${port}`);
    server.start();
});