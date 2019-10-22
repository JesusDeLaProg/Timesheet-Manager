const path = require("path");

require("dotenv").config();
process.env.TS_NODE_PROJECT = path.resolve(process.cwd(), "./base.tsconfig.json");
require("ts-node/register");

require("../src/infrastructure/database/mongoose");
const { Container } = require("inversify");
const { ModelModule } = require("../src/infrastructure/database/models");
const Models = require("../src/constants/symbols/models").default;

const container = new Container();
container.load(ModelModule);
const Project = container.get(Models.Project);

/**
 * Remove fees
 * Move method value to type
 * Remove method
 */
async function up () {
  const result = await Project.collection.updateMany({ method: /./ }, { $rename: { method: "type" }, $unset: { fees: "" } });
  console.log(result);
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  const result = await Project.collection.updateMany({ type: /./ }, { $rename: { type: "method" }, fees: 0 });
  console.log(result);
}

module.exports = { up, down };
