sesame.mock("getData", "POST", (req) => {
    return sesame.toJson({
        cacaca: {
            $type: "number",
            range: [0, 100]
        },         
        haha: "hahha"
    });
});