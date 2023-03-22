import { useEffect, useState } from 'react' 

function App() {
  let [transactions, setTransactions] = useState([]);
  let [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    fetch("./transactions.json")
    .then(response => response.json())
    .then(transactionArray => {
      setIsLoaded(true);
      setTransactions(transactionArray)
    });
    
  }, []);

  function calculateTransactionPoints(transaction) {
    let points = 0;
    const transactionTotal = transaction.total;
    // calculate 2 points for every dollar spent over 100
    if (transactionTotal > 100) {
      points += (transactionTotal - 100) * 2;
    }
    // calculate 1 point for every dollar spent between 50 and 100
    if (transactionTotal > 50) {
      let temp = 0;
      if (transactionTotal > 100) {
        temp = 100;
        points += 50;
      } else {
        points += transactionTotal - 50;
      }
    }
    transaction.points = points;
  }
  // it's easier to put this into an object then turn it into an array later for iteration
  let transactionsByMonth = {};
  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date);
    const yearMonth = transactionDate.getFullYear() + "-" + (transactionDate.getMonth() + 1);
    if (!transactionsByMonth[yearMonth]) {
      transactionsByMonth[yearMonth] = {
        transactions: [],
        points: 0
      }
    }
    transactionsByMonth[yearMonth].transactions.push(transaction);
  })
  for (let transactionMonth in transactionsByMonth) {
    transactionsByMonth[transactionMonth].transactions.forEach(transaction => {
      calculateTransactionPoints(transaction);
    })
    transactionsByMonth[transactionMonth].points = transactionsByMonth[transactionMonth].transactions.reduce((currentTotal, currentItem) => currentTotal + currentItem.points, 0)
  }
  const transactionsByMonthArray = [];
  for (let transactionMonth in transactionsByMonth) {
    transactionsByMonthArray.push({
      month: transactionMonth,
      points: transactionsByMonth[transactionMonth].points
    })
  }
  transactions.forEach(transaction => {
    calculateTransactionPoints(transaction)
  })
  let pointsTotal = transactions.reduce((currentTotal, currentItem) => currentTotal + currentItem.points, 0)

  if (!isLoaded) {
    return "Loading..."
  } else {
    return (
      <div className="App">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction Amount</th>
              <th>Points Earned</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(item => (
              <tr key={item.date}>
                <td>{item.date}</td>
                <td>{item.total}</td>
                <td>{item.points}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="2">Total</th>
              <th>{pointsTotal}</th>
            </tr>
          </tfoot>
        </table>
        <ul>
          {transactionsByMonthArray.map(item => (
            <li key={item.month}>
              <b>Month:</b> {item.month}<br/>
              <b>Points:</b> {item.points}
            </li>
          ))}
        </ul>
        
      </div>
    )
  }
  
}

export default App
