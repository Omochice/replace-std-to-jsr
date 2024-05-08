# Replace std to jsr

The tiny tool to replace `https://deno.land/std@x.y.z/some-module/` to
`jsr:@std/some-module@x.y.z/`.


## Usage

```console
deno run --allow-read --allow-write --allow-env --allow-net=jsr.io --allow-sys=cpus jsr:@Omochice/replace-std-to-jsr@0.2.0 <target filepaths>

```console
Usage: replace-std-to-jsr <filenames...>

Description:

  The tiny tool to replace `https://deno.land/std@x.y.z/some-module/` to `jsr:@std/some-module@x.y.z/`

Options:

  -h, --help  - Show this help.
  --dry-run   - dry run mode. Result show in stdout  (Default: false)
```

This script(All are used by [ts-morph](https://github.com/dsherret/ts-morph)) reads bellow environments.

- `TS_ETW_MODULE_PATH`
- `TSC_WATCHFILE`
- `TSC_NONPOLLING_WATCHER`
- `TSC_WATCHDIRECTORY`
- `NODE_INSPECTOR_IPC`
- `VSCODE_INSPECTOR_OPTIONS`
- `TSC_WATCH_POLLINGINTERVAL_LOW`
- `TSC_WATCH_POLLINGINTERVAL_MEDIUM`
- `TSC_WATCH_POLLINGINTERVAL_HIGH`
- `TSC_WATCH_POLLINGCHUNKSIZE_LOW`
- `TSC_WATCH_POLLINGCHUNKSIZE_MEDIUM`
- `TSC_WATCH_POLLINGCHUNKSIZE_HIGH`
- `TSC_WATCH_UNCHANGEDPOLLTHRESHOLDS_LOW`
- `TSC_WATCH_UNCHANGEDPOLLTHRESHOLDS_MEDIUM`
- `TSC_WATCH_UNCHANGEDPOLLTHRESHOLDS_HIGH`
- `NODE_ENV`
- `__MINIMATCH_TESTING_PLATFORM__`
- `__TESTING_MKDIRP_PLATFORM__`
- `__TESTING_MKDIRP_NODE_VERSION__`


## License

[zlib](./LICENSE)

