/* Loads .env file variables into the process.env variable. 
 It automatically looks for the .ENV file in the root directory of the 
 application. */
import "dotenv/config";

/* Other imports */
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { GraphQLSchema } from "graphql";
import { HelloResolver } from "./Hello";

(async () => {
  // CREATE SCHEMA
  const schema: GraphQLSchema = await buildSchema({
    // resolvers: [__dirname + "/gql/resolvers/**/!(*.test).ts"],
    resolvers: [HelloResolver],
    dateScalarMode: "isoDate",
    authMode: "null",
    emitSchemaFile: {
      path: __dirname + "/gql/schema.gql",
      commentDescriptions: true,
      sortedSchema: false,
    },
  });

  // REGISTER SCHEMA WITH APOLLOSERVER
  const apolloServer: ApolloServer = new ApolloServer({
    schema,
  });

  // EXPRESS APP
  const app: express.Application = express();
  //body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // custom testing middleware

  apolloServer.applyMiddleware({ app: app, path: "/graphql" });

  // TEST DB CONNECTION
  createConnection()
    .then((connection) => {
      console.log("TypeORM successfully connected to the Postgres db.");
      app.listen(4000, () => {
        console.log(`Express server listening on PORT: 4000`);
        console.log("http://localhost:4000/graphql");
      });
    })
    .catch((error) => {
      console.log(
        "Error encountered when connecting TypeORM to the Postgres db."
      );
      console.error(error);
    });
})();
