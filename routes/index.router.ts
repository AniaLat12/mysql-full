import controller from "../controllers/index.controller"
import express from 'express';
const router = express.Router();

router.get("/", controller.main);
router.get("/db/:db", controller.tables);
router.get("/desc/:db/:table", controller.desc);
router.post("/query/:db", controller.query);
router.post("/insert/:db/:table", controller.insert);
// relation
router.get("/rel/:db", controller.getTablesInRelation);
router.get("/rel/:db/:table", controller.getRowsInRelation);
router.post("/makerel/:db", controller.makeRelation);

// make database
router.post("/makedb", controller.makeDatabase);

export default router;