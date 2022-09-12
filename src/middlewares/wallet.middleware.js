import {validateJOI} from "../utils/validation.js";
import {walletSchema} from "../schemas/wallet.schema.js";
import {db} from "../database/mongo.db.js";

const validate = (req, res, next) => {
  if (!validateJOI(walletSchema, req.body)) {
    return res.sendStatus(422);
  }

  res.locals.data = req.body;
  next();
};

const getUser = async (req, res, next) => {
  const {session} = res.locals;
  try {
    const user = await db.collection("users").findOne({_id: session.userId});
    if (!user) {
      return res.sendStatus(404);
    }

    res.locals.userId = user._id;
    next();
  } catch (e) {
    res.sendStatus(500);
  }
};

export {validate, getUser};
