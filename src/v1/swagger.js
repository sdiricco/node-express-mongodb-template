const swaggerUi = require("swagger-ui-express");
const YAML = require('yamljs');
const path = require("path")

const swaggerPath = path.resolve(__dirname, './swagger.yml')
const swaggerDocument = YAML.load(swaggerPath)

const swagger = (app, port) => {
  app.use(
    '/api/v1/docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );
}



module.exports = { swagger };