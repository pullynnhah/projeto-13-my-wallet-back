import dayjs from "dayjs";
import {db} from "../database/mongo.db.js";
import {ObjectId} from "mongodb";

const listTransactions = async (req, res) => {
  const {userId} = res.locals;
  try {
    const transactions = await db.collection("wallets").find({userId}).toArray();
    res.status(200).send(transactions);
  } catch (e) {
    res.sendStatus(500);
  }
};
const createTransaction = async (req, res) => {
  const {data, userId} = res.locals;
  try {
    const {insertedId} = await db
      .collection("wallets")
      .insertOne({...data, userId, date: dayjs().format("DD/MM")});
    res.status(201).send({walletId: insertedId});
  } catch (e) {
    res.sendStatus(500);
  }
};

const editTransaction = async (req, res) => {
  const {wallet} = req.headers;
  const {data} = res.locals;

  if (!wallet) {
    return res.sendStatus(400);
  }

  try {
    const wallets = await db.collection("wallets").findOne({_id: ObjectId(wallet)});
    console.log(wallets);
    const {modifiedCount} = await db
      .collection("wallets")
      .updateOne({_id: ObjectId(wallet)}, {$set: data});
    console.log(modifiedCount);
    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(500);
  }
};

const removeTransaction = async (req, res) => {
  const {wallet} = req.headers;

  if (!wallet) {
    return res.sendStatus(400);
  }

  try {
    await db.collection("wallets").deleteOne({_id: wallet});
  } catch (e) {
    res.sendStatus(500);
  }
};
export {listTransactions, createTransaction, editTransaction, removeTransaction};
