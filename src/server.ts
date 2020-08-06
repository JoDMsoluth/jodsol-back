import app from "./app";
import winston from "./configs/winston";

const port = process.env.PORT || 3001;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
