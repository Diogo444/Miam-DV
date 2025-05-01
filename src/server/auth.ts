import {
  changePassword,
  changeUsername,
  checkAuth,
  delete_account,
  deleteUser,
  getRole,
  getUser,
  login,
  logout,
  register,
  select_user,
  updateRoleUser,
  updateUserPassword,
} from './controllers/auth';
import { Router } from 'express'; // Utilise une importation correcte
import { authenticateAdmin } from './middlewares/auth';

const router = Router(); // Initialise une instance de Router

// Configure ta route
router.post('/register', register);
router.post('/login', login);
router.post('/change-password', changePassword);
router.post('/change-username', changeUsername);
router.delete('/delete-account/:token', delete_account);
router.get('/all-users', authenticateAdmin, select_user);
router.get('/check', checkAuth);
router.get('/role', getRole);
router.get('/user', getUser);
router.post('/logout', logout);
router.delete('/delete-user/:id', authenticateAdmin, deleteUser);
router.patch('/update-user-passwd/:id', authenticateAdmin, updateUserPassword);
router.patch('/update-user-role/:id', authenticateAdmin, updateRoleUser);

export { router as auth };
