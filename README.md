# Replace std to jsr

The tiny tool to replace `https://deno.land/std@x.y.z/some-module/` to
`jsr:@std/some-module@x.y.z/`.

## Usage

```console
deno run --allow-read --allow-write --allow-env=HOME,XDG_DATA_HOME --allow-net jsr:@Omochice/replace-std-to-jsr@0.1.2 <target filepaths>
```

```console
Usage: replace-std-to-jsr <filenames...>

Description:

  The tiny tool to replace `https://deno.land/std@x.y.z/some-module/` to `jsr:@std/some-module@x.y.z/`

Options:

  -h, --help  - Show this help.
  --dry-run   - dry run mode. Result show in stdout  (Default: false)
```

## License

[zlib](./LICENSE)
