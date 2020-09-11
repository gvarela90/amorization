import React from "react"
import "../styles/index.scss"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { Form } from "../components/Form"
import { Row } from "../components/row"
import { AmortizationHeader } from "../components/amortization-header"
import { pmt, getPeriodData } from "../utils"

const windowGlobal = typeof window !== "undefined" && window

export default class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loanAmount: 0,
      interestRate: 0,
      periods: 0,
      extraPrincipal: 0,
      extraPrincipals: {},
      startDate: new Date(),
      submitted: false,
      canBeSaved: false,
    }

    if (windowGlobal) {
      const dataStored = windowGlobal.localStorage.getItem("data")
      if (dataStored) {
        this.state = {
          ...this.state,
          ...JSON.parse(dataStored),
        }
      }
    }
  }

  compute() {
    const schedule = []
    const { loanAmount, periods, interestRate, extraPrincipal } = this.state
    let remaining = loanAmount
    let scheduledRemaining = loanAmount
    let cumulativeInterest = 0
    let scheduledCumulativeInterest = 0
    let earlyPayments = 0

    for (let i = 0; i <= periods; i++) {
      const monthlyInterestRate = interestRate / 100 / 12
      const scheduledPayment = pmt(monthlyInterestRate, periods, -loanAmount)

      const scheduledData = getPeriodData(
        scheduledPayment,
        scheduledRemaining,
        monthlyInterestRate,
        0
      )

      if (remaining > 0) {
        const additionalPrincipal =
          this.state.extraPrincipals[i] !== undefined
            ? this.state.extraPrincipals[i]
            : extraPrincipal
        const {
          principal,
          extraPrincipal: finalExtraPrincipal,
          interest,
          totalPayment,
          endingBalance,
        } = getPeriodData(
          scheduledPayment,
          remaining,
          monthlyInterestRate,
          additionalPrincipal
        )

        cumulativeInterest += interest
        earlyPayments += additionalPrincipal
        schedule.push(
          <Row
            key={i}
            index={i}
            onExtraPrincipalChange={this.onExtraPrincipalChange}
            values={{
              remaining,
              scheduledPayment,
              principal,
              extraPrincipal: finalExtraPrincipal,
              interest,
              interestRate,
              totalPayment,
              endingBalance,
              cumulativeInterest,
            }}
          />
        )

        remaining -= principal
      }

      if (scheduledRemaining > 0) {
        scheduledCumulativeInterest += scheduledData.interest
        scheduledRemaining -= scheduledData.principal
      }
    }

    return {
      components: schedule,
      scheduledAcumulativeInterest: scheduledCumulativeInterest,
      cumulativeInterest,
      scheduledPeriods: periods,
      actualPeriods: schedule.length,
      earlyPayments,
    }
  }

  onExtraPrincipalChange = (index, value) => {
    this.setState({
      extraPrincipals: {
        ...this.state.extraPrincipals,
        [index]: Number(value),
      },
    })
  }

  onSubmit = (loanAmount, interestRate, periods, extraPrincipal) => {
    this.setState({
      loanAmount,
      interestRate,
      periods,
      extraPrincipal,
      extraPrincipals: {},
      submitted: true,
      canBeSaved: true,
    })
  }

  onSave = () => {
    const {
      loanAmount,
      interestRate,
      periods,
      extraPrincipals,
      extraPrincipal,
      submitted,
      canBeSaved,
    } = this.state
    const dataToSave = {
      loanAmount,
      interestRate,
      periods,
      extraPrincipals,
      extraPrincipal,
      submitted,
      canBeSaved,
    }
    windowGlobal &&
      windowGlobal.localStorage.setItem("data", JSON.stringify(dataToSave))
  }

  render() {
    const amortizationData = this.compute()

    return (
      <Layout>
        <SEO title="Home" />
        <div className="card">
          <header className="card-header">
            <div className="column is-half">
              <p className="card-header-title is-uppercase">Calculator</p>
            </div>
            {this.state.canBeSaved && (
              <div className="column is-half has-text-right">
                <button
                  type="button"
                  className="button is-primary"
                  onClick={this.onSave}
                >
                  Save
                </button>
              </div>
            )}
          </header>
          <Form onSubmit={this.onSubmit} initialValues={this.state} />
        </div>

        {this.state.submitted && (
          <div className="card">
            <div className="card-content box-shadow-b amortization-info">
              <AmortizationHeader
                amortizationData={{
                  ...amortizationData,
                  startDate: this.state.startDate,
                  loanAmount: this.state.loanAmount,
                }}
              />
            </div>

            <div className="card-content">
              <div className="table-container">
                <table className="table is-striped">
                  <thead>
                    <tr>
                      <td>No.</td>
                      {/* <td>Payment Date</td> */}
                      <td>Beginning Balance</td>
                      <td>Scheduled Payment</td>
                      <td>Principal</td>
                      <td>Interest</td>
                      <td>Extra Principal</td>
                      <td>Total Payment</td>
                      <td>Ending Balance</td>
                      <td>Cumulative Interest</td>
                    </tr>
                  </thead>
                  <tbody>{amortizationData.components}</tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Layout>
    )
  }
}
