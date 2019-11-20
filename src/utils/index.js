export const format = value =>
  new Intl.NumberFormat("en-US", { style: "decimal" }).format(value)

export const addMonths = (date, months) => {
  const d = new Date(date.getTime())
  return new Date(d.setMonth(d.getMonth() + months))
}

export const pmt = (rate, periods, amount) => {
  const pvif = Math.pow(1 + rate, periods)
  const pmt = (rate / (pvif - 1)) * -(amount * pvif)

  return pmt
}

export const getPeriodData = (
  scheduledPayment,
  remaining,
  monthlyInterestRate,
  extraPrincipal
) => {
  const interest = remaining * monthlyInterestRate
  const principalAux = Math.min(scheduledPayment - interest, remaining)
  const finalExtraPrincipal =
    principalAux >= remaining
      ? 0
      : extraPrincipal + principalAux < remaining
      ? extraPrincipal
      : Math.max(0, remaining - principalAux)
  const totalPayment =
    principalAux < remaining
      ? scheduledPayment + finalExtraPrincipal
      : principalAux + interest
  const principal = totalPayment - interest
  const endingBalance = remaining - principal
  return {
    principal,
    extraPrincipal: finalExtraPrincipal,
    interest,
    totalPayment,
    endingBalance,
  }
}
