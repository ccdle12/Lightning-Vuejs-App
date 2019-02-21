const server = require("./server");

// Instantiate the app.
const { httpServer } = server();

// Server the api.
httpServer.listen(3000, () => console.log("Serving on port 3000..."));
