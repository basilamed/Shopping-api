const Type = require('../models/Type');

const addType = async (req, res) => {
    try {
        const type = new Type({
            name: req.body.name,
        });
        const result = await type.save();
        res.status(201).json({
            message: 'Type created',
            type: result
        });
    } catch (err) {
        res.status(500).json({
            message: 'Type not created',
            error: err
        });
    }
}

const getAllTypes = async (req, res) => {
    try {
        const types = await Type.find({});
        res.json(types);
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching types',
            error: err
        });
    }
}

module.exports = {
    addType,
    getAllTypes
}