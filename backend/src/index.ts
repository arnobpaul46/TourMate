import app from "./app";
import config from "./config";

export default app;

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}
