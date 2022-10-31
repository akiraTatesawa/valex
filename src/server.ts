import { app, init } from "./app";

const { PORT } = process.env;

init().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
