import dayjs from "dayjs";
import {db} from "../database/mongo.db.js";

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
    await db.collection("wallets").insertOne({...data, userId, date: dayjs().format("DD/MM")});
    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(500);
  }
};

const editTransaction = async (req, res) => {
  const {walletId} = req.headers;
  const {data} = res.locals;

  if (!walletId) {
    return res.sendStatus(400);
  }

  try {
    await db.collection("wallets").updateOne({_id: walletId}, {$set: data});
    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(500);
  }
};

const removeTransaction = async (req, res) => {
  const {walletId} = req.headers;

  if (!walletId) {
    return res.sendStatus(400);
  }

  try {
    await db.collection("wallets").deleteOne({_id: walletId});
  } catch (e) {
    res.sendStatus(500);
  }
};
export {listTransactions, createTransaction, editTransaction, removeTransaction};
