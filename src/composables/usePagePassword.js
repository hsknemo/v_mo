import { ref, computed } from 'vue'

const PASS_KEY = 'v_movie_page_pwd_cached'
const FAIL_KEY = 'v_movie_page_pwd_fail'
const LOCK_KEY = 'v_movie_page_pwd_lock'

const FAIL_THRESHOLD = 5
const LOCK_STEP = 30
const LOCK_MAX = 300

const globalPassword = ref('')
const loaded = ref(false)
const unlocked = ref(false)
const showDialog = ref(false)
const pwdInput = ref('')
const pwdError = ref('')
const lockCountdown = ref(0)
let lockTimer = null

const requiresPassword = computed(() => {
  return Boolean(globalPassword.value)
})

export function setGlobalPassword(pwd) {
  globalPassword.value = pwd ? String(pwd) : ''
  loaded.value = true
  // 密码更新后重新判断是否需要通过（密码清空则直接放行）
  if (!globalPassword.value) {
    unlocked.value = true
    showDialog.value = false
  } else if (!isPassedCached()) {
    unlocked.value = false
  } else {
    unlocked.value = true
  }
}

async function loadPagePassword() {
  loaded.value = true
}

function isPassedCached() {
  return localStorage.getItem(PASS_KEY) === '1'
}

function clearLock() {
  localStorage.removeItem(LOCK_KEY)
  if (lockTimer) {
    clearInterval(lockTimer)
    lockTimer = null
  }
  lockCountdown.value = 0
}

function startCountdown() {
  const until = Number(localStorage.getItem(LOCK_KEY) || 0)
  if (!until || until <= Date.now()) {
    clearLock()
    return
  }
  const tick = () => {
    const remain = Math.ceil((until - Date.now()) / 1000)
    if (remain <= 0) {
      clearLock()
      localStorage.removeItem(FAIL_KEY)
      return
    }
    lockCountdown.value = remain
  }
  tick()
  lockTimer = setInterval(tick, 1000)
}

function isLocked() {
  const until = Number(localStorage.getItem(LOCK_KEY) || 0)
  if (!until) return false
  if (until <= Date.now()) {
    clearLock()
    localStorage.removeItem(FAIL_KEY)
    return false
  }
  return true
}

function recordFail() {
  const count = Number(localStorage.getItem(FAIL_KEY) || 0) + 1
  localStorage.setItem(FAIL_KEY, String(count))
  if (count >= FAIL_THRESHOLD) {
    const exceeded = count - FAIL_THRESHOLD
    const sec = Math.min(LOCK_STEP + exceeded * LOCK_STEP, LOCK_MAX)
    localStorage.setItem(LOCK_KEY, String(Date.now() + sec * 1000))
    startCountdown()
  }
}

function verify(input) {
  return String(input) === globalPassword.value
}

function submitPwd() {
  if (lockCountdown.value > 0) return
  const input = pwdInput.value
  if (!input) {
    pwdError.value = '请输入密码'
    return
  }
  if (!verify(input)) {
    pwdError.value = '密码错误，请重试'
    pwdInput.value = ''
    recordFail()
    return
  }
  clearLock()
  localStorage.removeItem(FAIL_KEY)
  localStorage.setItem(PASS_KEY, '1')
  unlocked.value = true
  pwdInput.value = ''
  pwdError.value = ''
  showDialog.value = false
}

function ensureUnlocked(forcePrompt = false) {
  if (!globalPassword.value) {
    unlocked.value = true
    showDialog.value = false
    return Promise.resolve(true)
  }
  if (isLocked()) {
    startCountdown()
    showDialog.value = true
    unlocked.value = false
    return Promise.resolve(false)
  }
  if (!forcePrompt && isPassedCached()) {
    unlocked.value = true
    showDialog.value = false
    return Promise.resolve(true)
  }
  showDialog.value = true
  unlocked.value = false
  return Promise.resolve(false)
}

export function usePagePassword() {
  return {
    globalPassword,
    loaded,
    unlocked,
    showDialog,
    pwdInput,
    pwdError,
    lockCountdown,
    requiresPassword,
    loadPagePassword,
    ensureUnlocked,
    submitPwd,
  }
}
