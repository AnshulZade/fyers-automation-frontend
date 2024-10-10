window.onload = function() {
    // Extract the token from the URL (if available)
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const idToken = urlParams.get('id_token');
    


    if (idToken) {
        console.log('User is authenticated with User Pool. Setting up credentials.');
        console.log('ID Token:', idToken);
        const decodedToken = jwtDecode(idToken);
        console.log(decodedToken.exp); // Check if it's still valid

        // Initialize AWS SDK with User Pool token for Identity Pool credentials
        AWS.config.region = 'ap-south-1';
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'ap-south-1:7ab83ee6-b838-443f-a32d-d25f1bbbda3d', // Replace with your Identity Pool ID
            Logins: {
                'cognito-idp.ap-south-1.amazonaws.com/ap-south-1_HLccG4vNS': idToken // Replace with your User Pool ID
            }
        });

        AWS.config.credentials.get(function(err) {
            if (err) {
                console.error('Error getting AWS credentials', err);
            } else {
                console.log('AWS credentials obtained successfully.');

                // User is authenticated and has AWS credentials; show the form
                
                // Create the DynamoDB DocumentClient inside the callback after credentials are set
                const dynamoDB = new AWS.DynamoDB.DocumentClient();

                // Add form submission event listener here since it's dependent on credentials
                document.getElementById('order-form').addEventListener('submit', function(event) {
                    event.preventDefault();

                    // Capture form values
                    const quantity = document.getElementById('quantity').value;
                    const price = document.getElementById('price').value;
                    const orderOption = document.querySelector('input[name="orderOption"]:checked')?.value;

                    if (!orderOption) {
                        alert("Please select an order option.");
                        return;
                    }

                    // Construct data object
                    const orderData = {
                        symbol: "NIFTYIETF-EQ",
                        quantity: parseInt(quantity),
                        price: parseFloat(price),
                        orderOption: orderOption
                    };

                    // Define DynamoDB parameters
                    const params = {
                        TableName: 'track_table',  // Replace with your actual DynamoDB table name
                        Item: orderData
                    };

                    // Insert data into DynamoDB
                    dynamoDB.put(params, function(err, data) {
                        if (err) {
                            console.error("Error inserting data into DynamoDB", err);
                            alert('There was a problem with your order submission.');
                        } else {
                            console.log("Success", data);
                            alert('Order submitted successfully!');
                        }
                    });
                });
            }
        });
    } else {
        console.log('No User Pool session found. Redirecting to Cognito Hosted UI for login.');
        
        // Redirect to the Cognito Hosted UI for User Pool authentication
        const clientId = 'ej26behrsf4ea60v8hau6ld89'; // Replace with your Cognito User Pool App Client ID
        const redirectUri = encodeURIComponent('https://anshulzade.github.io/fyers-automation-frontend/'); // Replace with your frontend URL
        const cognitoDomain = 'cpy-automation.auth.ap-south-1.amazoncognito.com'; // Replace with your Cognito domain

        window.location.href = `https://${cognitoDomain}/login?client_id=${clientId}&response_type=token&scope=email+openid&redirect_uri=${redirectUri}`;
    }
};



// --------------------------------------------------------------------------------------------------------

// window.onload = function() {
//     // Extract the token from the URL (if available)
//     const urlParams = new URLSearchParams(window.location.hash.substring(1));
//     const idToken = urlParams.get('id_token');

//     if (idToken) {
//         console.log('User is authenticated with User Pool. Setting up credentials.');

//         // Initialize AWS SDK with User Pool token for Identity Pool credentials
//         AWS.config.region = 'ap-south-1';
//         AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//             IdentityPoolId: 'ap-south-1:7ab83ee6-b838-443f-a32d-d25f1bbbda3d', // Replace with your Identity Pool ID
//             Logins: {
//                 'cognito-idp.ap-south-1.amazonaws.com/ap-south-1_HLccG4vNS': idToken // Replace with your User Pool ID
//             }
//         });

//         AWS.config.credentials.get(function(err) {
//             if (err) {
//                 console.error('Error getting AWS credentials', err);
//             } else {
//                 console.log('AWS credentials obtained successfully.');
//                 // User is authenticated and has AWS credentials; show the form
//             }
//         });
//     } else {
//         console.log('No User Pool session found. Redirecting to Cognito Hosted UI for login.');
        
//         // Redirect to the Cognito Hosted UI for User Pool authentication
//         const clientId = 'ej26behrsf4ea60v8hau6ld89'; // Replace with your Cognito User Pool App Client ID
//         const redirectUri = encodeURIComponent('https://anshulzade.github.io/fyers-automation-frontend/'); // Replace with your frontend URL
//         const cognitoDomain = 'cpy-automation.auth.ap-south-1.amazoncognito.com'; // Replace with your Cognito domain

