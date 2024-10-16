const Role = require('../db/models').Role;

const signup = async (req, res, next) => {
  try {
    const newRole = await Role.create({
      name: req.body.role,
    });
    return res.status(201).json({ status: 'success', data: newRole });
  } catch (error) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
};

module.exports = { signup };
