# bloodbank-api
This is an API that allows hospitals to add blood samples and receivers to query/request for blood samples.

<strong> Authentication </strong> \

`JWT` is used for authentication. An access token and refresh token is provided upon successfully logging in. Refresh tokens can be used to request for a new access token once they have expired.

<strong> Roles: </strong>
1. `Receiver` 
2. `Hospital`

<strong> Servers </strong> \

Access tokens can be used to make requests to the API (on PORT 3000). Login,registering and requesting for new access tokens can be done by hitting the authentication server (PORT 4000). While making any request to API server, include the access token under the 'Authorization' key in headers. Include refresh token under the 'Authorization' key in headers while requesting for new access token.

# Start project
Install required packages:
```
npm i 
```
Run authentication server:
```
npm run devAuthStart 
```
Run API server:
```
npm run devStart
```
