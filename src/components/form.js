import React, { useState } from "react"

export function Form({ onSubmit, initialValues }) {
  const [loanAmount, setLoanAmount] = useState(initialValues.loanAmount)
  const [interestRate, setInterestRate] = useState(initialValues.interestRate)
  const [periods, setPeriods] = useState(initialValues.periods)
  const [extraPrincipal, setExtraPrincipal] = useState(
    initialValues.extraPrincipal
  )

  const handleSubmit = evt => {
    evt.preventDefault()
    onSubmit(
      Number(loanAmount),
      Number(interestRate),
      Number(periods),
      Number(extraPrincipal)
    )
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="card-content">
        <div className="field">
          <label className="label">Loan Amount:</label>
          <div className="control">
            <input
              type="text"
              className="input"
              value={loanAmount}
              onChange={e => setLoanAmount(e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Loan period in months:</label>
          <div className="control">
            <input
              type="text"
              className="input"
              value={periods}
              onChange={e => setPeriods(e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Annual Interest Rate:</label>
          <div className="control">
            <input
              type="text"
              className="input"
              value={interestRate}
              onChange={e => setInterestRate(e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Additional principal:</label>
          <div className="control">
            <input
              type="text"
              className="input"
              value={extraPrincipal}
              onChange={e => setExtraPrincipal(e.target.value)}
            />
          </div>
        </div>
        <div className="control">
          <button type="submit" className="button is-primary">
            Calculate
          </button>
        </div>
        {/* <div className="control">
        </div> */}
      </div>
    </form>
  )
}
