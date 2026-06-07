import { Router, type IRouter } from "express";
import healthRouter from "./health";
import ipfsRouter from "./ipfs";

const router: IRouter = Router();

router.use(healthRouter);
router.use(ipfsRouter);

export default router;
