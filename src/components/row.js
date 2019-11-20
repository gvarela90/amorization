import React from "react"
import { format } from "../utils"

export function Row({ index, onExtraPrincipalChange, values }) {
  const {
    remaining,
    scheduledPayment,
    principal,
    extraPrincipal,
    interest,
    totalPayment,
    endingBalance,
    cumulativeInterest,
  } = values

  return (
    <tr>
      <td>{index + 1}</td>
      {/* <td></td> */}
      <td>{format(remaining)}</td>
      <td>{format(scheduledPayment)}</td>
      <td>{format(principal)}</td>
      <td>
        <input
          className="input"
          type="number"
          value={extraPrincipal || ""}
          onChange={e => onExtraPrincipalChange(index, e.target.value)}
        />
      </td>
      <td>{format(interest)}</td>
      <td>{format(totalPayment)}</td>
      <td>{format(endingBalance)}</td>
      <td>{format(cumulativeInterest)}</td>
    </tr>
  )
}
