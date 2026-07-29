export default {
    code(ctx){
        const fontFile = new FontFace(
        "Inconsolata",
        'url("/static/inconsolata.woff2") format("woff2")',
        { stretch: "50% 200%" },
        );

        document.fonts.add(fontFile);
        document.fonts.load("50px Inconsolata").then(() => {
            ctx.font = "50px 'Inconsolata'";
            ctx.fontStretch = 'extra-condensed';
            ctx.fontVariantCaps = 'all-small-caps'
            ctx.letterSpacing = '5px'
            ctx.wordSpacing = '20px'
            ctx.fillText('Hello world', 0, 50);
        })

    },
    title: 'more text drawing properties'
}