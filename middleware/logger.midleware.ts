import logger from "../log/index.logger"

const NAMESPACE = "SERVER";

export default (req: any, res: any, next: any)=>{
    logger.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], STATUS - [${res.statusCode}]`);
}