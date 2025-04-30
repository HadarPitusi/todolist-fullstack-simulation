/**
 * A class that simulates a custom XMLHttpRequest for internal network operations.
 */
import { Network } from './network.js';

class FXMLHttpRequest {
    constructor() {
        /** @type {number} Response status code */
        this.status = 0;
        /** @type {number} Request state (similar to XMLHttpRequest) */
        this.readyState = 0;
        /** @type {Function|null} Function to be called when readyState changes */
        this.onreadystatechange = null;
        /** @type {string} Server response as text */
        this.responseText = "";
        /** @type {Object} Request headers */
        this.headers = {};
    }

    /**
     * Initializes a new request.
     * @param {string} method - HTTP method (GET, POST, etc.).
     * @param {string} url - The request URL.
     */
    open(method, url) {
        this.method = method;
        this.url = url;
        this.readyState = 1;
    }

    /**
     * Sets a header for the request.
     * @param {string} header - Header name.
     * @param {string} value - Header value.
     */
    setRequestHeader(header, value) {
        this.headers[header] = value;
    }

    /**
     * Sends the request to the server.
     * @param {string|null} data - The request payload (optional).
     */
    send(data = null) {
        this.readyState = 4;
        try {
            let parsedData = null;
            if (data && this.headers["Content-Type"] === "application/json") {
                parsedData = JSON.parse(data);
            }

            // Attach sessionId to all requests except registration
            const sessionId = localStorage.getItem('sessionId');
            if (sessionId) {
                this.setRequestHeader("sessionId", sessionId);
            }

            let requestPayload = { method: this.method, url: this.url, data: parsedData, sessionId };
            
            if (this.method === "GET") {
                this.handleGetRequest(requestPayload);
            } else if (this.method === "POST") {
                this.handlePostRequest(requestPayload);
            } else if (this.method === "PUT") {
                this.handlePutRequest(requestPayload);
            } else if (this.method === "DELETE") {
                this.handleDeleteRequest(requestPayload);
            } else {
                this.status = 400;
                this.responseText = JSON.stringify({ error: "Invalid request" });
                if (this.onreadystatechange) this.onreadystatechange();
            }
        } catch (error) {
            this.status = 500;
            this.responseText = JSON.stringify({ error: error.message });
            if (this.onreadystatechange) this.onreadystatechange();
        }
    }

    /**
     * Handles a GET request using the Network API.
     * @param {Object} request - The request object.
     */
    handleGetRequest(request) {
        Network.send(request, (response) => {
            this.processResponse(response);
        });
    }

    /**
     * Handles a POST request using the Network API.
     * @param {Object} request - The request object.
     */
    handlePostRequest(request) {
        Network.send(request, (response) => {
            this.processResponse(response);
        });
    }

    /**
     * Handles a PUT request using the Network API.
     * @param {Object} request - The request object.
     */
    handlePutRequest(request) {
        Network.send(request, (response) => {
            this.processResponse(response);
        });
    }

    /**
     * Handles a DELETE request using the Network API.
     * @param {Object} request - The request object.
     */
    handleDeleteRequest(request) {
        Network.send(request, (response) => {
            this.processResponse(response);
        });
    }

    /**
     * Processes the server response and updates the request state.
     * @param {Object} response - The server response.
     */
    processResponse(response) {
        if (response) {
            this.status = response.status;
            this.responseText = JSON.stringify(response);
        } else {
            this.status = 500;
            this.responseText = JSON.stringify({ error: "Network error" });
        }
        if (this.onreadystatechange) this.onreadystatechange();
    }
}

export { FXMLHttpRequest };