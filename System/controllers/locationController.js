const Location = require('../models/locationModel');

exports.createLocation = async (req, res) => {
    try {
      const { name } = req.body;
      const existingLocation = await Location.findOne({ name });
      if (existingLocation) {
        return res.status(400).json({ message: 'Location already exists.' });
      }
      const location = new Location({ name });
      await location.save();
      res.status(201).json(location);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  exports.createDefaultLocation = async () => {
    try {
      const locationExists = await Location.findOne({ name: 'Factory' });
      if (!locationExists) {
        const mainLocation = new Location({ name: 'Factory' });
        await mainLocation.save();
        console.log('Default location "Factory" created.');
      }
    } catch (err) {
      console.error('Error creating default location:', err);
    }
  };

  exports.getAllLocations = async (req, res) => {
    try {
      const locations = await Location.find();
      res.status(200).json(locations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

