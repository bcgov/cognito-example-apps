# Evaluate Existing AWS Cognito Adapter Libraries

## Background

Evaluation of existing libraries to help users connect to AWS Cognito OpenID Connect (OIDC) workflow.
We used the following criteria to evaluate them:

- **Open source License**
- **Minimum credentials**
- **OAuth2 workflow**
- **Confidential Access**
- **Identity provider hint**
- **Maintainability**

## Libraries

| Library                    | License            | Confidential | Support | OAuth2 | Repository                                                                              |
| -------------------------- | ------------------ | ------------ | ------- | ------ | --------------------------------------------------------------------------------------- |
| amazon-cognito-identity-js | Apache-2.0 License | No           | Good    | No     | https://github.com/aws-amplify/amplify-js/tree/main/packages/amazon-cognito-identity-js |
| aws-amplify-angular        | Apache-2.0 License | No           | Good    | Yes    | https://github.com/aws-amplify/amplify-js/tree/main/packages/aws-amplify-angular        |
| aws-amplify-react          | Apache-2.0 License | No           | Good    | Yes    | https://github.com/aws-amplify/amplify-js/tree/main/packages/aws-amplify-react          |
| aws-amplify-react-native   | Apache-2.0 License | No           | Good    | Yes    | https://github.com/aws-amplify/amplify-js/tree/main/packages/aws-amplify-react-native   |
| aws-amplify-vue            | Apache-2.0 License | No           | Good    | Yes    | https://github.com/aws-amplify/amplify-js/tree/main/packages/aws-amplify-vue            |
| passport-amazon            | MIT License        | Yes          | Bad     | Yes    | https://github.com/jaredhanson/passport-amazon                                          |
| passport-cognito-oauth2    | MIT License        | No           | Bad     | Yes    | https://github.com/ebuychance/passport-cognito-oauth2                                   |
| passport-openidconnect     | MIT License        | Yes          | Bad     | Yes    | https://github.com/jaredhanson/passport-openidconnect                                   |
| openid-client              | MIT License        | Yes          | Good    | Yes    | https://github.com/panva/node-openid-client                                             |

## Decision

- As `Confidential Access` is recommended for the web application on a server, the generic OpenID Relying Party (RP, Client) library, [openid-client](https://github.com/panva/node-openid-client), is the best fit for most of the cases. The example is located in [next-app-openid](../examples/next-app-openid).
- In case of using `Public Access` is inevitable such as Single Page Application (SPA) and Mobile app, the official `Amplify` library `aws-amplify` with a frontend-specific wrapper library can be used. In terms of the security perspective, `OAuth 2.0 Authorization Code with PKCE Flow` is highly recommanded for `Public Client` access.
  - https://aws.amazon.com/blogs/security/how-to-add-authentication-single-page-web-application-with-amazon-cognito-oauth2-implementation/
  - https://developer.okta.com/blog/2019/08/22/okta-authjs-pkce

## Java Application Resources

- https://docs.payara.fish/community/docs/5.201/documentation/payara-server/public-api/openid-connect-support.html
- https://connect2id.com/products/nimbus-oauth-openid-connect-sdk
- https://connect2id.com/products/nimbus-jose-jwt
- https://github.com/bcgov/moh-keycloak-user-management/blob/master/backend/src/main/java/ca/bc/gov/hlth/mohums/security/SecurityConfig.java
- https://github.com/bcgov/moh-hnclient-v2/blob/main/hnclient-v2/src/main/java/ca/bc/gov/hlth/hnclientv2/authentication/RetrieveAccessToken.java
- https://github.com/bcgov/moh-hni-esb/blob/main/hnsecure/src/main/java/ca/bc/gov/hlth/hnsecure/validation/TokenValidator.java

## References

- https://datatracker.ietf.org/doc/html/rfc6749
- https://datatracker.ietf.org/doc/html/rfc7517
- https://datatracker.ietf.org/doc/html/rfc7636
- https://openid.net/specs/openid-connect-core-1_0.html
- https://aws.amazon.com/blogs/mobile/understanding-amazon-cognito-user-pool-oauth-2-0-grants/
- https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
