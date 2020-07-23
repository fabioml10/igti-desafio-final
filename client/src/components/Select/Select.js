import React from 'react'

export default function Select() {

  const [currentPeriod, setCurrentPeriod] = useState(PERIODS[0]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    M.AutoInit();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      const url = `${BASE_URL}${currentPeriod}`;
      const resource = await fetch(url);
      const json = await resource.json();
      setTransactions(json.transactions);
    };

    fetchTransactions();
  }, [currentPeriod]);

  const handlePeriodChange = (event) => {
    setCurrentPeriod(event.target.value);
  };

  const { expenseStyle, earningStyle } = styles;

  return (
    <div className='container'>
      <h1 className='center'>React Select</h1>

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

      {transactions.length === 0 ? (
        <p>Nenhuma transação encontrada</p>
      ) : (
          <div>
            {transactions.map(({ id, type, value, description }) => {
              const style = type === '+' ? earningStyle : expenseStyle;

              return (
                <div key={id}>
                  <span style={style}>{`${value} | ${description}`}</span>
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
  },
  earningStyle: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '10px',
    display: 'flex',
    fontFamily: 'Consolas',
  },

}
