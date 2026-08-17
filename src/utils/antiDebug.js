// 生产环境反调试：devtools 关闭时 debugger 不触发，打开后被反复断住
let timer = null

function blocker() {
  debugger
}

export function startAntiDebug() {
  if (!import.meta.env.PROD) return
  if (timer) return
  timer = setInterval(blocker, 100)
}

export function stopAntiDebug() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
