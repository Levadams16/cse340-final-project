import { Router } from 'express';
import { 
    getAllVehicles, 
    getVehiclesByCategory, 
    getVehicleById, 
    getVehicleImages,
    getAllCategories,
    getAllVehiclesAdmin,
    createVehicle,
    updateVehicle,
    deleteVehicle
} from '../../models/inventory/vehicles.js';

const router = Router();

const showInventory = async (req, res) => {
    let vehicles = [];
    let categories = [];
    const categoryFilter = req.query.category;

    try {
        categories = await getAllCategories();

        if (categoryFilter) {
            vehicles = await getVehiclesByCategory(categoryFilter);
        } else {
            vehicles = await getAllVehicles();
        }
    } catch (error) {
        console.error('Error loading inventory:', error);
    }

    res.render('inventory/list', {
        title: 'Browse Vehicles',
        vehicles,
        categories,
        currentCategory: categoryFilter || null,
        styles: []
    });
};

const showVehicleDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const vehicle = await getVehicleById(id);

        if (!vehicle) {
            req.flash('error', 'Vehicle not found.');
            return res.redirect('/inventory');
        }

        const images = await getVehicleImages(id);

        res.render('inventory/detail', {
            title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
            vehicle,
            images,
            styles: []
        });
    } catch (error) {
        console.error('Error loading vehicle:', error);
        req.flash('error', 'Unable to load vehicle details.');
        res.redirect('/inventory');
    }
};

router.get('/', showInventory);
router.get('/:id', showVehicleDetail);

export default router;