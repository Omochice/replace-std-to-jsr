import { Command } from "jsr:@cliffy/command@1.0.0-rc.4";
if (import.meta.main) {
  const { args, options } = await new Command()
    .name("bumpup")
    .description(
      "bumpup script",
    )
    .arguments("<in:string>")
    .option("--next <version>", "next version", { required: true })
    .parse(Deno.args);

  const content = Deno.readTextFileSync(args[0]);
  const config = JSON.parse(content) as {
    name: string;
    version: string;
    exports: string | Record<string, string>;
  };

  config.version = options.next;

  Deno.writeTextFileSync(args[0], JSON.stringify(config, null, 2));
}
