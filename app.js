// AWS.config.region = 'ap-south-1';


// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: 'ap-south-1_HLccG4vNS' // Example: 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
// });

// const dynamoDB = new AWS.DynamoDB.DocumentClient();

// function handleFormSubmit(event) {
//     event.preventDefault(); // Prevents the page from refreshing when the form is submitted.

//     // 5. Capture the form values
//     // The ID used here (e.g., 'quantity', 'price') should match the input fields in your HTML form.
//     const quantity = document.getElementById('quantity').value;
//     const price = document.getElementById('price').value;
//     const orderOption = document.querySelector('input[name="orderOption"]:checked')?.value;

//     // 6. Check if an order option is selected
//     // If the user hasn't selected an order option, show an alert.
//     if (!orderOption) {
//         alert("Please select an order option.");
//         return;
//     } 

//     const orderData = {
//         symbol: "NIFTYIETF-EQ",  // Example symbol; replace as necessary for your use case.
//         quantity: parseInt(quantity),  // Convert quantity to an integer.
//         price: parseFloat(price),  // Convert price to a floating-point number.
//         orderOption: orderOption  // The selected order option (Market price, Trigger buy, etc.).
//     }

//     // 8. Print the data to the console (optional)
//     // This is useful for debugging. You can see the data that will be sent to DynamoDB in the browser console.
//     console.log('Form Data:', orderData);

//     // 9. Define DynamoDB parameters
//     // 'TableName' should be the actual name of your DynamoDB table where you want to insert the order data.
//     // Ensure that your table has the right structure and schema to accept the data.
//     const params = {
//         TableName: 'track_table',  // Replace 'your-table-name' with the name of your DynamoDB table.
//         Item: orderData  // The data that will be inserted into the DynamoDB table.
//     };

//     // 10. Insert data into DynamoDB
//     // This function attempts to insert the order data into the DynamoDB table.
//     // If successful, it will log a success message and show an alert.
//     // If there is an error, it will log the error and show an alert to the user.
//     dynamoDB.put(params, function(err, data) {
//         if (err) {
//             // 11. Handle errors
//             // If there's a problem inserting the data (e.g., network issues or incorrect table name), log the error.
//             console.error("Error inserting data into DynamoDB", err);
//             alert('There was a problem with your order submission.');
//         } else {
//             // 12. Success message
//             // If the data was inserted successfully, log the result and notify the user with an alert.
//             console.log("Success", data);
//             alert('Order submitted successfully!');
//         }
//     });
// }

// document.getElementById('order-form').addEventListener('submit', handleFormSubmit);
// ---------------------------------------------------------------------------------------------------------


window.onload = function() {
    // Check for existing AWS credentials (Cognito session)
    AWS.config.region = 'ap-south-1'; // Update to your region

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'ap-south-1_HLccG4vNS' // Update to your Identity Pool ID
    });

    AWS.config.credentials.get(function(err) {
        if (err) {
            console.log('No active session found. Redirecting to Cognito Hosted UI for login.');

            // Redirect to the Cognito Hosted UI
            const clientId = 'your_client_id'; // Replace with your Cognito User Pool App Client ID
            const redirectUri = encodeURIComponent('https://your-frontend-url'); // Replace with your frontend URL
            const cognitoDomain = 'your-domain.auth.ap-south-1.amazoncognito.com'; // Replace with your Cognito domain

            window.location.href = `https://${cognitoDomain}/login?client_id=${clientId}&response_type=token&scope=email+openid&redirect_uri=${redirectUri}`;
        } else {
            console.log('User is authenticated. Showing the form.');
            // The user is authenticated, so proceed to show the form and interact with DynamoDB
        }
    });
};

// Step 3: Create a DynamoDB DocumentClient instance
const dynamoDB = new AWS.DynamoDB.DocumentClient();

function handleFormSubmit(event) {
    event.preventDefault(); // Prevents the page from refreshing when the form is submitted.

    // Step 4: Capture the form values
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const orderOption = document.querySelector('input[name="orderOption"]:checked')?.value;

    // Step 5: Validate the form input
    if (!orderOption) {
        alert("Please select an order option.");
        return;
    } 

    // Step 6: Construct the data object to send
    const orderData = {
        symbol: "NIFTYIETF-EQ",  // You can replace this symbol with another if needed.
        quantity: parseInt(quantity),  // Convert quantity to an integer.
        price: parseFloat(price),  // Convert price to a floating-point number.
        orderOption: orderOption  // The selected order option (Market price, Trigger buy, etc.).
    };

    // Step 7: Debugging (Optional)
    console.log('Form Data:', orderData);

    // Step 8: Define the DynamoDB parameters
    const params = {
        TableName: 'track_table',  // Replace 'your-table-name' with the name of your DynamoDB table.
        Item: orderData  // The data that will be inserted into the DynamoDB table.
    };

    // Step 9: Insert data into DynamoDB
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

// Add an event listener to handle form submission
document.getElementById('order-form').addEventListener('submit', handleFormSubmit);
