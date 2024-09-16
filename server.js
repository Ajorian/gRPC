const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the protobuf
const packageDefinition = protoLoader.loadSync('average.proto', {});
const averageProto = grpc.loadPackageDefinition(packageDefinition).AverageService;

// Implement the CalculateAverage function
function calculateAverage(call, callback) {
    const numbers = call.request.numbers;
    const average = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    callback(null, { average });
}

// Create the gRPC server
const server = new grpc.Server();
server.addService(averageProto.service, { CalculateAverage: calculateAverage });

// Start the server
const PORT = '50051';
server.bindAsync(`127.0.0.1:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Server running at http://127.0.0.1:${port}`);
    server.start();
});
