# font-machine
quick and dirty command line tool for quickly creating a css stylesheet from a directory of `TTF` and `OTF` fonts. Not for production! It creates a new font-face definition for each file. You font-family name is the filename.

# install
```bash
npm install -g font-machine
```

# usage
```bash
font-machine fontDir output.css output.html [-r]
```
**`fontDir`** path to the directory with your fonts. `.ttf`, `.TTF`, and `.otf` files are supported.

**second argument** is the output css file. (default font.css)

**third argument** is the output html file. (default font.html)

`-r` will rename font-files and remove spaces and replace with underscores. By default, it will not rename files and warn you that some fonts may not work. Just make a copy of your font dir, rename and use that.

HTML file will just use each font with a `<h1>`. Quick way to check if everything worked OK.

# licence
MIT
