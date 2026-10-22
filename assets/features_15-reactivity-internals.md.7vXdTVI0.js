import{C as s,o as c,c as l,j as n,a as t,E as o,a2 as p}from"./chunks/framework.CE7vFz40.js";const d=`<script setup lang="ts">
/**
 * 练习：手写响应式原理（mini reactivity）
 *
 * 这份骨架能编译运行，但响应式「不工作」—— 四个 TODO 补完后，
 * 点按钮界面就会自动更新：
 *   TODO(1) track / trigger：三层依赖表
 *   TODO(2) reactive：Proxy 的 get/set
 *   TODO(3) refImpl：每个实例闭包一个 dep
 *   TODO(4) computedImpl：lazy + dirty 缓存
 *
 * 注意：下面的 effect / reactive / refImpl / computedImpl 都是我们
 * 自己实现的「迷你 Vue」，与文件底部从 'vue' 引入的 ref 只是同名思想；
 * Vue 的 ref 只用来驱动结果面板（沙箱里总得有东西渲染 UI）。
 */
import { ref } from 'vue'

/* ─────────────────────────── mini 响应式内核 ─────────────────────────── */

type EffectFn = () => void
/** 当前正在运行、应该收集依赖的副作用（真实实现是一个栈，教学版用单变量） */
let activeEffect: EffectFn | null = null

/** 注册副作用：立即执行一次，执行期间的读操作都会把它收集为依赖 */
function effect(fn: EffectFn) {
  activeEffect = fn
  fn()
  activeEffect = null
}

/** 依赖表：对象 → 属性 → 副作用集合 */
const targetMap = new WeakMap<object, Map<string | symbol, Set<EffectFn>>>()

/** 派发计数（含 ref/computed），用于面板观察 */
const triggerCount = ref(0)

function track(target: object, key: string | symbol) {
  // TODO(1)：
  // 1) activeEffect 为 null 直接 return（说明这次读取不在任何副作用里）
  // 2) targetMap.get(target) 不存在就 new Map 并 set
  // 3) depsMap.get(key) 不存在就 new Set 并 set
  // 4) dep.add(activeEffect)
  void target
  void key
}

function trigger(target: object, key: string | symbol) {
  // TODO(1)：
  // 1) 找到 targetMap.get(target)?.get(key)
  // 2) triggerCount.value++
  // 3) forEach 逐个执行
  void target
  void key
}

function reactive<T extends object>(obj: T): T {
  // TODO(2)：返回 new Proxy(obj, { get / set })
  //   get(t, k, receiver)：先 track(t, k)，再 Reflect.get
  //   set(t, k, v, receiver)：Reflect.set 后 trigger(t, k)，return true
  return obj
}

interface MiniRef<T> {
  value: T
}

function refImpl<T>(initial: T): MiniRef<T> {
  let _value = initial
  // TODO(3)：闭包建 const dep = new Set<EffectFn>()
  //   get value()：activeEffect && dep.add(...)，return _value
  //   set value(v)：v === _value 直接返回；否则赋值、triggerCount++、
  //                 dep.forEach(fn => fn())
  return {
    get value() {
      return _value
    },
    set value(v: T) {
      _value = v
    },
  }
}

function computedImpl<T>(getter: () => T): MiniRef<T> {
  // TODO(4)：
  //   let cached: T, dirty = true
  //   const dep = new Set<EffectFn>()            // 依赖本 computed 的下游
  //   const markDirty = () => { dirty = true; dep.forEach(fn => fn()) }
  //   get value()：
  //     1) activeEffect 存在就 dep.add(activeEffect)
  //     2) dirty 时：保存外层 activeEffect → 置为 markDirty →
  //        cached = getter()（期间上游 ref/reactive 收集到 markDirty）
  //        → 恢复外层 → dirty=false → computedEvals.value++
  //     3) return cached
  return {
    get value() {
      return getter() // 占位：没有缓存，每次读取都重算
    },
  }
}

/* ─────────────────────────── 演示状态 ─────────────────────────── */

const computedEvals = ref(0)

// ① reactive：商品（多字段，观察依赖精确到 key）
const product = reactive({ price: 10, quantity: 2, tag: '新品' })
const totalView = ref(product.price * product.quantity)
const totalRuns = ref(0)
effect(() => {
  totalView.value = product.price * product.quantity
  totalRuns.value++
})

// ② ref：独立 dep
const n = refImpl(0)
const doubleView = ref(0)
const doubleRuns = ref(0)
effect(() => {
  doubleView.value = n.value * 2
  doubleRuns.value++
})

// ③ computed：lazy + dirty
const first = refImpl('诸葛')
const last = refImpl('亮')
const fullName = computedImpl(() => \`\${first.value}·\${last.value}\`)
const nameView = ref(fullName.value)
const nameRuns = ref(0)
effect(() => {
  nameView.value = fullName.value
  nameRuns.value++
})

/* ─────────────────────────── 操作与日志 ─────────────────────────── */

const logs = ref<string[]>([])
function log(msg: string) {
  logs.value.unshift(\`[\${new Date().toLocaleTimeString('zh-CN', { hour12: false })}] \${msg}\`)
  if (logs.value.length > 10) logs.value.pop()
}

function bumpPrice() {
  product.price += 10
  log(\`price → \${product.price}\`)
}
function bumpQty() {
  product.quantity += 1
  log(\`quantity → \${product.quantity}\`)
}
function changeTag() {
  product.tag = product.tag === '新品' ? '促销' : '新品'
  log(\`修改无 effect 依赖的 tag → \${product.tag}（运行次数不应增加）\`)
}
function bumpN() {
  n.value += 1
}
function changeLast() {
  last.value = last.value === '亮' ? '孔明' : '亮'
}
function readCached() {
  // 在 effect 外读取：脏才重算，干净时 computedEvals 不变
  const v = fullName.value
  log(\`缓存读取：\${v}（求值次数见面板）\`)
}
<\/script>

<template>
  <section class="lab">
    <h2>🔬 mini 响应式内核</h2>

    <!-- ① reactive -->
    <div class="card">
      <h3>① reactive（Proxy + 字段级依赖）</h3>
      <p>单价 {{ product.price }} × 数量 {{ product.quantity }} = <strong>{{ totalView }}</strong></p>
      <div class="row">
        <button @click="bumpPrice">price +10</button>
        <button @click="bumpQty">quantity +1</button>
        <button @click="changeTag">改无关字段 tag</button>
      </div>
      <p class="muted">总价 effect 运行次数：<strong>{{ totalRuns }}</strong>（改 tag 不应增加）</p>
    </div>

    <!-- ② ref -->
    <div class="card">
      <h3>② refImpl（闭包 dep）</h3>
      <p>n = {{ n.value }}，effect 里的 2×n = <strong>{{ doubleView }}</strong></p>
      <button @click="bumpN">n +1</button>
      <p class="muted">double effect 运行次数：<strong>{{ doubleRuns }}</strong></p>
    </div>

    <!-- ③ computed -->
    <div class="card">
      <h3>③ computedImpl（lazy + dirty）</h3>
      <p>effect 中的全名：<strong>{{ nameView }}</strong></p>
      <div class="row">
        <button @click="changeLast">改姓/名（上游变化，标脏）</button>
        <button @click="readCached">effect 外读取一次</button>
      </div>
      <p class="muted">
        全名 effect 运行 {{ nameRuns }} 次；computed 求值
        <strong>{{ computedEvals }}</strong> 次（干净读取不增加）
      </p>
    </div>

    <!-- 统计 -->
    <div class="card stat">
      <h3>派发统计与操作日志</h3>
      <p>trigger 总次数：<strong>{{ triggerCount }}</strong></p>
      <ul class="mini-log">
        <li v-for="(l, i) in logs" :key="i">{{ l }}</li>
        <li v-if="logs.length === 0" class="muted">
          练习版：点按钮只有数据变化，effect 不会重跑 —— 去补 TODO
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
.card {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 14px;
  display: grid;
  gap: 10px;
}
.card h3 {
  margin: 0;
  font-size: 14px;
}
.card p {
  margin: 0;
  font-size: 13px;
}
.row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
strong {
  font-variant-numeric: tabular-nums;
  color: #33a06f;
}
.muted {
  font-size: 12px;
  color: #8fa0ab;
}
.mini-log {
  margin: 0;
  padding-left: 18px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
  color: #55636d;
}
</style>
`,u=`<script setup lang="ts">
/**
 * 参考答案：手写响应式原理（mini reactivity，约 60 行内核）
 *
 * 实现链路：
 *   effect 立即跑一次，期间 activeEffect 指向自己
 *     → 读 reactive/ref 触发 track，effect 被登记进三层依赖表
 *   写数据触发 trigger
 *     → 取出对应 key 的 Set，逐个重跑 effect
 *   computed 额外用 dirty 做缓存，上游变化只标脏、不立即重算
 *
 * 与生产实现的差距（feature.md 详述）：无 scheduler 批量去重、
 * 无依赖 cleanup、activeEffect 单变量而非栈、非 3.5 版本计数结构。
 */
import { ref } from 'vue'

/* ─────────────────────────── mini 响应式内核 ─────────────────────────── */

type EffectFn = () => void
let activeEffect: EffectFn | null = null

function effect(fn: EffectFn) {
  activeEffect = fn
  fn() // 同步执行：期间的所有 track 都登记到 fn
  activeEffect = null
}

/** 对象 → 属性 → 副作用集合（WeakMap 不阻止目标对象被 GC） */
const targetMap = new WeakMap<object, Map<string | symbol, Set<EffectFn>>>()

const triggerCount = ref(0)

/** 依赖收集：把「当前副作用」登记到 target[key] 的集合里 */
function track(target: object, key: string | symbol) {
  if (!activeEffect) return // 事件回调/异步里的读取无人收集
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  dep.add(activeEffect) // Set 天然去重：同一个 effect 多次读只登记一次
}

/** 派发更新：把 target[key] 的依赖全部重跑一遍 */
function trigger(target: object, key: string | symbol) {
  const dep = targetMap.get(target)?.get(key)
  if (!dep || dep.size === 0) return
  triggerCount.value++
  // 复制一份再遍历：副作用执行时可能新增/清理依赖，避免集合遍历中变化
  ;[...dep].forEach((fn) => fn())
}

/** reactive：读时收集、写时派发的 Proxy */
function reactive<T extends object>(obj: T): T {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver)
      if (oldValue === value) return true // 值没变：不派发
      const ok = Reflect.set(target, key, value, receiver)
      trigger(target, key)
      return ok
    },
  }) as T
}

interface MiniRef<T> {
  value: T
}

/** ref：闭包里持有一个 dep Set，value 即唯一的「key」 */
function refImpl<T>(initial: T): MiniRef<T> {
  let _value = initial
  const dep = new Set<EffectFn>()
  return {
    get value() {
      if (activeEffect) dep.add(activeEffect)
      return _value
    },
    set value(v: T) {
      if (v === _value) return // 相同值不派发，避免无效更新
      _value = v
      triggerCount.value++
      ;[...dep].forEach((fn) => fn())
    },
  }
}

/** computed：拉取式缓存。无人读不算；上游变了只标脏 */
function computedImpl<T>(getter: () => T): MiniRef<T> {
  let cached!: T
  let dirty = true
  // 依赖「这个 computed」的下游 effect 集合
  const dep = new Set<EffectFn>()
  // 作为 computed 自己的副作用挂到上游：上游一变，只标脏 + 通知下游
  const markDirty = () => {
    if (!dirty) {
      dirty = true
      ;[...dep].forEach((fn) => fn())
    }
  }
  return {
    get value() {
      if (activeEffect) dep.add(activeEffect) // 下游 effect 登记
      if (dirty) {
        // 重算期间要把「依赖收集者」临时换成 markDirty；
        // 保存外层 effect，算完恢复 —— 这是真实实现「effect 栈」的简化版
        const outer = activeEffect
        activeEffect = markDirty
        cached = getter()
        activeEffect = outer
        dirty = false
        computedEvals.value++
      }
      return cached
    },
  }
}

/* ─────────────────────────── 演示状态 ─────────────────────────── */

const computedEvals = ref(0)

// ① reactive 商品
const product = reactive({ price: 10, quantity: 2, tag: '新品' })
const totalView = ref(product.price * product.quantity)
const totalRuns = ref(0)
effect(() => {
  // 读取了 price 与 quantity：两者任一变化才重跑；tag 不在依赖里
  totalView.value = product.price * product.quantity
  totalRuns.value++
})

// ② ref
const n = refImpl(0)
const doubleView = ref(0)
const doubleRuns = ref(0)
effect(() => {
  doubleView.value = n.value * 2
  doubleRuns.value++
})

// ③ computed
const first = refImpl('诸葛')
const last = refImpl('亮')
const fullName = computedImpl(() => \`\${first.value}·\${last.value}\`)
const nameView = ref(fullName.value)
const nameRuns = ref(0)
effect(() => {
  nameView.value = fullName.value
  nameRuns.value++
})

/* ─────────────────────────── 操作与日志 ─────────────────────────── */

const logs = ref<string[]>([])
function log(msg: string) {
  logs.value.unshift(\`[\${new Date().toLocaleTimeString('zh-CN', { hour12: false })}] \${msg}\`)
  if (logs.value.length > 10) logs.value.pop()
}

function bumpPrice() {
  product.price += 10
  log(\`price → \${product.price}\`)
}
function bumpQty() {
  product.quantity += 1
  log(\`quantity → \${product.quantity}\`)
}
function changeTag() {
  product.tag = product.tag === '新品' ? '促销' : '新品'
  log(\`改 tag → \${product.tag}（无 effect 依赖它，运行次数不变）\`)
}
function bumpN() {
  n.value += 1
}
function changeLast() {
  last.value = last.value === '亮' ? '孔明' : '亮'
}
function readCached() {
  const v = fullName.value
  log(\`effect 外读取：\${v}（干净时不求值）\`)
}
<\/script>

<template>
  <section class="lab">
    <h2>🔬 mini 响应式内核</h2>

    <!-- ① reactive -->
    <div class="card">
      <h3>① reactive（Proxy + 字段级依赖）</h3>
      <p>单价 {{ product.price }} × 数量 {{ product.quantity }} = <strong>{{ totalView }}</strong></p>
      <div class="row">
        <button @click="bumpPrice">price +10</button>
        <button @click="bumpQty">quantity +1</button>
        <button @click="changeTag">改无关字段 tag</button>
      </div>
      <p class="muted">总价 effect 运行次数：<strong>{{ totalRuns }}</strong>（改 tag 不增加，依赖精确到字段）</p>
    </div>

    <!-- ② ref -->
    <div class="card">
      <h3>② refImpl（闭包 dep）</h3>
      <p>n = {{ n.value }}，effect 里的 2×n = <strong>{{ doubleView }}</strong></p>
      <button @click="bumpN">n +1</button>
      <p class="muted">double effect 运行次数：<strong>{{ doubleRuns }}</strong></p>
    </div>

    <!-- ③ computed -->
    <div class="card">
      <h3>③ computedImpl（lazy + dirty）</h3>
      <p>effect 中的全名：<strong>{{ nameView }}</strong></p>
      <div class="row">
        <button @click="changeLast">改姓/名（只标脏，读取才重算）</button>
        <button @click="readCached">effect 外读取一次</button>
      </div>
      <p class="muted">
        全名 effect 运行 <strong>{{ nameRuns }}</strong> 次；computed 求值
        <strong>{{ computedEvals }}</strong> 次（连续干净读取不再求值）
      </p>
    </div>

    <!-- 统计 -->
    <div class="card stat">
      <h3>派发统计与操作日志</h3>
      <p>trigger 总次数：<strong>{{ triggerCount }}</strong></p>
      <ul class="mini-log">
        <li v-for="(l, i) in logs" :key="i">{{ l }}</li>
        <li v-if="logs.length === 0" class="muted">点上面的按钮，观察各 effect 的精确重跑</li>
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
.card {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 14px;
  display: grid;
  gap: 10px;
}
.card h3 {
  margin: 0;
  font-size: 14px;
}
.card p {
  margin: 0;
  font-size: 13px;
}
.row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
strong {
  font-variant-numeric: tabular-nums;
  color: #33a06f;
}
.muted {
  font-size: 12px;
  color: #8fa0ab;
}
.mini-log {
  margin: 0;
  padding-left: 18px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
  color: #55636d;
}
</style>
`,k=JSON.parse('{"title":"15 手写响应式原理","description":"约 60 行从零实现响应式：三层依赖表、Proxy 拦截、ref 闭包 dep、computed 的 dirty 缓存，理解 Vue 响应式内核。","frontmatter":{"title":"15 手写响应式原理","description":"约 60 行从零实现响应式：三层依赖表、Proxy 拦截、ref 闭包 dep、computed 的 dirty 缓存，理解 Vue 响应式内核。","tags":["响应式原理","Proxy","track/trigger","computed"]},"headers":[],"relativePath":"features/15-reactivity-internals.md","filePath":"features/15-reactivity-internals.md","lastUpdated":1792665939000}'),f={name:"features/15-reactivity-internals.md"},m=Object.assign(f,{setup(g){const a={"App.vue":d},i={"App.vue":u};return(h,e)=>{const r=s("Playground");return c(),l("div",null,[e[0]||(e[0]=n("h1",{id:"手写响应式原理",tabindex:"-1"},[t("手写响应式原理 "),n("a",{class:"header-anchor",href:"#手写响应式原理","aria-label":'Permalink to "手写响应式原理"'},"​")],-1)),e[1]||(e[1]=n("blockquote",null,[n("p",null,[n("strong",null,"mini reactivity · effect/track/trigger · Proxy · lazy computed"),t(" · 难度：高级 · 引入版本：Vue 3.0 机制 / 3.5 内核重构")])],-1)),e[2]||(e[2]=n("div",{class:"feature-summary"},"约 60 行从零实现响应式：三层依赖表、Proxy 拦截、ref 闭包 dep、computed 的 dirty 缓存，理解 Vue 响应式内核。",-1)),o(r,{starter:a,solution:i}),e[3]||(e[3]=p(`<hr><h1 id="手写响应式原理-mini-reactivity" tabindex="-1">手写响应式原理（mini reactivity） <a class="header-anchor" href="#手写响应式原理-mini-reactivity" aria-label="Permalink to &quot;手写响应式原理（mini reactivity）&quot;">​</a></h1><p>特性 02 教的是<strong>怎么用</strong> shallowRef / customRef / effectScope，这一章把 Vue 响应式系统<strong>亲手写一遍</strong>（约 60 行），建立心智模型：为什么改数据 视图会更新、computed 为什么是「懒」的、依赖为什么能精确到字段。</p><h2 id="三个核心概念" tabindex="-1">三个核心概念 <a class="header-anchor" href="#三个核心概念" aria-label="Permalink to &quot;三个核心概念&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>effect（副作用）  ──读数据时──▶  track（依赖收集）：把当前 effect 登记到「数据→属性」表里</span></span>
<span class="line"><span>数据被修改        ──▶ trigger（派发更新）：从表里找出登记过的 effect，重新执行</span></span></code></pre></div><ol><li><strong>effect(fn)</strong>：注册一个副作用，立即执行一次。执行期间它是 「当前活跃副作用」（全局变量 <code>activeEffect</code>）。</li><li><strong>track(target, key)</strong>：数据被读取时调用，把 <code>activeEffect</code> 记到 <code>targetMap</code> 中对应对象、对应属性的依赖集合里。</li><li><strong>trigger(target, key)</strong>：数据被写入时调用，把该属性依赖集合里的 effect 全部重新执行一遍。</li></ol><h2 id="数据结构-三层嵌套" tabindex="-1">数据结构：三层嵌套 <a class="header-anchor" href="#数据结构-三层嵌套" aria-label="Permalink to &quot;数据结构：三层嵌套&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>targetMap: WeakMap&lt;目标对象, Map&lt;属性名, Set&lt;副作用函数&gt;&gt;&gt;</span></span></code></pre></div><ul><li>外层 <code>WeakMap</code>：对象被回收时，它的依赖记录自动消失（不阻止 GC）；</li><li>中层 <code>Map</code>：一个对象的每个 key 一条依赖；</li><li>内层 <code>Set</code>：一个 key 可被多个 effect 依赖，天然去重。</li></ul><p>这就是「依赖精确到字段」的秘密：改 <code>state.a</code> 只会触发依赖了 <code>a</code> 的 effect，读 <code>state.b</code> 不会被牵连。</p><h2 id="reactive-proxy-拦截-get-set" tabindex="-1">reactive：Proxy 拦截 get/set <a class="header-anchor" href="#reactive-proxy-拦截-get-set" aria-label="Permalink to &quot;reactive：Proxy 拦截 get/set&quot;">​</a></h2><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Proxy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(obj, {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">target</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">key</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">receiver</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    track</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(target, key)        </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 读 → 收集</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Reflect.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(target, key, receiver)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  set</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">target</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">key</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">value</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">receiver</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> ok</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Reflect.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">set</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(target, key, value, receiver)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    trigger</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(target, key)      </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 写 → 派发</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ok</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><p>Vue 2 的 <code>Object.defineProperty</code> 只能拦截「已知属性」，所以数组下标、 新增属性需要 <code>$set</code>；Proxy 代理整个对象，新增属性 / 下标赋值天然可拦截。</p><h2 id="ref-每个实例一个-dep-集合" tabindex="-1">ref：每个实例一个 dep 集合 <a class="header-anchor" href="#ref-每个实例一个-dep-集合" aria-label="Permalink to &quot;ref：每个实例一个 dep 集合&quot;">​</a></h2><p>ref 没有 key 结构，本质是个带 getter/setter 的对象，闭包里持有 一个 <code>Set</code>：get 时把 activeEffect 加进去，set 时值变了就派发。</p><h2 id="computed-lazy-dirty-缓存" tabindex="-1">computed：lazy + dirty 缓存 <a class="header-anchor" href="#computed-lazy-dirty-缓存" aria-label="Permalink to &quot;computed：lazy + dirty 缓存&quot;">​</a></h2><p>computed <strong>不立刻求值</strong>，内部维护 <code>dirty</code> 标志：</p><ul><li>被读取且 <code>dirty=true</code>：执行 getter 算一次，缓存结果，置 <code>dirty=false</code>；</li><li>被读取且 <code>dirty=false</code>：直接返回缓存（<strong>不重算</strong>）；</li><li>上游依赖变化时，一个内部 effect 只做一件事：把 <code>dirty</code> 重新置 true， 并通知「依赖了这个 computed 的下游 effect」。</li></ul><p>所以 computed 是**拉取式（pull-based）**的：没人读就不算；连续改十次 上游再读一次，也只在读取时算一次。</p><h2 id="与-vue-真实实现-vue-reactivity-的差距" tabindex="-1">与 Vue 真实实现（@vue/reactivity）的差距 <a class="header-anchor" href="#与-vue-真实实现-vue-reactivity-的差距" aria-label="Permalink to &quot;与 Vue 真实实现（@vue/reactivity）的差距&quot;">​</a></h2><p>本实现是教学简化版，生产级实现还多了：</p><ul><li><strong>effect 的依赖清理（dep cleanup）</strong>：分支读取（<code>a ? b : c</code>）后， 旧分支的依赖要能摘除，真实实现让每次重跑前清空再收集；</li><li><strong>scheduler 调度器</strong>：trigger 不直接跑 effect，而是推入任务队列去重， 在 nextTick 批量 flush —— 这是「多次改数据只渲染一次」的来源；</li><li><strong>嵌套 effect 栈</strong>：真实实现用栈管理 activeEffect，本练习只在 computed 里用「保存/恢复」简化处理；</li><li><strong>版本计数双向链表</strong>：Vue 3.5 重构依赖结构，内存降约 56%，深层数组 追踪最高快 10 倍（本练习的 Set 模型更好懂，但不是 3.5 的物理结构）。</li></ul><h2 id="动手试" tabindex="-1">动手试 <a class="header-anchor" href="#动手试" aria-label="Permalink to &quot;动手试&quot;">​</a></h2><p>起始代码是一份<strong>能跑但不工作</strong>的骨架：effect 注册正常，但 track/trigger、Proxy、ref、computed 全是空实现，所以点按钮界面不动。</p><ol><li><strong>TODO(1)</strong>：实现 <code>track</code> 与 <code>trigger</code>（三层表的存取）；</li><li><strong>TODO(2)</strong>：补全 <code>reactive</code> 的 Proxy get/set；</li><li><strong>TODO(3)</strong>：补全 <code>refImpl</code>（get 收集、set 值变化时派发）；</li><li><strong>TODO(4)</strong>：补全 <code>computedImpl</code>（dirty 缓存 + 上游标脏 + 恢复外层 activeEffect）。</li></ol><p>完成后用面板验证：改商品价格只有总价 effect 重跑；读 computed 第二次 不增加求值次数；改依赖后「缓存读取」仍返回旧值直到再读取。</p><h2 id="常见坑-真实踩坑记录" tabindex="-1">常见坑（真实踩坑记录） <a class="header-anchor" href="#常见坑-真实踩坑记录" aria-label="Permalink to &quot;常见坑（真实踩坑记录）&quot;">​</a></h2><ul><li><strong>track 时 activeEffect 是 null</strong>：依赖收集只在 effect 同步执行期间 发生；在 setTimeout/Promise 回调里读数据不会被收集（真实 Vue 同理， watch 的 getter 只在同步阶段建立依赖）。</li><li><strong>trigger 时直接用新数组替换 dep</strong>：遍历过程中派发可能引起集合变化， 要遍历快照或用稳定迭代（本练习 Set.forEach 期间不修改集合，安全）。</li><li><strong>computed 重算时没恢复外层 activeEffect</strong>：getter 跑完后外层 effect 丢了，之后的 track 全部登记错对象。进入 computed 前保存、出来后恢复。</li><li><strong>ref 的 set 不做值比较</strong>：赋相同的值也派发，造成死循环式更新； 先判断 <code>v === _value</code>。</li><li><strong>把 targetMap 设计成普通对象</strong>：键只能是字符串且阻止目标对象被 GC； 以对象为键的表必须用 Map/WeakMap。</li></ul><hr><h2 id="源码参考" tabindex="-1">源码参考 <a class="header-anchor" href="#源码参考" aria-label="Permalink to &quot;源码参考&quot;">​</a></h2><ul><li>特性目录：<a href="https://github.com/YZhiJie/vue3-features-lab/tree/main/src/features/15-reactivity-internals" target="_blank" rel="noreferrer"><code>src/features/15-reactivity-internals/</code></a></li></ul>`,31))])}}});export{k as __pageData,m as default};
