export function formatRemainingTime(remainingTime) {
  const seconds = remainingTime % 60
  const tMins = ~~(remainingTime / 60)
  const mins = tMins % 60
  const tHours = ~~(tMins / 60)
  const hours = tHours % 24
  const days = ~~(tHours / 24)

  const _seconds = seconds < 10 ? '0' + seconds : seconds
  const _mins = mins < 10 ? '0' + mins : mins
  const _hours = hours < 10 ? '0' + hours : hours
  const _days = days < 10 ? '0' + days : days

  return `${_days}D : ${_hours}H : ${_mins}M : ${_seconds}S`
}
