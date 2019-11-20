import React from "react"
import "../styles/index.scss"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { Form } from "../components/form"
import { Row } from "../components/row"
import { AmortizationHeader } from "../components/amortization-header"
import { pmt, getPeriodData } from "../utils"

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
      submitted: true,
    })
  }

  render() {
    const amortizationData = this.compute()

    return (
      <Layout>
        <SEO title="Home" />
        <Form onSubmit={this.onSubmit} />

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
                      <td>Extra Principal</td>
                      <td>Interest</td>
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
