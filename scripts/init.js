const mongoose = require("mongoose");
const md5 = require("md5");
const User = require("../models/user");

(async () => {
  try {
    const adminClient = new mongoose.mongo.MongoClient(
      process.env.MONGO_ADMIN_URL
    );
    await adminClient.connect();
    console.log("Admin database connected");

    const dbAdmin = new mongoose.mongo.MongoClient(
      process.env.MONGO_CONNECTION_URL
    );
    try {
      mongoose.set("strictQuery", false);
      await dbAdmin.connect();
      console.log("DB database connected");
    } catch (error) {
      console.log("DB database user not found. creating new user");
      const db = adminClient.db(process.env.MONGO_DATABASE_NAME);
      // console.log(db)

      await db.addUser(process.env.MONGO_USERNAME, process.env.MONGO_PASSWORD, {
        roles: ["readWrite", "dbAdmin"],
      });
      console.log("DB database user created !!");
      await mongoose.connect(process.env.MONGO_CONNECTION_URL);

      const admin = {
        email: process.env.ADMIN_EMAIL,
        password: md5(process.env.ADMIN_PASSWORD),
        name: "admin",
        role: "admin",
      };

      const isAdminExists = await User.countDocuments({ email: admin.email });
      if (!isAdminExists) {
        console.log("Creating Admin User");
        await User.create(admin);
        console.log("Admin Created !!");
      } else {
        console.log("Admin Already Exists");
      }
      console.log("Init Script Execution Done !!");
      process.exit(1);
    }
    process.exit(1);
  } catch (error) {
    console.log("Error while connecting to database => ", error);
    process.exit(1);
  }
})().catch((error) => {
  console.error("Error while Init Script Execution !!");
  console.log(error);
  process.exit(1);
});
