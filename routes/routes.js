const express = require('express');
const transactionRouter = express.Router();
const Transaction = require('../models/TransactionModel.js')

transactionRouter.get('/', async (req, res) => {
  try {
    console.log("Chamou GET transactions")

    const period = req.query.period
    if (!period) {
      res.status(500).send({ error: "É necessário informar o parâmetro 'period', cujo formato deve ser yyyy-mm" })
    }

    const filter = { yearMonth: period.toString() }

    const result = await Transaction.find(filter)

    if (!result) {
      res.send("Nenhum registro para essa data.")
    } else {
      res.send({ length: result.length, transactions: result })
    }

  } catch (error) {
    res.status(500).send(error)
  }
})

transactionRouter.post('/', function (req, res) {
  const transaction = {
    description: req.body.description,
    value: req.body.value,
    category: req.body.category,
    year: req.body.year,
    month: req.body.month,
    day: req.body.day,
    yearMonth: req.body.yearMonth,
    yearMonthDay: req.body.yearMonthDay,
    type: req.body.type
  };

  const data = new Transaction(transaction);
  data.save();

  res.send(data);
  res.end();


  // res.redirect('/');
});

transactionRouter.delete('/:id', async (req, res) => {
  try {
    console.log(req.params.id)
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id })

    if (!transaction) {
      res.status(404).send("Registro não encontrado.")
    }
    res.status(200).send(transaction)
  } catch (error) {
    res.status(500).send(error)
  }
})

transactionRouter.put('/', async (req, res) => {
  try {
    const params = {
      id: req.body._id,
      description: req.body.description,
      value: req.body.value,
      category: req.body.category,
      date: req.body.date,
    };

    const dateArray = params.date.split("-")
    const year = dateArray[0]
    const month = dateArray[1]
    const day = dateArray[2]
    const yearMonth = `${year}-${month}`

    const updateTransaction = {
      description: params.description,
      category: params.category,
      value: params.value,
      year: year,
      day: day,
      yearMonth: yearMonth,
      yearMonthDay: params.date
    }

    const transaction = await Transaction.findOneAndUpdate({ _id: params.id }, updateTransaction)

    if (!transaction) {
      res.status(404).send("Registro não encontrado.")
    }
    res.status(200).send(transaction)
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = transactionRouter;