//         window.location.href = `https://${cognitoDomain}/login?client_id=${clientId}&response_type=token&scope=email+openid&redirect_uri=${redirectUri}`;
//     }
// };

// // Create a DynamoDB DocumentClient instance
// const dynamoDB = new AWS.DynamoDB.DocumentClient();

// function handleFormSubmit(event) {
//     event.preventDefault();

//     // Capture form values
//     const quantity = document.getElementById('quantity').value;
//     const price = document.getElementById('price').value;
//     const orderOption = document.querySelector('input[name="orderOption"]:checked')?.value;

//     if (!orderOption) {
//         alert("Please select an order option.");
//         return;
//     }

//     // Construct data object
//     const orderData = {
//         symbol: "NIFTYIETF-EQ",
//         quantity: parseInt(quantity),
//         price: parseFloat(price),
//         orderOption: orderOption
//     };

//     // Define DynamoDB parameters
//     const params = {
//         TableName: 'track_table',  // Replace with your actual DynamoDB table name
//         Item: orderData
//     };

//     // Insert data into DynamoDB
//     dynamoDB.put(params, function(err, data) {
//         if (err) {
//             console.error("Error inserting data into DynamoDB", err);
//             alert('There was a problem with your order submission.');
//         } else {
//             console.log("Success", data);
//             alert('Order submitted successfully!');
//         }
//     });
// }

// ---------------------------------------------------------------------------------------------------------


// window.onload = function() {
//     // Check for existing AWS credentials (Cognito session)
//     AWS.config.region = 'ap-south-1'; // Update to your region

//     AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//         IdentityPoolId: 'ap-south-1:7ab83ee6-b838-443f-a32d-d25f1bbbda3d' // Update to your Identity Pool ID
//     });

//     AWS.config.credentials.get(function(err) {
//         if (err) {
//             console.log('No active session found. Redirecting to Cognito Hosted UI for login.');

//             // Redirect to the Cognito Hosted UI
//             const clientId = 'ej26behrsf4ea60v8hau6ld89'; // Replace with your Cognito User Pool App Client ID
//             const redirectUri = encodeURIComponent('https://anshulzade.github.io/fyers-automation-frontend/'); // Replace with your frontend URL
//             const cognitoDomain = 'https://cpy-automation.auth.ap-south-1.amazoncognito.com'; // Replace with your Cognito domain

//             window.location.href = `https://${cognitoDomain}/login?client_id=${clientId}&response_type=token&scope=email+openid&redirect_uri=${redirectUri}`;
//         } else {
//             console.log('User is authenticated. Showing the form.');
//             // The user is authenticated, so proceed to show the form and interact with DynamoDB
//         }
//     });
// };

// // Step 3: Create a DynamoDB DocumentClient instance
// const dynamoDB = new AWS.DynamoDB.DocumentClient();

// function handleFormSubmit(event) {
//     event.preventDefault(); // Prevents the page from refreshing when the form is submitted.

//     // Step 4: Capture the form values
//     const quantity = document.getElementById('quantity').value;
//     const price = document.getElementById('price').value;
//     const orderOption = document.querySelector('input[name="orderOption"]:checked')?.value;

//     // Step 5: Validate the form input
//     if (!orderOption) {
//         alert("Please select an order option.");
//         return;
//     } 

//     // Step 6: Construct the data object to send
//     const orderData = {
//         symbol: "NIFTYIETF-EQ",  // You can replace this symbol with another if needed.
//         quantity: parseInt(quantity),  // Convert quantity to an integer.
//         price: parseFloat(price),  // Convert price to a floating-point number.
//         orderOption: orderOption  // The selected order option (Market price, Trigger buy, etc.).
//     };

//     // Step 7: Debugging (Optional)
//     console.log('Form Data:', orderData);

//     // Step 8: Define the DynamoDB parameters
//     const params = {
//         TableName: 'track_table',  // Replace 'your-table-name' with the name of your DynamoDB table.
//         Item: orderData  // The data that will be inserted into the DynamoDB table.
//     };

//     // Step 9: Insert data into DynamoDB
//     dynamoDB.put(params, function(err, data) {
//         if (err) {
//             console.error("Error inserting data into DynamoDB", err);
//             alert('There was a problem with your order submission.');
//         } else {
//             console.log("Success", data);
//             alert('Order submitted successfully!');
//         }
//     });
// }

// // Add an event listener to handle form submission
// document.getElementById('order-form').addEventListener('submit', handleFormSubmit);
