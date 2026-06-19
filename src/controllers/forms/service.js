import { Router } from 'express';
import { validationResult } from 'express-validator';
import { 
    createServiceRequest, 
    getServiceRequestsByUser 
} from '../../models/forms/service.js';
import { serviceRequestValidation } from '../../middleware/validation/forms.js';
import { requireLogin } from '../../middleware/auth.js';

const router = Router();

const showServiceRequests = async (req, res) => {
    let requests = [];

    try {
        requests = await getServiceRequestsByUser(req.session.user.id);
    } catch (error) {
        console.error('Error loading service requests:', error);
    }

    res.render('forms/service/list', {
        title: 'My Service Requests',
        requests
    });
};

const showServiceRequestForm = (req, res) => {
    res.render('forms/service/form', { title: 'Submit a Service Request' });
};

const processServiceRequest = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('/service/new');
    }

    const { vehicleDescription, serviceType, description } = req.body;

    try {
        await createServiceRequest(req.session.user.id, vehicleDescription, serviceType, description);
        req.flash('success', 'Your service request has been submitted!');
        res.redirect('/service');
    } catch (error) {
        console.error('Error creating service request:', error);
        req.flash('error', 'Unable to submit your request. Please try again.');
        res.redirect('/service/new');
    }
};

router.get('/', requireLogin, showServiceRequests);
router.get('/new', requireLogin, showServiceRequestForm);
router.post('/new', requireLogin, serviceRequestValidation, processServiceRequest);

export default router;