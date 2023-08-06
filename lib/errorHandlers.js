exports.throwError500 = async function (res, error) {
    console.log({ error });
    res.status(500).json({
        message: "Internal Server Error",
        // error,
    });
}
