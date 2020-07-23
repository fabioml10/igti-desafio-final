import React, { useEffect, useState } from 'react';

import M from 'materialize-css';
// import PERIODS from './helpers/periods';

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const YEARS = [2019, 2020, 2021];
const PERIODS = [];

YEARS.forEach((year) => {
  MONTHS.forEach((month) => {
    const period = `${year}-${month.toString().padStart(2, '0')}`;
    PERIODS.push(period);
  });
});

export default function App() {
  const [currentPeriod, setCurrentPeriod] = useState(PERIODS[0]);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [receitas, setReceitas] = useState("");
  const [despesas, setDespesas] = useState("");
  const [search, setSearch] = useState("");

  const BASE_URL = "http://localhost:3001/api/transaction"

  useEffect(() => {
    M.AutoInit();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      const url = `${BASE_URL}?period=${currentPeriod}`;
      const resource = await fetch(url);
      const json = await resource.json();
      setTransactions(json.transactions);
      setFilteredTransactions(json.transactions);

      const receitasTemp = json.transactions.filter(item => item.type === "+").reduce((acc, cur) => acc += cur.value, 0)
      const despesasTemp = json.transactions.filter(item => item.type === "-").reduce((acc, cur) => acc += cur.value, 0)

      setReceitas(receitasTemp)
      setDespesas(despesasTemp)
    };

    fetchTransactions();
  }, [currentPeriod]);

  useEffect(() => {

    const receitasTemp = filteredTransactions.filter(item => item.type === "+").reduce((acc, cur) => acc += cur.value, 0)
    const despesasTemp = filteredTransactions.filter(item => item.type === "-").reduce((acc, cur) => acc += cur.value, 0)

    setReceitas(receitasTemp)
    setDespesas(despesasTemp)

  }, [filteredTransactions]);

  const handlePeriodChange = (event) => {
    setCurrentPeriod(event.target.value);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    const result = transactions.filter(transaction => transaction.description.toUpperCase().includes(search.toUpperCase()))
    setFilteredTransactions(result);
  }, [search]);

  const handleDelete = (event) => {
    const id = event.target.id

    const fetchTransactions = async () => {
      const url = `${BASE_URL}/${id}`;
      const resource = await fetch(url, { method: 'DELETE' });
      // const json = await resource.json();
    };

    fetchTransactions();

  };

  const handleEdit = (event) => {
    const id = event.target.id

    const fetchTransactions = async () => {
      const url = `${BASE_URL}/`;
      const resource = await fetch(url, { method: 'PUT' });
      // const json = await resource.json();
    };

    fetchTransactions();

  };

  const { expenseStyle, earningStyle } = styles;

  return (
    <div className='container'>
      <h1 className='center'>React Select</h1>
      <p>Lançamentos: {transactions.length}</p>
      <p>Receitas: {receitas}</p>
      <p>Despesas: {despesas}</p>
      <p>Saldo: {receitas - despesas}</p>

      <div>
        <input id="search" name="search" type="text" value={search} onChange={handleSearch} />
      </div>

      {/* https://reactjs.org/docs/forms.html#the-select-tag */}
      <select value={currentPeriod} onChange={handlePeriodChange}>
        {PERIODS.map((period) => {
          return (
            <option key={period} value={period}>
              {period}
            </option>
          );
        })}
      </select>

      {filteredTransactions.length === 0 ? (
        <p>Nenhuma transação encontrada</p>
      ) : (
          <div>
            {filteredTransactions.map(({ _id, type, value, description, category, day }) => {
              const style = type === '+' ? earningStyle : expenseStyle;

              return (
                <div key={_id}>
                  <span style={style}>{`${day} | ${category} | ${description} | ${value}`}</span>
                  <button id={_id} onClick={handleEdit}>Editar</button>
                  <button id={_id} onClick={handleDelete}>Deletar</button>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}

const styles = {
  expenseStyle: {
    backgroundColor: '#c0392b',
    color: 'white',
    padding: '10px',
    display: 'flex',
    fontFamily: 'Consolas',
    marginBottom: '5px'
  },
  earningStyle: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '10px',
    display: 'flex',
    fontFamily: 'Consolas',
    marginBottom: '5px'
  },
}
