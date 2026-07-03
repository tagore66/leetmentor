const getStats = async (req, res) => {
    res.json({
        success: true,
        stats: {
            easy: 25,
            medium: 10,
            hard: 2,
        },
    });
};

module.exports = {
    getStats,
};