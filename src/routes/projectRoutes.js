const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const {
  createProject,
  getUserProjects,

} = require('../controllers/projectController');
const validateProject = require('../validators/validateProject');

const router = express.Router();

router.use(protect); // All routes below this require authentication


router.post('/',restrictTo('admin','manager','member'), validateProject,createProject);
router.get('/',restrictTo('admin','manager','member'), getUserProjects);


module.exports = router;
