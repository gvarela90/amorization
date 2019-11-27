import React from "react"
import formatDistance from "date-fns/formatDistance"
import { format, addMonths } from "../utils"

export function AmortizationHeader({ amortizationData }) {
  const savedPayments =
    amortizationData.scheduledPeriods - amortizationData.actualPeriods
  return (
    <div className="content">
      <div className="columns is-mobile is-variable is-5">
        <div className="column">
          <div className="columns">
            <div className="column is-half has-text-weight-bold">
              Scheduled number of payments:
            </div>
            <div className="column is-half has-text-right">
              {amortizationData.scheduledPeriods} (
              {amortizationData.scheduledPeriods / 12} years)
            </div>
          </div>
          <div className="columns">
            <div className="column is-half has-text-weight-bold">
              Scheduled total interest
            </div>
            <div className="column is-half has-text-right">
              {format(amortizationData.scheduledAcumulativeInterest)}
            </div>
          </div>
          <div className="columns">
            <div className="column is-half has-text-weight-bold">
              Scheduled total paid:
            </div>
            <div className="column is-half has-text-right">
              {format(
                amortizationData.scheduledAcumulativeInterest +
                  amortizationData.loanAmount
              )}
            </div>
          </div>
        </div>

        {amortizationData.earlyPayments > 0 && (
          <div className="column">
            <div className="columns">
              <div className="column is-half has-text-weight-bold">
                Actual number of payments:
              </div>
              <div className="column is-half has-text-right">
                {amortizationData.actualPeriods} (
                {formatDistance(
                  addMonths(
                    amortizationData.startDate,
                    amortizationData.actualPeriods
                  ),
                  amortizationData.startDate
                )}
                )
              </div>
            </div>
            <div className="columns">
              <div className="column is-half has-text-weight-bold">
                Saved number of payments:
              </div>
              <div className="column is-half has-text-right">
                {savedPayments} (
                {formatDistance(
                  addMonths(amortizationData.startDate, savedPayments),
                  amortizationData.startDate
                )}
                )
              </div>
            </div>
            <div className="columns">
              <div className="column is-half has-text-weight-bold">
                Actual total interest:
              </div>
              <div className="column is-half has-text-right">
                {format(amortizationData.cumulativeInterest)}
              </div>
            </div>
            <div className="columns">
              <div className="column is-half has-text-weight-bold">
                Total early payments:
              </div>
              <div className="column is-half has-text-right">
                {format(amortizationData.earlyPayments)}
              </div>
            </div>
            <div className="columns">
              <div className="column is-half has-text-weight-bold">
                Actual total paid:
              </div>
              <div className="column is-half has-text-right">
                {format(
                  amortizationData.cumulativeInterest +
                    amortizationData.loanAmount
                )}
              </div>
            </div>
            <div className="columns">
              <div className="column is-half has-text-weight-bold">
                Total savings:
              </div>
              <div className="column is-half has-text-right">
                {format(
                  amortizationData.scheduledAcumulativeInterest -
                    amortizationData.cumulativeInterest
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
