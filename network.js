// This file defines a Network class that simulates network behavior with delays and packet loss.
//const Server = require('./server.js');
import { Server } from './server.js';
class Network {
    // Static method to send a request over the "network" and handle the response.
    static send(request, callback) {
        // Simulate network delay between 1-3 seconds (1000-3000ms).
        const delay = Math.random() * 2000 + 1000;
        // 25% chance to drop the request, mimicking network unreliability.
        const dropRate = 0.25;
        
        // Delay the response to simulate network latency.
        setTimeout(() => {
            // Randomly decide if the request is dropped based on dropRate.
            if (Math.random() > dropRate) {
                // If not dropped, pass the request to the Server for processing.
                const response = Server.handleRequest(request);
                // Call the callback with the server's response.
                callback(response);
            } else {
                // If dropped, log a warning and return null to indicate failure.
                console.warn('Network dropped the request:', request);
                callback(null);
            }
        }, delay);
    }
}

// Export the Network class so it can be used by FXMLHttpRequest.
export { Network };
