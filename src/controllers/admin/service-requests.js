import { Router } from 'express';
import { requireRole } from '../../middleware/auth.js';
import {
    getAllServiceRequests,
    getServiceRequestById,
    updateServiceRequestStatus
} from '../../models/forms/service.js';

const router = Router();

const showAllServiceRequests = async (req, res) => {
    let requests = [];

    try {
        requests = await getAllServiceRequests();
    } catch (error) {
        console.error('Error loading service requests:', error);
        req.flash('error', 'Unable to load service requests.');
    }

    res.render('admin/service-requests', {
        title: 'Service Requests',
        requests,
        styles: []
    });
};

const showEditStatusForm = async (req, res) => {
    const { id } = req.params;

    try {
        const request = await getServiceRequestById(id);

        if (!request) {
            req.flash('error', 'Service request not found.');
            return res.redirect('/admin/service-requests');
        }

        res.render('admin/service-request-detail', {
            title: `Service Request #${id}`,
            request,
            styles: []
        });
    } catch (error) {
        console.error('Error loading service request:', error);
        req.flash('error', 'Unable to load service request.');
        res.redirect('/admin/service-requests');
    }
};

const processStatusUpdate = async (req, res) => {
    const { id } = req.params;
    const { status, employeeNotes } = req.body;

    if (!status) {
        req.flash('error', 'Please select a status.');
        return res.redirect(`/admin/service-requests/${id}`);
    }

    try {
        const updated = await updateServiceRequestStatus(id, status, employeeNotes || null);

        if (!updated) {
            req.flash('error', 'Service request not found.');
            return res.redirect('/admin/service-requests');
        }

        req.flash('success', `Request #${id} updated to "${status}".`);
        res.redirect('/admin/service-requests');
    } catch (error) {
        console.error('Error updating service request:', error);
        req.flash('error', 'Unable to update service request.');
        res.redirect(`/admin/service-requests/${id}`);
    }
};

router.get('/', requireRole('owner', 'employee'), showAllServiceRequests);
router.get('/:id', requireRole('owner', 'employee'), showEditStatusForm);
router.post('/:id', requireRole('owner', 'employee'), processStatusUpdate);

export default router;
