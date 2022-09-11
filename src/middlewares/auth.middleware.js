import {db} from "../database/mongo.db.js";

const auth = async (req, res, next) => {
  const token = req.headers.token?.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const user = await db.collection("session").find({token});
    if (!user) {
      return res.sendStatus(401);
    }

    next();
  } catch (e) {
    res.send(500);
  }
};
