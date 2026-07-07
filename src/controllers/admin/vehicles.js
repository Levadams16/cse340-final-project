import { Router } from 'express';
import { requireRole } from '../../middleware/auth.js';
import {
    getAllVehiclesAdmin,
    getVehicleById,
    getAllCategories,
    createVehicle,
    updateVehicle,
    deleteVehicle
} from '../../models/inventory/vehicles.js';

const router = Router();

// List all vehicles
const showVehicleList = async (req, res) => {
    let vehicles = [];
    let categories = [];

    try {
        vehicles = await getAllVehiclesAdmin();
        categories = await getAllCategories();
    } catch (error) {
        console.error('Error loading vehicles:', error);
        req.flash('error', 'Unable to load vehicles.');
    }

    res.render('admin/vehicles/list', {
        title: 'Manage Vehicles',
        vehicles,
        categories,
        styles: []
    });
};

// Show add vehicle form
const showAddForm = async (req, res) => {
    let categories = [];

    try {
        categories = await getAllCategories();
    } catch (error) {
        console.error('Error loading categories:', error);
    }

    res.render('admin/vehicles/form', {
        title: 'Add Vehicle',
        vehicle: null,
        categories,
        styles: []
    });
};

// Process add vehicle form
const processAddVehicle = async (req, res) => {
    const { make, model, year, price, mileage, color, description, categoryId } = req.body;

    try {
        await createVehicle({ make, model, year, price, mileage, color, description, categoryId });
        req.flash('success', `${year} ${make} ${model} added successfully.`);
        res.redirect('/admin/vehicles');
    } catch (error) {
        console.error('Error adding vehicle:', error);
        req.flash('error', 'Unable to add vehicle. Please try again.');
        res.redirect('/admin/vehicles/add');
    }
};

// Show edit vehicle form
const showEditForm = async (req, res) => {
    const { id } = req.params;
    let vehicle = null;
    let categories = [];

    try {
        vehicle = await getVehicleById(id);
        categories = await getAllCategories();
    } catch (error) {
        console.error('Error loading vehicle:', error);
    }

    if (!vehicle) {
        req.flash('error', 'Vehicle not found.');
        return res.redirect('/admin/vehicles');
    }

    res.render('admin/vehicles/form', {
        title: 'Edit Vehicle',
        vehicle,
        categories,
        styles: []
    });
};

// Process edit vehicle form
const processEditVehicle = async (req, res) => {
    const { id } = req.params;
    const { make, model, year, price, mileage, color, description, categoryId, isAvailable } = req.body;

    try {
        const updated = await updateVehicle(id, {
            make,
            model,
            year,
            price,
            mileage,
            color,
            description,
            categoryId,
            isAvailable: isAvailable === 'on'
        });

        if (!updated) {
            req.flash('error', 'Vehicle not found.');
            return res.redirect('/admin/vehicles');
        }

        req.flash('success', `${year} ${make} ${model} updated successfully.`);
        res.redirect('/admin/vehicles');
    } catch (error) {
        console.error('Error updating vehicle:', error);
        req.flash('error', 'Unable to update vehicle. Please try again.');
        res.redirect(`/admin/vehicles/${id}/edit`);
    }
};

// Delete vehicle
const processDeleteVehicle = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await deleteVehicle(id);
        if (deleted) {
            req.flash('success', 'Vehicle deleted successfully.');
        } else {
            req.flash('error', 'Vehicle not found.');
        }
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        req.flash('error', 'Unable to delete vehicle.');
    }

    res.redirect('/admin/vehicles');
};

router.get('/', requireRole('owner', 'employee'), showVehicleList);
router.get('/add', requireRole('owner', 'employee'), showAddForm);
router.post('/add', requireRole('owner', 'employee'), processAddVehicle);
router.get('/:id/edit', requireRole('owner', 'employee'), showEditForm);
router.post('/:id/edit', requireRole('owner', 'employee'), processEditVehicle);
router.post('/:id/delete', requireRole('owner', 'employee'), processDeleteVehicle);

export default router;