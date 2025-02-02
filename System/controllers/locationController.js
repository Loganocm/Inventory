const Location = require('../models/locationModel');

// Create a new location
exports.createLocation = async (req, res) => {
    try {
      const { name } = req.body;
      
      // Check if the location already exists
      const existingLocation = await Location.findOne({ name });
      if (existingLocation) {
        return res.status(400).json({ message: 'Location already exists.' });
      }
  
      // Create a new location if not existing
      const location = new Location({ name });
      await location.save();
      res.status(201).json(location);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // Call this method to ensure a default location exists
  exports.createDefaultLocation = async () => {
    try {
      // Check if the default location "Main Location" exists
      const locationExists = await Location.findOne({ name: 'Factory' });
      if (!locationExists) {
        // If not, create it
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
      const locations = await Location.find();  // Fetch all locations
      res.status(200).json(locations);  // Send the locations as a response
    } catch (err) {
      res.status(500).json({ error: err.message });  // Handle errors
    }
  };

