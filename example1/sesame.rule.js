sesame.mock("getData", "POST", (req) => {
    console.log(req);

    return {
        cacaca: {
            $type: "number",
            range: [0, 100]
        },
        haha: "hahha"
    };
});