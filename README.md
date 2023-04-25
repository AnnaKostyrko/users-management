<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Description

It is my pet project of user management system with ability to create users with avatars and view users with paginated list.
The project is specific for the practice of framework and library features.

Technologies used:

Nest.js/Typescript
OOP
TypeORM
PostgreSQL

Tested with Postman

What was done:
Setup validation with custom errors based on Exception
Handled multipart-form with POST request with file (just for practice, it is not REST)
Cropped and optimized the avatar using the tinypng.com API.
Implemented a data generator and seeders
Added generation token with unvalidation after single request (for practiсe)
Added endpoint for avatar output based on Node.js streams


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
