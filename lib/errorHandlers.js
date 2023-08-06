
exports.throwError500 = async function (res, error) {
    console.log({ error });
    res.status(500).json({
        error: true,
        message: "Internal Server Error"
    });
}
