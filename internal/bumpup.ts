import { Command } from "jsr:@cliffy/command@1.0.0-rc.5";

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

  if (!isSemver(options.next)) {
    console.error(`Invalid version number: ${options.next}`);
    Deno.exit(1);
  }
  config.version = options.next;

  Deno.writeTextFileSync(args[0], JSON.stringify(config, null, 2));
}

function isSemver(version: string): boolean {
  return /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
    .test(version);
}
