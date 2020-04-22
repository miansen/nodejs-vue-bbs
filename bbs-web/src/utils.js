
export function formatDateTime (time) {
  const d = new Date(time)
  const year = d.getFullYear()
  let month = d.getMonth() + 1
  let day = d.getDate()
  let hours = d.getHours()
  let minutes = d.getMinutes()
  let seconds = d.getSeconds()
  month = month >= 10 ? month : '0' + month
  day = day >= 10 ? day : '0' + day
  hours = hours >= 10 ? hours : '0' + hours
  minutes = minutes >= 10 ? minutes : '0' + minutes
  seconds = seconds >= 10 ? seconds : '0' + seconds
  return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`
}
