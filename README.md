# run.js

nix based wrapper for playwright that evaluates javascript expression on a website and outputs the result.

```shell
./run.js "https://www.wikipedia.com" "document.title"
Wikipedia

./run.js "https://www.wikipedia.com" "1+2+3"
6
```
