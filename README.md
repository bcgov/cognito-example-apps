# cognito_example_client_app

This repository contains client applications that can be used to test an app client in the BC Gov Cognito SSO Shared Service.

## Next-App

An example [Next.js](https://nextjs.org/) application to connect to Cognito App client without 3rd party library or wrapper.

- located in [examples/next-app](examples/next-app) directory.

### How to run

- Local development environment w/o Docker

1. Go to `examples/next-app`.
1. Copy `.env.example` to `.env.local`,
1. Set environment variables in `.env.local`.
1. Run the development server:

```sh
    yarn install
    yarn dev
```

- Docker based local development environment

1. Go to `examples/next-app`
1. Copy `.env.example` to `.env`,
1. Set environment variables in `.env`.
1. Run the `docker-compose` file:

```sh
    docker-compose up
```

- Docker Compose sources environment variables from a `.env` file located next to the docker-compose.yml file.

## Next-App-JWT

An example [Next.js](https://nextjs.org/) application to connect to Cognito App client using JWT (JSON Web Token).

- located in [examples/next-app-jwt](examples/next-app-jwt) directory.
- the setup process is the same as `Next-App`.

## Next-App-Openid

An example [Next.js](https://nextjs.org/) application to connect to Cognito App client using `openid-client`, which is a server side OpenID Relying Party.

- located in [examples/next-app-openid](examples/next-app-openid) directory.
- the setup process is the same as `Next-App`.

## React-App-Amplify

This is an example [React.js](https://reactjs.org/) application to connect to Cognito App client on client side using Amplify library.

- located in [examples/react-app-amplify](examples/react-app-amplify) directory.

### How to run

- Local development environment w/o Docker

1. Go to `examples/react-app-amplify`.
1. Copy `src/aws-exports.js.sample` to `src/aws-exports.js`,
1. Set values in `src/aws-exports.js`.
1. Run the development server:

```sh
    yarn install
    yarn start
```

- Docker based local development environment

1. Go to `examples/react-app-amplify`.
1. Copy `src/aws-exports.js.sample` to `src/aws-exports.js`,
1. Set values in `src/aws-exports.js`.
1. Run the `docker-compose` file:

```sh
    docker-compose up
```

## How to Contribute

If you would like to contribute, please see our [CONTRIBUTING](./CONTRIBUTING.md) guidelines.

Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md).
By participating in this project you agree to abide by its terms.

## License

[Apache-2.0 License](LICENSE)
