import { Arg, Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver {
  @Query(() => String)
  async helloWorld(@Arg("data") data: string): Promise<String> {
    return "Hello world";
  }
}
