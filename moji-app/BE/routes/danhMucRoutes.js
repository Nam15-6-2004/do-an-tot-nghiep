const express = require("express");
const {
  getAll,
  getById,
  insert,
  update,
  remove,
  search,
  getAllCTDM,
  getByIdCTDM,
  searchCTDMOrSanPham,
} = require("../controllers/danhMucController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/authorizeRole");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: DanhMuc
 *   description: API for managing DanhMuc
 */

/**
 * @swagger
 * /api/danhmuc/getall:
 *   get:
 *     summary: Get all DanhMuc
 *     tags: [DanhMuc]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of DanhMuc
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DanhMuc'
 */
// router.get("/danhmuc/getall", verifyToken, getAll);
router.get("/danhmuc/getall", getAll);

/**
 * @swagger
 * /api/danhmuc/getbyid/{id}:
 *   get:
 *     summary: Get DanhMuc by ID
 *     tags: [DanhMuc]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the DanhMuc
 *     responses:
 *       200:
 *         description: DanhMuc details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DanhMuc'
 *       404:
 *         description: DanhMuc not found
 */
router.get("/danhmuc/getbyid/:id", getById);

/**
 * @swagger
 * /api/danhmuc/insert:
 *   post:
 *     summary: Create a new DanhMuc with multiple CTDanhMucs
 *     tags: [DanhMuc]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenDM:
 *                 type: string
 *                 description: "Tên của DanhMuc"
 *               CTDanhMucs:
 *                 type: array
 *                 description: "Danh sách chi tiết của DanhMuc"
 *                 items:
 *                   type: object
 *                   properties:
 *                     tenCTDM:
 *                       type: string
 *                       description: "Tên của CTDanhMuc"
 *     responses:
 *       201:
 *         description: DanhMuc created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 maDM:
 *                   type: string
 *                   description: "ID của DanhMuc"
 *                 tenDM:
 *                   type: string
 *                   description: "Tên của DanhMuc"
 *                 CTDanhMucs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ma_CTDM:
 *                         type: string
 *                         description: "ID của CTDanhMuc"
 *                       maDM:
 *                         type: string
 *                         description: "ID của DanhMuc"
 *                       tenCTDM:
 *                         type: string
 *                         description: "Tên của CTDanhMuc"
 */
router.post("/danhmuc/insert", verifyToken, checkRole(["A00"]), insert);

/**
 * @swagger
 * /api/danhmuc/update:
 *   put:
 *     summary: Update an existing DanhMuc
 *     tags: [DanhMuc]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maDM:
 *                 type: string
 *                 description: ID of the DanhMuc
 *               tenDM:
 *                 type: string
 *                 description: New name of the DanhMuc
 *               CTDanhMucs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ma_CTDM:
 *                       type: string
 *                     maDM:
 *                       type: string
 *                     tenCTDM:
 *                       type: string
 *     responses:
 *       200:
 *         description: DanhMuc updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DanhMuc'
 *       404:
 *         description: DanhMuc not found
 */
router.put("/danhmuc/update", verifyToken, checkRole(["A00"]), update);

/**
 * @swagger
 * /api/danhmuc/delete/{id}:
 *   delete:
 *     summary: Delete a DanhMuc
 *     tags: [DanhMuc]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the DanhMuc to delete
 *     responses:
 *       200:
 *         description: DanhMuc deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DanhMuc'
 *       404:
 *         description: DanhMuc not found
 */
router.delete("/danhmuc/delete/:id", verifyToken, checkRole(["A00"]), remove);

/**
 * @swagger
 * /api/danhmuc/search:
 *   get:
 *     summary: Search DanhMuc
 *     tags: [DanhMuc]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: List of matching DanhMuc
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DanhMuc'
 */
router.get("/danhmuc/search", search);

/**
 * @swagger
 * tags:
 *   name: CTDanhMuc
 *   description: API for managing CTDanhMuc
 */

/**
 * @swagger
 * /api/ctdanhmuc/getall:
 *   get:
 *     summary: Get all CTDanhMuc
 *     tags: [CTDanhMuc]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of CTDanhMuc
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CTDanhMuc'
 */
router.get("/ctdanhmuc/getall", getAllCTDM);

/**
 * @swagger
 * /api/ctdanhmuc/getbyid/{id}:
 *   get:
 *     summary: Get CTDanhMuc by ID
 *     tags: [CTDanhMuc]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the CTDanhMuc
 *     responses:
 *       200:
 *         description: CTDanhMuc details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CTDanhMuc'
 *       404:
 *         description: CTDanhMuc not found
 */
router.get("/ctdanhmuc/getbyid/:id", getByIdCTDM);

router.get("/ctdanhmuc/search", searchCTDMOrSanPham);

module.exports = router;
