import { Router } from 'express';
import { 
    getAllUsers, 
    getAllRoles, 
    updateUserRole, 
    deleteUser 
} from '../../models/forms/registration.js';
import { requireRole } from '../../middleware/auth.js';

const router = Router();

const showDashboard = (req, res) => {
    res.render('admin/dashboard', { title: 'Admin Dashboard' });
};

const showUserManagement = async (req, res) => {
    let users = [];
    let roles = [];

    try {
        users = await getAllUsers();
        roles = await getAllRoles();
    } catch (error) {
        console.error('Error loading users:', error);
    }

    res.render('admin/users', {
        title: 'Manage Users',
        users,
        roles
    });
};

const processRoleUpdate = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const { roleId } = req.body;
    const currentUser = req.session.user;

    if (currentUser.id === targetUserId) {
        req.flash('error', 'You cannot change your own role.');
        return res.redirect('/admin/users');
    }

    try {
        await updateUserRole(targetUserId, roleId);
        req.flash('success', 'User role updated successfully.');
    } catch (error) {
        console.error('Error updating role:', error);
        req.flash('error', 'Unable to update user role.');
    }

    res.redirect('/admin/users');
};

const processDeleteUser = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    if (currentUser.id === targetUserId) {
        req.flash('error', 'You cannot delete your own account.');
        return res.redirect('/admin/users');
    }

    try {
        const deleted = await deleteUser(targetUserId);
        if (deleted) {
            req.flash('success', 'User deleted successfully.');
        } else {
            req.flash('error', 'User not found.');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        req.flash('error', 'Unable to delete user.');
    }

    res.redirect('/admin/users');
};

router.get('/', requireRole('owner', 'employee'), showDashboard);
router.get('/users', requireRole('owner'), showUserManagement);
router.post('/users/:id/role', requireRole('owner'), processRoleUpdate);
router.post('/users/:id/delete', requireRole('owner'), processDeleteUser);

export default router;