// Configure AWS SDK
AWS.config.region = 'your-region'; // e.g., 'us-east-1'
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'your-identity-pool-id' // e.g., 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
});

// Create a DynamoDB DocumentClient instance
const dynamoDB = new AWS.DynamoDB.DocumentClient();

function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Capture values from the form
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const orderOption = document.querySelector('input[name="orderOption"]:checked')?.value;

    if (!orderOption) {
        alert("Please select an order option.");
        return;
    }

    // Construct the data object to send
    const orderData = {
        symbol: "NIFTYIETF-EQ",  // Example symbol, adjust as needed
        quantity: parseInt(quantity),
        price: parseFloat(price),
        orderOption: orderOption
    };

    // For local testing: Print the data to the console
    console.log('Form Data:', orderData);

    // Define the DynamoDB parameters
    const params = {
        TableName: 'your-table-name',  // Replace with your actual DynamoDB table name
        Item: orderData
    };

    // Put the data into DynamoDB
    dynamoDB.put(params, function(err, data) {
        if (err) {
            console.error("Error inserting data into DynamoDB", err);
            alert('There was a problem with your order submission.');
        } else {
            console.log("Success", data);
            alert('Order submitted successfully!');
        }
    });
}
