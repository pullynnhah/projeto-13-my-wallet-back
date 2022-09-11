import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

import {db} from "../database/mongo.db.js";
import {signupSchema, loginSchema} from "../schemas/auth.schema.js";

function validateJOI(schema, body) {
  const validation = schema.validate(body);
  return !validation.error;
}

const SALT = 11;

const signup = async (req, res) => {
  if (!validateJOI(signupSchema, req.body)) {
    return res.sendStatus(422);
  }

  const {name, email, password} = req.body;

  try {
    const user = await db.collection("users").findOne({email});
    if (user) {
      return res.sendStatus(409);
    }

    await db.collection("users").insertOne({
      name,
      email,
      password: bcrypt.hashSync(password, SALT),
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
    const user = await db.collection("users").findOne({email});
    if (!(user && bcrypt.compareSync(password, user.password))) {
      return res.sendStatus(401);
    }

    const token = uuid();
    await db.collection("sessions").updateOne({userId: user._id}, {$set: {isActive: false}});
    await db.collection("sessions").insertOne({userId: user._id, token, isActive: true});
    res.status(200).send({token});
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500);
  }
};

const logout = async (req, res) => {
  const token = res.locals.token;
  try {
    await db.collection("sessions").updateOne({token}, {$set: {isActive: false}});

    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
};
export {signup, login, logout};
