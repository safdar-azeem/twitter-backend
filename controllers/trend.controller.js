const controller = {};
const STATUS = require('../utils/status');
const Trend = require('../models/trend.model');


controller.addTrend = async (req, res) => {
    try {
        const { name } = req.body;
        const trend = await Trend.findOne({ name });
        if (trend) {
            trend.count += 1;
            await trend.save();
            return res.status(STATUS.SUCCESS).json({
                status: STATUS.SUCCESS,
                message: 'Trend added successfully',
                trend,
            });
        } else {
            const newTrend = new Trend({ name });
            await newTrend.save();
            return res.status(STATUS.SUCCESS).json({
                status: STATUS.SUCCESS,
                message: 'Trend added successfully',
                trend: newTrend,
            });
        }

    } catch (err) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: err.message,
        });
    }
}

controller.getTopTrends = async (req, res) => {
	try {
		const trends = await Trend.find({}).sort({ count: -1 }).limit(5);
		res.status(STATUS.SUCCESS).json({
			status: STATUS.SUCCESS,
			message: 'Trends fetched successfully',
			trends,
		});
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: err.message,
		});
	}
};

module.exports = controller;