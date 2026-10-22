import{C as s,o as l,c as r,j as e,a as t,E as d,a2 as p}from"./chunks/framework.CE7vFz40.js";const c=`<script setup lang="ts">
/**
 * 练习：KeepAlive 组件缓存（外壳，未完成版）
 *
 * TODO(1) 用 <KeepAlive> 包住动态组件
 * TODO(2) 接入 :include（缓存策略下拉）
 * TODO(4) 接入 :max（LRU 上限开关）
 * （TODO(3) 在 TimerTab.vue 里）
 */
import { ref } from 'vue'
import PostsTab from './PostsTab.vue'
import TimerTab from './TimerTab.vue'
import CounterTab from './CounterTab.vue'
import { logs } from './logger'

/** 标签 id -> 组件定义。:is 接受组件对象；模块顶层常量不进响应式，无需 markRaw */
const tabs = {
  posts: PostsTab,
  timer: TimerTab,
  counter: CounterTab,
} as const

type TabId = keyof typeof tabs
const current = ref<TabId>('posts')
const tabLabels: Record<TabId, string> = {
  posts: '文章列表',
  timer: '秒表',
  counter: '计数器',
}

/* TODO(2) 接线后生效；现在只是本地状态，没有传给任何组件 */
const cacheStrategy = ref<'all' | 'no-timer' | 'none'>('all')
/* TODO(4) 接线后生效 */
const maxEnabled = ref(false)
<\/script>

<template>
  <section class="lab">
    <h2>🗂️ KeepAlive 缓存实验室</h2>

    <nav class="tabs">
      <button
        v-for="(comp, id) in tabs"
        :key="id"
        :class="{ active: current === id }"
        @click="current = id as TabId"
      >
        {{ tabLabels[id as TabId] }}
      </button>
    </nav>

    <div class="controls">
      <label>
        缓存策略（TODO(2) 接线）：
        <select v-model="cacheStrategy">
          <option value="all">include 不传（全部缓存）</option>
          <option value="no-timer">排除 TimerTab</option>
          <option value="none">include=[] （谁都不缓存）</option>
        </select>
      </label>
      <label>
        <input type="checkbox" v-model="maxEnabled" />
        max = 2（TODO(4) 接线，观察 LRU 淘汰）
      </label>
    </div>

    <div class="stage">
      <!-- TODO(1): 当前没有 KeepAlive —— 切走再切回，搜索词/计数全丢，
           秒表被销毁重建。用 <KeepAlive> 包住它，再把 TODO(2)/(4) 的
           :include 与 :max 接上。 -->
      <component :is="tabs[current]" />
    </div>

    <div class="console">
      <h3>
        生命周期日志
        <button @click="logs.splice(0)">清空</button>
      </h3>
      <ul>
        <li v-for="(l, i) in logs" :key="i">{{ l }}</li>
        <li v-if="logs.length === 0" class="muted">
          先多点几次标签，观察 onMounted / onUnmounted
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.lab {
  max-width: 560px;
  margin: 20px auto;
  padding: 16px;
  display: grid;
  gap: 14px;
  font-family: sans-serif;
}
.lab h2 {
  margin: 0;
}
.tabs {
  display: flex;
  gap: 6px;
}
.tabs button {
  padding: 7px 14px;
  border: 1px solid #d5dce1;
  border-radius: 8px 8px 0 0;
  background: #f5f7f8;
  cursor: pointer;
  font-size: 13px;
}
.tabs button.active {
  background: #42b883;
  border-color: #42b883;
  color: #fff;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  font-size: 12px;
  color: #55636d;
}
.controls select {
  font-size: 12px;
  padding: 2px 4px;
}
.stage {
  min-height: 190px;
  border: 1px solid #e4e9ec;
  border-top: 2px solid #42b883;
  border-radius: 0 8px 8px 8px;
  padding: 16px;
}
.console {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 12px 14px;
}
.console h3 {
  margin: 0 0 8px;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.console h3 button {
  font-size: 12px;
  padding: 2px 8px;
  border: 1px solid #d5dce1;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
}
.console ul {
  margin: 0;
  padding-left: 18px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
  color: #55636d;
  max-height: 170px;
  overflow: auto;
}
.muted {
  color: #8fa0ab;
  font-size: 12px;
  list-style: none;
  margin-left: -18px;
}
</style>
`,u=`<script setup lang="ts">
/**
 * CounterTab —— 最简单的「本地状态」缓存验证器
 *
 * 没有 KeepAlive 时：切走即销毁，count 归零；
 * 被 KeepAlive 缓存时：停用不销毁，回来 count 原样。
 */
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { log } from './logger'

const count = ref(0)

onMounted(() => log('CounterTab：onMounted'))
onActivated(() => log('CounterTab：onActivated'))
onDeactivated(() => log('CounterTab：onDeactivated'))
onUnmounted(() => log('CounterTab：onUnmounted（未缓存或被淘汰）'))
<\/script>

<template>
  <div class="tab">
    <h3>🔢 计数器</h3>
    <p>当前值：<strong>{{ count }}</strong></p>
    <button @click="count++">+1（切走再回来，看数字还在不在）</button>
  </div>
</template>

<style scoped>
.tab h3 {
  margin: 0 0 10px;
}
strong {
  font-size: 20px;
  color: #42b883;
  font-variant-numeric: tabular-nums;
}
button {
  padding: 6px 12px;
  border: 1px solid #d5dce1;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
  font-size: 13px;
}
button:hover {
  border-color: #42b883;
  color: #33a06f;
}
</style>
`,m=`<script setup lang="ts">
/**
 * PostsTab —— 带筛选状态的列表页
 *
 * 观察点：
 * - mountedAt：真正重新挂载时才会刷新；被 KeepAlive 缓存时切回来
 *   时间戳不变（配合搜索词保留，证明实例没销毁）。
 * - 四个生命周期都打日志，直接看「挂载/卸载」与「激活/停用」的区别。
 */
import { computed, onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { log } from './logger'

const ALL_POSTS = [
  { id: 1, title: 'Vue 3.5 响应式系统重构' },
  { id: 2, title: 'KeepAlive 的 LRU 淘汰策略' },
  { id: 3, title: 'script setup 组件名推断规则' },
  { id: 4, title: 'onActivated 与数据刷新时机' },
  { id: 5, title: '动态组件 :is 的缓存 key' },
]

const keyword = ref('')
const filtered = computed(() =>
  ALL_POSTS.filter((p) => p.title.includes(keyword.value)),
)

/** 每次「真正挂载」取一次时间戳，用来识别实例是否被重建 */
const mountedAt = ref('')
function stamp() {
  mountedAt.value = new Date().toLocaleTimeString('zh-CN', { hour12: false })
}

onMounted(() => {
  stamp()
  log('PostsTab：onMounted（实例创建，拉取列表）')
})
onActivated(() => {
  log('PostsTab：onActivated（进入视野；首次挂载后也会触发一次）')
})
onDeactivated(() => {
  log('PostsTab：onDeactivated（被缓存隐藏，状态保留）')
})
onUnmounted(() => {
  log('PostsTab：onUnmounted（实例真正销毁：未缓存 / 被 max 淘汰）')
})
<\/script>

<template>
  <div class="tab">
    <h3>📰 文章列表</h3>
    <input v-model="keyword" placeholder="输入筛选词，切走再切回试试" />
    <p class="muted">
      本次挂载时间：<strong>{{ mountedAt }}</strong>
      （缓存切回时该时间不变）
    </p>
    <ul>
      <li v-for="post in filtered" :key="post.id">{{ post.title }}</li>
      <li v-if="filtered.length === 0" class="muted">没有匹配的文章</li>
    </ul>
  </div>
</template>

<style scoped>
.tab h3 {
  margin: 0 0 10px;
}
input {
  width: 100%;
  box-sizing: border-box;
  padding: 7px 10px;
  border: 1px solid #d5dce1;
  border-radius: 6px;
  font-size: 13px;
}
ul {
  margin: 10px 0 0;
  padding-left: 20px;
  display: grid;
  gap: 6px;
  font-size: 13px;
}
.muted {
  color: #8fa0ab;
  font-size: 12px;
}
</style>
`,g=`<script setup lang="ts">
/**
 * TimerTab —— 练习版（有坑的写法）
 *
 * 当前：定时器挂在 onMounted / onUnmounted。
 *
 * ⚠️ 一旦外层加了 KeepAlive，切走标签只会触发 onDeactivated，
 *    不会触发 onUnmounted —— 定时器在「看不见的缓存里」继续空转。
 *
 * TODO(3)：把启停迁移到激活/停用生命周期 ——
 *   - onActivated：启动（首次挂载后也会触发，因此无需再写 onMounted）
 *   - onDeactivated：clearInterval
 *   - onUnmounted：保留 clearInterval 兜底（被 max 淘汰 / exclude 时）
 *   完成后对照日志：切走时秒数必须暂停，切回继续。
 */
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { log } from './logger'

const seconds = ref(0)
let timer: number | undefined

function start() {
  if (timer) return
  timer = window.setInterval(() => seconds.value++, 1000)
}
function stop() {
  if (timer) {
    window.clearInterval(timer)
    timer = undefined
  }
}

onMounted(() => {
  start()
  log('TimerTab：onMounted（定时器启动）')
})
onActivated(() => log('TimerTab：onActivated'))
onDeactivated(() => log('TimerTab：onDeactivated（⚠️ 练习版定时器仍在跑）'))
onUnmounted(() => {
  stop()
  log('TimerTab：onUnmounted（定时器清理）')
})
<\/script>

<template>
  <div class="tab">
    <h3>⏱️ 秒表</h3>
    <p class="time">{{ seconds }}s</p>
    <p class="muted">
      练习版：切走标签后看日志/秒数 —— 组件被缓存但定时器还在走。
      TODO(3) 后切走应暂停。
    </p>
  </div>
</template>

<style scoped>
.tab h3 {
  margin: 0 0 10px;
}
.time {
  font-size: 28px;
  font-weight: 700;
  color: #e06c3b;
  font-variant-numeric: tabular-nums;
  margin: 0 0 6px;
}
.muted {
  color: #8fa0ab;
  font-size: 12px;
  margin: 0;
}
</style>
`,b=`import { ref } from 'vue'

/**
 * 跨组件的生命周期日志总线
 *
 * 设计决策：KeepAlive 的激活/停用发生在不同子组件内部，需要一个
 * App 与各 Tab 共享的日志列表把时序拼到同一面板上。模块级单例
 * （ESM 模块天然单例）即可，无需 provide/inject。
 */
export const logs = ref<string[]>([])

export function log(msg: string) {
  const time = new Date().toLocaleTimeString('zh-CN', { hour12: false })
  logs.value.unshift(\`[\${time}] \${msg}\`)
  if (logs.value.length > 30) {
    logs.value.length = 30
  }
}
`,v=`<script setup lang="ts">
/**
 * 参考答案：KeepAlive 组件缓存（外壳，已完成版）
 *
 * 接线点：
 * - <KeepAlive :include :max> 包住唯一动态组件直接子节点；
 * - include 由缓存策略计算：undefined = 全部缓存；空数组 [] = 谁都不缓存
 *   （这是常见坑：空数组不等于「不传」）；
 * - max = 2 开启 LRU；undefined 表示不限。
 */
import { computed, ref } from 'vue'
import PostsTab from './PostsTab.vue'
import TimerTab from './TimerTab.vue'
import CounterTab from './CounterTab.vue'
import { logs } from './logger'

const tabs = {
  posts: PostsTab,
  timer: TimerTab,
  counter: CounterTab,
} as const

type TabId = keyof typeof tabs
const current = ref<TabId>('posts')
const tabLabels: Record<TabId, string> = {
  posts: '文章列表',
  timer: '秒表',
  counter: '计数器',
}

const cacheStrategy = ref<'all' | 'no-timer' | 'none'>('all')
const maxEnabled = ref(false)

/** include 匹配的是「组件名」：script setup 下由文件名推断 */
const includeList = computed<string[] | undefined>(() => {
  if (cacheStrategy.value === 'no-timer') return ['PostsTab', 'CounterTab']
  if (cacheStrategy.value === 'none') return []
  return undefined // 不传 include = 全部缓存
})
<\/script>

<template>
  <section class="lab">
    <h2>🗂️ KeepAlive 缓存实验室</h2>

    <nav class="tabs">
      <button
        v-for="(_comp, id) in tabs"
        :key="id"
        :class="{ active: current === id }"
        @click="current = id as TabId"
      >
        {{ tabLabels[id as TabId] }}
      </button>
    </nav>

    <div class="controls">
      <label>
        缓存策略：
        <select v-model="cacheStrategy">
          <option value="all">include 不传（全部缓存）</option>
          <option value="no-timer">排除 TimerTab</option>
          <option value="none">include=[]（谁都不缓存）</option>
        </select>
      </label>
      <label>
        <input type="checkbox" v-model="maxEnabled" />
        max = 2（开启后按 posts→timer→counter 访问，观察 LRU）
      </label>
    </div>

    <div class="stage">
      <KeepAlive :include="includeList" :max="maxEnabled ? 2 : undefined">
        <component :is="tabs[current]" />
      </KeepAlive>
    </div>

    <div class="console">
      <h3>
        生命周期日志
        <button @click="logs.splice(0)">清空</button>
      </h3>
      <ul>
        <li v-for="(l, i) in logs" :key="i">{{ l }}</li>
        <li v-if="logs.length === 0" class="muted">
          点几个标签：首次 onMounted→onActivated，切走 onDeactivated，切回 onActivated
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.lab {
  max-width: 560px;
  margin: 20px auto;
  padding: 16px;
  display: grid;
  gap: 14px;
  font-family: sans-serif;
}
.lab h2 {
  margin: 0;
}
.tabs {
  display: flex;
  gap: 6px;
}
.tabs button {
  padding: 7px 14px;
  border: 1px solid #d5dce1;
  border-radius: 8px 8px 0 0;
  background: #f5f7f8;
  cursor: pointer;
  font-size: 13px;
}
.tabs button.active {
  background: #42b883;
  border-color: #42b883;
  color: #fff;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  font-size: 12px;
  color: #55636d;
}
.controls select {
  font-size: 12px;
  padding: 2px 4px;
}
.stage {
  min-height: 190px;
  border: 1px solid #e4e9ec;
  border-top: 2px solid #42b883;
  border-radius: 0 8px 8px 8px;
  padding: 16px;
}
.console {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 12px 14px;
}
.console h3 {
  margin: 0 0 8px;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.console h3 button {
  font-size: 12px;
  padding: 2px 8px;
  border: 1px solid #d5dce1;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
}
.console ul {
  margin: 0;
  padding-left: 18px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
  color: #55636d;
  max-height: 170px;
  overflow: auto;
}
.muted {
  color: #8fa0ab;
  font-size: 12px;
  list-style: none;
  margin-left: -18px;
}
</style>
`,f=`<script setup lang="ts">
/**
 * CounterTab —— 最简单的「本地状态」缓存验证器
 *
 * 没有 KeepAlive 时：切走即销毁，count 归零；
 * 被 KeepAlive 缓存时：停用不销毁，回来 count 原样。
 */
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { log } from './logger'

const count = ref(0)

onMounted(() => log('CounterTab：onMounted'))
onActivated(() => log('CounterTab：onActivated'))
onDeactivated(() => log('CounterTab：onDeactivated'))
onUnmounted(() => log('CounterTab：onUnmounted（未缓存或被淘汰）'))
<\/script>

<template>
  <div class="tab">
    <h3>🔢 计数器</h3>
    <p>当前值：<strong>{{ count }}</strong></p>
    <button @click="count++">+1（切走再回来，看数字还在不在）</button>
  </div>
</template>

<style scoped>
.tab h3 {
  margin: 0 0 10px;
}
strong {
  font-size: 20px;
  color: #42b883;
  font-variant-numeric: tabular-nums;
}
button {
  padding: 6px 12px;
  border: 1px solid #d5dce1;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
  font-size: 13px;
}
button:hover {
  border-color: #42b883;
  color: #33a06f;
}
</style>
`,h=`<script setup lang="ts">
/**
 * PostsTab —— 带筛选状态的列表页
 *
 * 观察点：
 * - mountedAt：真正重新挂载时才会刷新；被 KeepAlive 缓存时切回来
 *   时间戳不变（配合搜索词保留，证明实例没销毁）。
 * - 四个生命周期都打日志，直接看「挂载/卸载」与「激活/停用」的区别。
 */
import { computed, onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { log } from './logger'

const ALL_POSTS = [
  { id: 1, title: 'Vue 3.5 响应式系统重构' },
  { id: 2, title: 'KeepAlive 的 LRU 淘汰策略' },
  { id: 3, title: 'script setup 组件名推断规则' },
  { id: 4, title: 'onActivated 与数据刷新时机' },
  { id: 5, title: '动态组件 :is 的缓存 key' },
]

const keyword = ref('')
const filtered = computed(() =>
  ALL_POSTS.filter((p) => p.title.includes(keyword.value)),
)

/** 每次「真正挂载」取一次时间戳，用来识别实例是否被重建 */
const mountedAt = ref('')
function stamp() {
  mountedAt.value = new Date().toLocaleTimeString('zh-CN', { hour12: false })
}

onMounted(() => {
  stamp()
  log('PostsTab：onMounted（实例创建，拉取列表）')
})
onActivated(() => {
  log('PostsTab：onActivated（进入视野；首次挂载后也会触发一次）')
})
onDeactivated(() => {
  log('PostsTab：onDeactivated（被缓存隐藏，状态保留）')
})
onUnmounted(() => {
  log('PostsTab：onUnmounted（实例真正销毁：未缓存 / 被 max 淘汰）')
})
<\/script>

<template>
  <div class="tab">
    <h3>📰 文章列表</h3>
    <input v-model="keyword" placeholder="输入筛选词，切走再切回试试" />
    <p class="muted">
      本次挂载时间：<strong>{{ mountedAt }}</strong>
      （缓存切回时该时间不变）
    </p>
    <ul>
      <li v-for="post in filtered" :key="post.id">{{ post.title }}</li>
      <li v-if="filtered.length === 0" class="muted">没有匹配的文章</li>
    </ul>
  </div>
</template>

<style scoped>
.tab h3 {
  margin: 0 0 10px;
}
input {
  width: 100%;
  box-sizing: border-box;
  padding: 7px 10px;
  border: 1px solid #d5dce1;
  border-radius: 6px;
  font-size: 13px;
}
ul {
  margin: 10px 0 0;
  padding-left: 20px;
  display: grid;
  gap: 6px;
  font-size: 13px;
}
.muted {
  color: #8fa0ab;
  font-size: 12px;
}
</style>
`,x=`<script setup lang="ts">
/**
 * TimerTab —— 参考答案版
 *
 * 关键改造：副作用（定时器）跟随「激活状态」而不是「挂载状态」：
 * - onActivated 启动：首次挂载后同样触发，所以一个钩子覆盖两种进入；
 * - onDeactivated 停止：被 KeepAlive 隐藏时立即暂停，不再后台空转；
 * - onUnmounted 保留兜底 stop：组件未被缓存或被 max 淘汰时真正销毁。
 *
 * 幂等保护：start/stop 都先判断 timer，避免钩子重复触发时叠加定时器。
 */
import { onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue'
import { log } from './logger'

const seconds = ref(0)
let timer: number | undefined

function start() {
  if (timer) return
  timer = window.setInterval(() => seconds.value++, 1000)
}
function stop() {
  if (timer) {
    window.clearInterval(timer)
    timer = undefined
  }
}

onMounted(() => log('TimerTab：onMounted'))
onActivated(() => {
  start()
  log('TimerTab：onActivated → 计时开始/继续')
})
onDeactivated(() => {
  stop()
  log('TimerTab：onDeactivated → 计时暂停')
})
onUnmounted(() => {
  stop()
  log('TimerTab：onUnmounted（实例销毁，兜底清理）')
})
<\/script>

<template>
  <div class="tab">
    <h3>⏱️ 秒表</h3>
    <p class="time">{{ seconds }}s</p>
    <p class="muted">
      参考答案：切走标签秒数暂停，切回继续；被淘汰/不缓存时 onUnmounted 兜底。
    </p>
  </div>
</template>

<style scoped>
.tab h3 {
  margin: 0 0 10px;
}
.time {
  font-size: 28px;
  font-weight: 700;
  color: #e06c3b;
  font-variant-numeric: tabular-nums;
  margin: 0 0 6px;
}
.muted {
  color: #8fa0ab;
  font-size: 12px;
  margin: 0;
}
</style>
`,T=`import { ref } from 'vue'

/**
 * 跨组件的生命周期日志总线
 *
 * 设计决策：KeepAlive 的激活/停用发生在不同子组件内部，需要一个
 * App 与各 Tab 共享的日志列表把时序拼到同一面板上。模块级单例
 * （ESM 模块天然单例）即可，无需 provide/inject。
 */
export const logs = ref<string[]>([])

export function log(msg: string) {
  const time = new Date().toLocaleTimeString('zh-CN', { hour12: false })
  logs.value.unshift(\`[\${time}] \${msg}\`)
  if (logs.value.length > 30) {
    logs.value.length = 30
  }
}
`,D=JSON.parse('{"title":"14 KeepAlive 组件缓存","description":"缓存动态组件实例：include/exclude 名称匹配、max 的 LRU 淘汰、onActivated/onDeactivated 与定时器暂停恢复。","frontmatter":{"title":"14 KeepAlive 组件缓存","description":"缓存动态组件实例：include/exclude 名称匹配、max 的 LRU 淘汰、onActivated/onDeactivated 与定时器暂停恢复。","tags":["KeepAlive","动态组件","onActivated","LRU"]},"headers":[],"relativePath":"features/14-keep-alive.md","filePath":"features/14-keep-alive.md","lastUpdated":1792665939000}'),k={name:"features/14-keep-alive.md"},P=Object.assign(k,{setup(A){const o={"App.vue":c,"CounterTab.vue":u,"PostsTab.vue":m,"TimerTab.vue":g,"logger.ts":b},i={"App.vue":v,"CounterTab.vue":f,"PostsTab.vue":h,"TimerTab.vue":x,"logger.ts":T};return(y,n)=>{const a=s("Playground");return l(),r("div",null,[n[0]||(n[0]=e("h1",{id:"keepalive-组件缓存",tabindex:"-1"},[t("KeepAlive 组件缓存 "),e("a",{class:"header-anchor",href:"#keepalive-组件缓存","aria-label":'Permalink to "KeepAlive 组件缓存"'},"​")],-1)),n[1]||(n[1]=e("blockquote",null,[e("p",null,[e("strong",null,"<KeepAlive> · include/exclude/max · onActivated"),t(" · 难度：进阶 · 引入版本：Vue 3.0（内置）")])],-1)),n[2]||(n[2]=e("div",{class:"feature-summary"},"缓存动态组件实例：include/exclude 名称匹配、max 的 LRU 淘汰、onActivated/onDeactivated 与定时器暂停恢复。",-1)),d(a,{starter:o,solution:i}),n[3]||(n[3]=p(`<hr><h1 id="keepalive-组件缓存-1" tabindex="-1">KeepAlive 组件缓存 <a class="header-anchor" href="#keepalive-组件缓存-1" aria-label="Permalink to &quot;KeepAlive 组件缓存&quot;">​</a></h1><h2 id="这是什么" tabindex="-1">这是什么 <a class="header-anchor" href="#这是什么" aria-label="Permalink to &quot;这是什么&quot;">​</a></h2><p><code>&lt;KeepAlive&gt;</code> 是 Vue 内置组件，用来<strong>缓存不活动的组件实例</strong>（连同它们的 DOM 与内部状态）。在多个动态组件之间切换时，默认行为是「切走即卸载、 切回即重建」——输入框内容清空、列表重新请求、定时器重新初始化； 包一层 <code>&lt;KeepAlive&gt;</code> 后，切走的组件只是被<strong>停用（deactivate）</strong>， 切回来时**激活（activate）**即可，状态原样还在。</p><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">KeepAlive</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  &lt;component :is=&quot;currentTab&quot; /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">KeepAlive</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><p>要求：被缓存的是组件，且 KeepAlive 与动态组件之间不要插普通元素， 它需要一个「当前激活的直接子组件」。</p><h2 id="生命周期的变化-重点" tabindex="-1">生命周期的变化（重点） <a class="header-anchor" href="#生命周期的变化-重点" aria-label="Permalink to &quot;生命周期的变化（重点）&quot;">​</a></h2><p>被缓存后，组件走的是<strong>激活/停用</strong>而不是挂载/卸载：</p><table tabindex="0"><thead><tr><th>时机</th><th>无 KeepAlive</th><th>有 KeepAlive</th></tr></thead><tbody><tr><td>第一次进入</td><td>onMounted</td><td>onMounted <strong>→ onActivated</strong></td></tr><tr><td>切走</td><td>onUnmounted</td><td><strong>onDeactivated</strong>（实例保留）</td></tr><tr><td>再切回</td><td>重新 setup + onMounted</td><td><strong>onActivated</strong>（状态还在）</td></tr><tr><td>被 max 淘汰 / exclude 命中</td><td>——</td><td>onDeactivated → onUnmounted（真正销毁）</td></tr></tbody></table><p>两条实践铁律：</p><ol><li><strong>「每次进入都要做」的副作用放 onActivated</strong>：重新拉数据、埋点上报、 滚动复位。onMounted 只在真正创建时执行一次。</li><li><strong>停用后不该跑的东西在 onDeactivated 停掉</strong>：定时器、WebSocket、 轮询、音视频播放。否则组件「藏在缓存里」仍在后台空转。</li></ol><h2 id="include-exclude-max" tabindex="-1">include / exclude / max <a class="header-anchor" href="#include-exclude-max" aria-label="Permalink to &quot;include / exclude / max&quot;">​</a></h2><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 只缓存名字匹配的组件（字符串逗号分隔 / 正则 / 数组） --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">KeepAlive</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> include</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;PostsTab,CounterTab&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> :</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">max</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  &lt;component :is=&quot;currentTab&quot; /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">KeepAlive</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><ul><li><code>include</code>：只缓存命中的；<code>exclude</code>：命中的<strong>不</strong>缓存（优先级更高）； 两者都支持 <code>string | RegExp | (string | RegExp)[]</code>。</li><li><strong>匹配的是组件名</strong>：<code>&lt;script setup&gt;</code> 下名字由<strong>文件名</strong>推断 （<code>PostsTab.vue</code> → <code>&quot;PostsTab&quot;</code>）；非 SFC 的内联组件需要显式 <code>defineOptions({ name: &#39;PostsTab&#39; })</code>，匿名组件匹配不上 include。</li><li><code>max</code>：缓存实例数上限。超过时按 <strong>LRU（最近最少使用）</strong> 淘汰 最久没被访问的实例——被淘汰实例会真正 onUnmounted。 本练习把 max 设为 2、依次访问 3 个标签，可在日志里看到淘汰链。</li></ul><h2 id="什么时候该缓存-不该缓存" tabindex="-1">什么时候该缓存 / 不该缓存 <a class="header-anchor" href="#什么时候该缓存-不该缓存" aria-label="Permalink to &quot;什么时候该缓存 / 不该缓存&quot;">​</a></h2><ul><li><strong>该缓存</strong>：带筛选/滚动/表单草稿的列表页、多步表单、切走就重新 请求代价高的面板。</li><li><strong>要谨慎</strong>：实时性强的页面（必须 onActivated 里主动刷新）、 持有大量数据/连接的重型组件（配合 onDeactivated 释放，或直接 exclude）。</li></ul><h2 id="动手试" tabindex="-1">动手试 <a class="header-anchor" href="#动手试" aria-label="Permalink to &quot;动手试&quot;">​</a></h2><ol><li><strong>TODO(1)</strong>：先在没有 KeepAlive 的状态下切换标签 —— 搜索词、 计数器全部丢失；用 <code>&lt;KeepAlive&gt;</code> 包住动态组件，状态立刻保留。</li><li><strong>TODO(2)</strong>：给 KeepAlive 接 <code>:include</code>，选择「排除 TimerTab」 策略 —— 观察它切走时直接 onUnmounted，回来时重新挂载、秒数归零。</li><li><strong>TODO(3)</strong>：改造 TimerTab：计时的启停从 onMounted/onUnmounted 挪到 onActivated/onDeactivated —— 被缓存隐藏时计时暂停， 回来继续，而不是后台偷跑。</li><li><strong>TODO(4)</strong>：开启 <code>:max=&quot;2&quot;</code>，按 Posts → Timer → Counter 顺序 访问，再回 Posts —— 日志里能看到最久未用的 Posts 先被 LRU 淘汰。</li></ol><h2 id="常见坑-真实踩坑记录" tabindex="-1">常见坑（真实踩坑记录） <a class="header-anchor" href="#常见坑-真实踩坑记录" aria-label="Permalink to &quot;常见坑（真实踩坑记录）&quot;">​</a></h2><ul><li><strong>以为切回来会重新 onMounted 拉数据</strong>：缓存后 onMounted 不再触发， 列表永远停在旧数据。需要刷新就用 onActivated（注意首次挂载它也会 触发，别和 onMounted 重复请求）。</li><li><strong>缓存的是 DOM 但定时器照跑</strong>：切走标签后秒数还在涨、WS 还在收消息， 全是因为没在 onDeactivated 暂停。</li><li><strong>include 不生效</strong>：组件没有 name。<code>&lt;script setup&gt;</code> 靠文件名推断， 把文件重命名为内嵌组件时名字就变了；动态 import 的内联对象组件 要用 defineOptions 显式命名。</li><li><strong>KeepAlive 里放了多个/普通子节点</strong>：<code>v-if</code> + 多个组件分支可以工作， 但中间插入 <code>&lt;div&gt;</code> 会让缓存找不到唯一组件子节点；动态 <code>:is</code> 最稳。</li><li><strong>max 以为是「最多存活 N 个页面」</strong>：它是缓存条目上限，当前正在 显示的组件始终存在；淘汰发生在新实例进缓存、超过上限的瞬间。</li><li><strong>在缓存组件上用 key 乱变</strong>：<code>:key</code> 每次渲染都变等于强制重建， KeepAlive 完全失效。</li></ul><hr><h2 id="源码参考" tabindex="-1">源码参考 <a class="header-anchor" href="#源码参考" aria-label="Permalink to &quot;源码参考&quot;">​</a></h2><ul><li>特性目录：<a href="https://github.com/YZhiJie/vue3-features-lab/tree/main/src/features/14-keep-alive" target="_blank" rel="noreferrer"><code>src/features/14-keep-alive/</code></a></li></ul>`,23))])}}});export{D as __pageData,P as default};
