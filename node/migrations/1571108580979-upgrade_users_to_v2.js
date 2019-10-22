const path = require("path");

require("dotenv").config();
process.env.TS_NODE_PROJECT = path.resolve(process.cwd(), "./base.tsconfig.json");
require("ts-node/register");

require("../src/infrastructure/database/mongoose");
const mongoose = require("mongoose");
const { Container } = require("inversify");
const { ModelModule } = require("../src/infrastructure/database/models");
const Models = require("../src/constants/symbols/models").default;

const container = new Container();
container.load(ModelModule);
const User = container.get(Models.User);
/**
 * nomUsager -> username
 * motDePasse -> password
 * prenom -> firstName
 * nom -> lastName
 * courriel -> email
 * role:
 *  1 -> 1
 *  2 -> 2
 *  4 -> 3
 *  8 -> 4
 */
async function up () {
  const session = await mongoose.startSession();
  let result;
  if(await User.collection.indexExists("nomUsager_1")) {
    result = await User.collection.dropIndex("nomUsager_1");
    console.log(result);  
  }
  await session.withTransaction(async () => {
    result = await User.collection.updateMany(
      { nomUsager: /./ },
      {
        $rename: {
          nomUsager: "username",
          motDePasse: "password",
          prenom: "firstName",
          nom: "lastName",
          courriel: "email"
        }
      }, { session }
    );
    console.log(result);
    result = await User.collection.updateMany({ role: 4 }, { $set: { role: 3 } }, { session });
    console.log(result);
    result = await User.collection.updateMany({ role: 8 }, { $set: { role: 4 } }, { session });
    console.log(result);
  });
  if(!(await User.collection.indexExists("username_1"))) {
    result = await User.collection.createIndex({ username: 1 });
    console.log(result);
  }
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  const session = await mongoose.startSession();
  let result;
  if (User.collection.indexExists("username_1")) {
    result = await User.collection.dropIndex("username_1");
    console.log(result);
  }
  await session.withTransaction(async () => {
    result = await User.collection.updateMany(
      { username: /./ },
      {
        $rename: {
          username: "nomUsager",
          password: "motDePasse",
          firstName: "prenom",
          lastName: "nom",
          email: "courriel"
        }
      }, { session }
    );
    console.log(result);
    result = await User.collection.updateMany({ role: 4 }, { $set: { role: 8 } }, { session });
    console.log(result);
    result = await User.collection.updateMany({ role: 3 }, { $set: { role: 4 } }, { session });
    console.log(result);
  });
  if (!(await User.collection.indexExists("nomUsager_1"))) {
    result = await User.collection.createIndex({ nomUsager: 1 });
    console.log(result);
  }
}

module.exports = { up, down };
