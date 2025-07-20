const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Vehicles CRUD
router.post('/', vehicleController.createVehicle);
router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.put('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

// Add service/refuel
router.post('/:id/service', vehicleController.addService);
router.post('/:id/refuel', vehicleController.addRefuel);
router.get('/by-driver/:driverId', vehicleController.getVehiclesByDriverId);

module.exports = router;
