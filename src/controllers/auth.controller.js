import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

import {db} from "../database/mongo.db.js";
import {signupSchema, loginSchema} from "../schemas/auth.schema.js";
import {sanitaze} from "../utils/sanitizer.js";

function validateJOI(schema, body) {
  const validation = schema.validate(body);
  return !!validation.error;
}

const signup = async (req, res) => {
  if (!validateJOI(signupSchema, req.body)) {
    return res.sendStatus(422);
  }

  const {name, email, password} = req.body;

  try {
    const user = await db.collection("users").find({email: sanitaze(email)});

    if (user) {
      return res.sendStatus(409);
    }

    await db.collection("users").insertOne({
      name: sanitaze(name),
      email: sanitaze(email),
      password: bcrypt.hashSync(password),
    });

    return res.sendStatus(201);
  } catch (e) {
    res.sendStatus(500);
  }
};

const login = async (req, res) => {
  if (!validateJOI(loginSchema, req.body)) {
    return res.sendStatus(422);
  }

  const {email, password} = req.body;
  try {
    const user = await db.collection("users").find({email: sanitaze(email)});
    if (!(user && bcrypt.compareSync(password, user.password))) {
      return res.sendStatus(401);
    }

    const token = uuid();
    await db.collection("sessions").updateMany({userId: user._id}, {$set: {isActive: false}});
    await db.collection("sessions").insertOne({userId: user._id, token, isActive: true});
    res.status(200).send({token});
  } catch (e) {
    res.sendStatus(500);
  }
};

const logout = async (req, res) => {
  const token = req.header.token.split(" ")[1];

  try {
    await db.collection("session").updateOne({token}, {$set: {isActive: false}});
    res.status(200);
  } catch (e) {
    res.sendStatus(500);
  }
};
export {signup, login, logout};
