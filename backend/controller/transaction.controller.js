const Transaction = require("../model/transactionModel");
const axios = require('axios');

const initialize = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = await response.data;
        // console.log(data);

        await Transaction.deleteMany();
        await Transaction.insertMany(data);

        res.status(200).send("Database configuration completed and saved data in database");
    } catch (error) {
        console.error(error);
        res.status(500).send("Database initialization error", error.message)
    }
}

const transactions = async (req, res) => {
    const { month = 'select', search, page = 1, perPage = 10 } = req.query;

    const regex = new RegExp(search, 'i');
    const monthNumber = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1;

    const query = (month === 'select') ? {} : {
        $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
        $or: [
            { title: { $regex: regex } },
            { description: { $regex: regex } },
        ]
    };

    console.log(regex, monthNumber, query);

    try {
        const transactions = await Transaction
            .find(query)
            .skip((page - 1) * perPage)
            .limit(Number(perPage))


        const count = await Transaction.countDocuments(query);
        console.log(transactions, count);

        res.send({ transactions, count, page, perPage });

    } catch (error) {
        res.status(500).send(error.message);
    }
}

const statistics = async (req, res) => {
    const { month } = req.query;
    const monthNumber = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1;

    try {
        const totalSaleAmount = await Transaction.aggregate([
            { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } } },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);

        const totalSoldItems = await Transaction.countDocuments({
            $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
            sold: true
        });

        const totalNotSoldItems = await Transaction.countDocuments({
            $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
            sold: false
        });

        res.json({
            totalSaleAmount: totalSaleAmount[0] ? totalSaleAmount[0].total : 0,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        res.status(500).send('Error fetching statistics');
    }
}

const barchart = async (req, res) => {
    const { month } = req.query;
    const monthNumber = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1;

    try {
        const barChartData = await Transaction.aggregate([
            { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } } },
            {
                $bucket: {
                    groupBy: "$price",
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
                    default: "901-above",
                    output: { count: { $sum: 1 } }
                }
            }
        ]);

        res.json(barChartData);
    } catch (error) {
        res.status(500).send('Error fetching bar chart data');
    }
}

const piechart = async (req, res) => {
    const { month } = req.query;
    const monthNumber = new Date(Date.parse(month + " 1, 2021")).getMonth() + 1;

    try {
        const pieChartData = await Transaction.aggregate([
            { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } } },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        res.json(pieChartData);
    } catch (error) {
        res.status(500).send('Error fetching pie chart data');
    }
}

const combined = async (req, res) => {
    try {
        const [transactions, statistics, barChart, pieChart] = await Promise.all([
            axios.get('http://localhost:5000/transactions', { params: req.query }),
            axios.get('http://localhost:5000/statistics', { params: req.query }),
            axios.get('http://localhost:5000/bar-chart', { params: req.query }),
            axios.get('http://localhost:5000/pie-chart', { params: req.query })
        ]);

        res.json({
            transactions: transactions.data,
            statistics: statistics.data,
            barChart: barChart.data,
            pieChart: pieChart.data
        });
    } catch (error) {
        res.status(500).send('Error fetching combined data');
    }
}

module.exports = {
    initialize,
    transactions,
    statistics,
    barchart,
    piechart,
    combined
}