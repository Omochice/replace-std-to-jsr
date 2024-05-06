# Replace std to jsr

The tiny tool to replace `https://deno.land/std@x.y.z/some-module/` to
`jsr:@std/some-module@x.y.z/`.

## Usage

```console
deno run --allow-read --allow-write --allow-env=HOME --allow-net jsr:@Omochice/replace-std-to-jsr@0.1.0/cli <target filepaths>
```

```
Usage: replace-std-to-jsr <in...>

Description:

  The tiny tool to replace `https://deno.land/std@x.y.z/some-module/` to `jsr:@std/some-module@x.y.z/`

Options:

  -h, --help  - Show this help.
  --dry-run   - dry run mode. Result show in stdout  (Default: false)
```

## License

[zlib](./LICENSE)
