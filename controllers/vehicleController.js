const { Vehicle, Service, Refuel } = require('../models');

// Helper to calculate mileage
const calculateMileage = (lastKm, totalKm, volume) => {
  if (!volume || volume === 0) return null;
  return (lastKm - totalKm) / volume;
};

module.exports = {
  // Create a new vehicle
  createVehicle: async (req, res) => {
    try {
      const vehicle = await Vehicle.create(req.body);
      res.status(201).json(vehicle);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Get all vehicles with services & refuels
  getAllVehicles: async (req, res) => {
    try {
      const vehicles = await Vehicle.findAll({
        include: [Service, Refuel],
      });
      res.json(vehicles);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get one vehicle
  getVehicleById: async (req, res) => {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id, {
        include: [Service, Refuel],
      });
      if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
      res.json(vehicle);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Update vehicle
  updateVehicle: async (req, res) => {
    try {
      const [updated] = await Vehicle.update(req.body, {
        where: { id: req.params.id },
      });
      if (!updated) return res.status(404).json({ error: 'Vehicle not found' });
      const vehicle = await Vehicle.findByPk(req.params.id);
      res.json(vehicle);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Delete vehicle
  deleteVehicle: async (req, res) => {
    try {
      const deleted = await Vehicle.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ error: 'Vehicle not found' });
      res.json({ message: 'Vehicle deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Add service to vehicle
  addService: async (req, res) => {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);
      if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

      const service = await Service.create({
        ...req.body,
        vehicleId: vehicle.id,
      });

      res.status(201).json(service);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Add refuel to vehicle
  addRefuel: async (req, res) => {
    try {
      const vehicle = await Vehicle.findByPk(req.params.id);
      if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });

      const { amount, volume, lastKm } = req.body;
      const mileage = calculateMileage(lastKm, vehicle.totalKm, volume);

      const refuel = await Refuel.create({
        amount,
        volume,
        lastKm,
        mileage,
        vehicleId: vehicle.id,
      });

      res.status(201).json(refuel);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
