import {db} from "../database/mongo.db.js";

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const session = await db.collection("sessions").findOne({$and: [{token}, {isActive: true}]});
    if (!session) {
      return res.sendStatus(401);
    }

    res.locals.session = session;
    res.locals.token = token;
    next();
  } catch (e) {
    res.send(500);
  }
};

export {auth};
