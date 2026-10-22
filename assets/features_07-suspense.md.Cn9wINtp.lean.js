import{C as r,o as i,c as l,j as e,a as s,E as p,a2 as d}from"./chunks/framework.CE7vFz40.js";const c=`<script setup lang="ts">
/**
 * 练习：Suspense 与异步组件
 *
 * 起始代码已经能跑：Suspense 包着异步的 Profile.vue（顶层 await），
 * 等待期间显示 #fallback。请按 TODO 补全事件日志与懒加载体验：
 *   TODO(1) 给 <Suspense> 绑定 @pending/@resolve/@fallback，写入日志
 *   TODO(2) 给 Profile 加 :key + 按钮，实现「重新加载」
 *   TODO(3) 给异步图表加 1.5s 延迟 + loadingComponent（骨架屏）
 *
 * 坑点提醒：
 * - 事件名是 @resolve（不是 @resolved）；Suspense 没有 @error 事件，
 *   异步 setup 的错误要靠 onErrorCaptured 捕获（参考答案演示）。
 * - App.vue（根组件）顶层禁止 await —— 本文件的 await 只存在于子组件里。
 */
import { defineAsyncComponent, defineComponent, h, ref } from 'vue'
import Profile from './Profile.vue'

/* ───────────────────────────────────────────────
 * 事件日志：把 Suspense 生命周期事件记录下来
 * ─────────────────────────────────────────────── */
const logs = ref<string[]>([])
function log(message: string) {
  logs.value.unshift(\`\${new Date().toLocaleTimeString()} \${message}\`)
}

/* ───────────────────────────────────────────────
 * 图表演示用的两个「内联组件」。
 * 用渲染函数 h() 编写：沙箱里的 vue 运行时是 runtime-only 构建，
 * 不含模板编译器，template 字符串选项不可用。
 * ─────────────────────────────────────────────── */
const ChartPanel = defineComponent({
  setup() {
    const bars = [40, 65, 30, 90, 55, 75]
    return () =>
      h(
        'div',
        { class: 'bars' },
        bars.map((v, i) =>
          h('div', { key: i, class: 'bar', style: { height: \`\${v}%\` } }),
        ),
      )
  },
})
const ChartSkeleton = defineComponent({
  setup() {
    return () => h('div', { class: 'skeleton' }, '图表加载中…')
  },
})

/* ───────────────────────────────────────────────
 * 异步组件：现在 loader 是「秒 resolve」，所以看不到加载态
 * ─────────────────────────────────────────────── */
// TODO(3): 让 loader 延迟 1.5 秒再 resolve，并补上 loadingComponent: ChartSkeleton、
//          delay: 0（delay 默认 200ms，骨架屏会一闪而过甚至不出现）
const AsyncChart = defineAsyncComponent({
  loader: () => Promise.resolve(ChartPanel),
})

/* ───────────────────────────────────────────────
 * 重新加载用的计数器
 * ─────────────────────────────────────────────── */
// TODO(2): 模板里给 <Profile> 加 :key="reloadCount"，并给按钮绑定 @click="reloadCount++"
//          key 一变，整个异步子树重建，重新走一遍 pending → resolve
const reloadCount = ref(0)
<\/script>

<template>
  <section class="suspense-lab">
    <h2>⏳ Suspense 与异步组件</h2>

    <div class="controls">
      <!-- TODO(2): 给这个按钮绑定 @click，让 reloadCount 自增 -->
      <button>🔄 重新加载 Profile（完成 TODO(2) 后生效）</button>
    </div>

    <div class="panels">
      <!-- Suspense：异步边界。#default 里的 async setup 未完成前显示 #fallback -->
      <!-- TODO(1): 在 <Suspense> 标签上绑定 @pending/@resolve/@fallback，分别调用 log(...) -->
      <Suspense>
        <Profile />
        <template #fallback>
          <div class="fallback">正在加载个人资料…（约 1.2s）</div>
        </template>
      </Suspense>

      <div class="chart-box">
        <h3>懒加载图表（defineAsyncComponent）</h3>
        <AsyncChart />
      </div>
    </div>

    <div class="log-panel">
      <h3>事件日志</h3>
      <p v-if="logs.length === 0" class="empty">完成 TODO(1) 后，这里会出现事件时间线</p>
      <p v-for="(item, i) in logs" :key="i">{{ item }}</p>
    </div>
  </section>
</template>

<style scoped>
.suspense-lab {
  max-width: 640px;
  margin: 24px auto;
  padding: 20px;
  display: grid;
  gap: 16px;
  font-family: sans-serif;
}
.suspense-lab h2 {
  margin: 0;
}
.suspense-lab h3 {
  margin: 0 0 8px;
  font-size: 14px;
}
.controls button {
  padding: 6px 14px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
}
.controls button:hover {
  border-color: #42b883;
  color: #33a06f;
}
.panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.fallback {
  border: 1px dashed #c6d2d8;
  border-radius: 10px;
  padding: 16px;
  min-height: 150px;
  display: grid;
  place-items: center;
  color: #8fa0ab;
  animation: pulse 1.2s ease-in-out infinite;
}
@keyframes pulse {
  50% {
    opacity: 0.45;
  }
}
.chart-box {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 12px;
  min-height: 150px;
}
.bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 96px;
}
.bar {
  width: 22px;
  background: #42b883;
  border-radius: 4px 4px 0 0;
}
.skeleton {
  display: grid;
  place-items: center;
  height: 96px;
  border-radius: 6px;
  background: #eef2f4;
  color: #8fa0ab;
  font-size: 13px;
}
.log-panel {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 12px;
  font-size: 12px;
  color: #55636d;
}
.log-panel p {
  margin: 4px 0;
}
.empty {
  color: #b0bcc4;
}
</style>
`,u=`<script setup lang="ts">
/**
 * 练习子组件：异步的个人资料卡
 *
 * 设计决策：
 * - 用顶层 await 模拟接口请求 —— 这会把本组件变成「异步组件」，
 *   必须由父级的 <Suspense> 包裹（子组件允许顶层 await，
 *   根组件 App.vue 禁止，否则沙箱预览白屏）。
 * - 延迟时间由 props.delay 控制，方便调节「等待感」来观察 fallback。
 *
 * 坑点：编译宏（defineProps / defineEmits 等）必须写在顶层 await 之前 ——
 * await 之后的代码在 Promise resolve 前不会执行，宏注册不上会直接编译报错。
 */
const props = defineProps<{
  /** 模拟的请求耗时（毫秒） */
  delay?: number
}>()

/** 假 Promise：真实项目里这里是 fetch / axios */
function fetchProfile(ms: number): Promise<{ name: string; role: string; joined: string }> {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve({ name: '小明', role: '前端工程师', joined: '2024-03' }),
      ms,
    )
  })
}

// 顶层 await：setup 在这里暂停，父级 Suspense 同步显示 #fallback
const profile = await fetchProfile(props.delay ?? 1200)
<\/script>

<template>
  <article class="profile">
    <h3>👤 {{ profile.name }}</h3>
    <p>职位：{{ profile.role }}</p>
    <p>加入时间：{{ profile.joined }}</p>
    <p class="done">—— 异步内容已就绪 ——</p>
  </article>
</template>

<style scoped>
.profile {
  border: 1px solid #d8efe4;
  border-radius: 10px;
  padding: 16px;
  display: grid;
  gap: 6px;
  background: #f7fcf9;
  min-height: 150px;
}
.profile h3 {
  margin: 0;
}
.profile p {
  margin: 0;
  color: #55636d;
  font-size: 13px;
}
.done {
  color: #33a06f;
  font-size: 12px;
}
</style>
`,f=`<script setup lang="ts">
/**
 * 参考答案：Suspense 与异步组件
 *
 * 相比练习版补充：
 * 1. @pending / @resolve / @fallback 三个事件写入日志面板（事件名是
 *    @resolve，不是 @resolved —— SuspenseProps 里只有这三个事件）。
 * 2. :key 计数器实现「重新加载」：key 一变，异步子树整体重建。
 * 3. 失败模式 + onErrorCaptured：异步 setup 抛出的错误由它捕获并返回
 *    false 阻止继续冒泡（Suspense 没有 @error 事件，不是错误边界）。
 * 4. defineAsyncComponent 完整形态：loader + loadingComponent + delay: 0。
 */
import { defineAsyncComponent, defineComponent, h, onErrorCaptured, ref } from 'vue'
import Profile from './Profile.vue'

/* ───────────────────────────────────────────────
 * 状态：事件日志 / 重建计数 / 失败开关 / 最近一次错误
 * ─────────────────────────────────────────────── */
const logs = ref<string[]>([])
function log(message: string) {
  logs.value.unshift(\`\${new Date().toLocaleTimeString()} \${message}\`)
}

const reloadCount = ref(0)
const failMode = ref(false)
const lastError = ref<string | null>(null)

function reload() {
  lastError.value = null
  reloadCount.value++
}

/* ───────────────────────────────────────────────
 * Suspense 事件：记录加载时序
 * ─────────────────────────────────────────────── */
function onPending() {
  log('⏳ pending —— 默认内容开始等待，显示 fallback')
}
function onResolve() {
  log('✅ resolve —— 默认内容全部就绪，切换渲染')
}
function onFallback() {
  log('↩️ fallback —— 已渲染的内容被 fallback 替换')
}

/* ───────────────────────────────────────────────
 * 错误捕获：Profile 在异步 setup 里抛错（fail 模式）会冒泡到这里。
 * 返回 false 阻止继续向上传播 —— 沙箱没有更上层的错误边界，
 * 不接住就是 unhandled error（控制台红字）。
 * ─────────────────────────────────────────────── */
onErrorCaptured((err) => {
  lastError.value = err instanceof Error ? err.message : String(err)
  log(\`❌ 捕获错误：\${lastError.value}\`)
  return false
})

/* ───────────────────────────────────────────────
 * 图表 + 骨架屏：沙箱的 vue 运行时是 runtime-only 构建，
 * 不能用 template 字符串，所以内联组件用渲染函数 h() 编写。
 * ─────────────────────────────────────────────── */
const ChartPanel = defineComponent({
  setup() {
    const bars = [40, 65, 30, 90, 55, 75]
    return () =>
      h(
        'div',
        { class: 'bars' },
        bars.map((v, i) =>
          h('div', { key: i, class: 'bar', style: { height: \`\${v}%\` } }),
        ),
      )
  },
})
const ChartSkeleton = defineComponent({
  setup() {
    return () => h('div', { class: 'skeleton' }, '图表加载中…')
  },
})

/*
 * defineAsyncComponent 完整形态：
 * - 真实项目里 loader 通常写 () => import('./Heavy.vue')，由打包器做代码分割；
 *   沙箱把所有文件打进同一运行时，无法演示真实网络延迟，这里用 setTimeout 模拟。
 * - delay: 0 让 loading 必现（默认 200ms 会一闪而过甚至不出现）。
 */
const AsyncChart = defineAsyncComponent({
  loader: () =>
    new Promise((resolve) => setTimeout(() => resolve(ChartPanel), 1500)),
  loadingComponent: ChartSkeleton,
  delay: 0,
})
const showChart = ref(false)
<\/script>

<template>
  <section class="suspense-lab">
    <h2>⏳ Suspense 与异步组件</h2>

    <div class="controls">
      <label class="switch">
        <input v-model="failMode" type="checkbox" />
        模拟接口 500（Profile 抛错）
      </label>
      <button @click="reload">🔄 重新加载 Profile（:key 重建异步子树）</button>
    </div>

    <div class="panels">
      <!-- :key 变化会替换 Profile 实例，重新走一遍 pending → resolve -->
      <Suspense @pending="onPending" @resolve="onResolve" @fallback="onFallback">
        <Profile :key="reloadCount" :fail="failMode" />
        <template #fallback>
          <!-- 出错时把 fallback 变成错误卡 + 重试；否则是普通加载态 -->
          <div v-if="lastError" class="fallback fallback--error">
            <p>❌ {{ lastError }}</p>
            <button @click="reload">重试</button>
          </div>
          <div v-else class="fallback">正在加载个人资料…（约 1.2s）</div>
        </template>
      </Suspense>

      <div class="chart-box">
        <h3>懒加载图表（defineAsyncComponent）</h3>
        <button class="ghost" @click="showChart = !showChart">
          {{ showChart ? '卸载图表' : '按需加载图表' }}
        </button>
        <!-- v-if 控制挂载时机：defineAsyncComponent 的 loader 在首次渲染时才调用 -->
        <AsyncChart v-if="showChart" />
        <p v-else class="hint">点击按钮才开始加载（1.5s 骨架屏）</p>
      </div>
    </div>

    <div class="log-panel">
      <h3>事件日志</h3>
      <p v-if="logs.length === 0" class="empty">暂无事件</p>
      <p v-for="(item, i) in logs" :key="i">{{ item }}</p>
    </div>
  </section>
</template>

<style scoped>
.suspense-lab {
  max-width: 640px;
  margin: 24px auto;
  padding: 20px;
  display: grid;
  gap: 16px;
  font-family: sans-serif;
}
.suspense-lab h2 {
  margin: 0;
}
.suspense-lab h3 {
  margin: 0 0 8px;
  font-size: 14px;
}
.controls {
  display: flex;
  gap: 16px;
  align-items: center;
}
.controls button {
  padding: 6px 14px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
}
.controls button:hover {
  border-color: #42b883;
  color: #33a06f;
}
.switch {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 13px;
  color: #55636d;
}
.panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.fallback {
  border: 1px dashed #c6d2d8;
  border-radius: 10px;
  padding: 16px;
  min-height: 150px;
  display: grid;
  place-items: center;
  color: #8fa0ab;
  animation: pulse 1.2s ease-in-out infinite;
}
@keyframes pulse {
  50% {
    opacity: 0.45;
  }
}
.fallback--error {
  animation: none;
  border-color: #e8b4b0;
  background: #fdf3f2;
  color: #b3453c;
  gap: 8px;
}
.fallback--error p {
  margin: 0;
  font-size: 13px;
}
.fallback--error button {
  padding: 4px 12px;
  border: 1px solid #e8b4b0;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  color: #b3453c;
}
.chart-box {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 12px;
  min-height: 150px;
  display: grid;
  gap: 8px;
  align-content: start;
}
.ghost {
  justify-self: start;
  padding: 4px 12px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
  font-size: 12px;
}
.hint {
  margin: 0;
  color: #b0bcc4;
  font-size: 12px;
}
.bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 96px;
}
.bar {
  width: 22px;
  background: #42b883;
  border-radius: 4px 4px 0 0;
}
.skeleton {
  display: grid;
  place-items: center;
  height: 96px;
  border-radius: 6px;
  background: #eef2f4;
  color: #8fa0ab;
  font-size: 13px;
}
.log-panel {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 12px;
  font-size: 12px;
  color: #55636d;
}
.log-panel p {
  margin: 4px 0;
}
.empty {
  color: #b0bcc4;
}
</style>
`,h=`<script setup lang="ts">
/**
 * 参考答案子组件：异步的个人资料卡（带失败模拟）
 *
 * 相比练习版新增：
 * 1. fail prop —— 为 true 时在 await 之后抛错，模拟接口 500；
 *    异步 setup 抛出的错误会冒泡，必须由 App 的 onErrorCaptured 接住
 *    （Suspense 没有 @error 事件，它不是错误边界）。
 * 2. delay prop 默认 1.2s，让 fallback 的存在感足够明显。
 *
 * 坑点：编译宏（defineProps 等）必须写在顶层 await 之前，否则编译报错。
 */
const props = defineProps<{
  /** 模拟的请求耗时（毫秒） */
  delay?: number
  /** 模拟服务端失败 */
  fail?: boolean
}>()

/** 假 Promise：真实项目里这里是 fetch / axios */
function fetchProfile(ms: number): Promise<{ name: string; role: string; joined: string }> {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve({ name: '小明', role: '前端工程师', joined: '2024-03' }),
      ms,
    )
  })
}

// 顶层 await：setup 在这里暂停，父级 Suspense 同步显示 #fallback
const profile = await fetchProfile(props.delay ?? 1200)

// 在异步 setup 里抛错：错误冒泡给 Suspense 的祖先，由 onErrorCaptured 捕获；
// 不捕获的话控制台会出现 unhandled error，且 Suspense 永远停在 fallback
if (props.fail) {
  throw new Error('接口 500：模拟加载失败')
}
<\/script>

<template>
  <article class="profile">
    <h3>👤 {{ profile.name }}</h3>
    <p>职位：{{ profile.role }}</p>
    <p>加入时间：{{ profile.joined }}</p>
    <p class="done">—— 异步内容已就绪 ——</p>
  </article>
</template>

<style scoped>
.profile {
  border: 1px solid #d8efe4;
  border-radius: 10px;
  padding: 16px;
  display: grid;
  gap: 6px;
  background: #f7fcf9;
  min-height: 150px;
}
.profile h3 {
  margin: 0;
}
.profile p {
  margin: 0;
  color: #55636d;
  font-size: 13px;
}
.done {
  color: #33a06f;
  font-size: 12px;
}
</style>
`,y=JSON.parse('{"title":"07 Suspense 与异步组件","description":"用 Suspense 接住 async setup：#fallback 加载态、三个生命周期事件、defineAsyncComponent 懒加载与骨架屏。","frontmatter":{"title":"07 Suspense 与异步组件","description":"用 Suspense 接住 async setup：#fallback 加载态、三个生命周期事件、defineAsyncComponent 懒加载与骨架屏。","tags":["Suspense","async setup","defineAsyncComponent"]},"headers":[],"relativePath":"features/07-suspense.md","filePath":"features/07-suspense.md","lastUpdated":1792665939000}'),g={name:"features/07-suspense.md"},x=Object.assign(g,{setup(b){const a={"App.vue":c,"Profile.vue":u},t={"App.vue":f,"Profile.vue":h};return(k,n)=>{const o=r("Playground");return i(),l("div",null,[n[0]||(n[0]=e("h1",{id:"suspense-与异步组件",tabindex:"-1"},[s("Suspense 与异步组件 "),e("a",{class:"header-anchor",href:"#suspense-与异步组件","aria-label":'Permalink to "Suspense 与异步组件"'},"​")],-1)),n[1]||(n[1]=e("blockquote",null,[e("p",null,[e("strong",null,"Suspense · defineAsyncComponent"),s(" · 难度：高级 · 引入版本：Vue 3.0")])],-1)),n[2]||(n[2]=e("div",{class:"feature-summary"},"用 Suspense 接住 async setup：#fallback 加载态、三个生命周期事件、defineAsyncComponent 懒加载与骨架屏。",-1)),p(o,{starter:a,solution:t}),n[3]||(n[3]=d("",18))])}}});export{y as __pageData,x as default};
