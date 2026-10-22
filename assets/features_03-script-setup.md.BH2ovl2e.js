import{C as l,o as p,c as o,j as s,a as e,E as r,a2 as d}from"./chunks/framework.CE7vFz40.js";const h=`<script setup lang="ts">
/**
 * 练习：script setup 与组件通信 —— 父组件侧（App.vue）
 *
 * 子组件 Child.vue 已经写好（它演示了 defineProps / defineEmits / defineExpose
 * 的声明侧），你的任务在父组件这一侧，按 TODO 补全三类通信：
 *   TODO(1) 类型化监听子组件的 change / reset 事件
 *   TODO(2) 把 childRef 升级为子组件实例类型，与模板 ref="childRef" 对上
 *   TODO(3) 调用子组件 defineExpose 暴露的 double()，把结果显示出来
 *
 * 设计决策：
 * - starter 里 childRef / onChildChange / askDouble 都给了「能跑但没干活」的
 *   骨架：保证初始渲染零报错，TODO 补全后行为才生效（与金标准一致）；
 * - 事件日志用时间戳 + 文案，方便肉眼核对事件顺序。
 *
 * 坑点提醒：
 * - <script setup> 子组件默认封闭：Child 里没 defineExpose 的成员，这里拿不到；
 * - 模板 ref 的变量名要与模板里 ref="..." 字符串一致（本章用旧写法，
 *   Vue 3.5 的 useTemplateRef 写法见第 4 章）。
 */
import { ref } from 'vue'
import Child from './Child.vue'

/* ───────── 1) 类型化事件监听 ───────── */
// 事件日志：每次子组件 emit 都记一条（UI 已就绪，补全 onChildChange 即可）
const eventLog = ref<string[]>([])

// TODO(1): 子组件会 emit('change', value: number)。实现这个处理器：
//   往 eventLog 里 push 一条 \`change → \${value}\`，用 Date.now() 加个时间戳更像日志
function onChildChange(value: number) {
  // 留空：补全我
}

// reset 事件无 payload，这里给个能跑的最简实现（也可以自己往日志里加一条）
function onChildReset() {
  eventLog.value.push('reset → 已归零')
}

/* ───────── 2) 模板 ref 拿子组件实例 ───────── */
// TODO(2): 现在它只是个手写的结构类型。升级为组件实例类型更省心：
//   const childRef = ref<InstanceType<typeof Child> | null>(null)
//   （变量名必须与模板里的 ref="childRef" 一致，这是旧写法的隐式约定）
const childRef = ref<{ double(): number } | null>(null)

/* ───────── 3) 调用子组件暴露的方法 ───────── */
const doubled = ref<number | null>(null)

// TODO(3): 实现 askDouble：调用 childRef.value 暴露的 double()，
//   结果写进 doubled。注意可选链：子组件可能还没挂载（value 是 null）。
function askDouble() {
  // 留空：补全我
}

function clearLog() {
  eventLog.value = []
}
<\/script>

<template>
  <section class="comm">
    <h2>📞 script setup 与组件通信</h2>

    <!-- 子组件已完整：props 类型 + 默认值、类型化 emit、defineExpose 都在里面 -->
    <Child
      ref="childRef"
      title="父组件传来的标题（prop）"
      :step="2"
      @change="onChildChange"
      @reset="onChildReset"
    />

    <div class="panel">
      <button @click="askDouble">问子组件要双倍分值</button>
      <p>
        double() 返回：
        <strong>{{ doubled === null ? '（点上面的按钮试试）' : doubled }}</strong>
      </p>
    </div>

    <div class="panel">
      <h3>事件日志（子组件 emit → 父组件处理）</h3>
      <p v-if="eventLog.length === 0" class="empty">还没有事件，操作上面的子组件试试。</p>
      <ul v-else>
        <li v-for="(line, i) in eventLog.slice().reverse()" :key="i">{{ line }}</li>
      </ul>
      <button @click="clearLog">清空日志</button>
    </div>
  </section>
</template>

<style scoped>
.comm {
  max-width: 380px;
  margin: 24px auto;
  padding: 20px;
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  display: grid;
  gap: 14px;
  font-family: sans-serif;
}
.comm h2 {
  margin: 0;
  font-size: 17px;
}
.panel {
  border: 1px solid #eef2f4;
  border-radius: 8px;
  padding: 10px 14px;
  display: grid;
  gap: 8px;
}
.panel h3 {
  margin: 0;
  font-size: 14px;
  color: #61707a;
}
.panel button {
  justify-self: start;
  padding: 5px 12px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
}
.panel button:hover {
  border-color: #42b883;
  color: #33a06f;
}
.panel ul {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  color: #4a5a64;
}
.empty {
  margin: 0;
  color: #8fa0ab;
  font-size: 12px;
}
</style>
`,c=`<script setup lang="ts">
/**
 * 子组件：打分器 —— 演示 script setup 三大通信 API 的「声明侧」（本文件是完整参考实现）
 *
 * 设计决策：
 * - props 用类型语法 + withDefaults：类型、必填性、默认值一处搞定，
 *   运行时还会生成 props 校验（开发环境传错类型会有警告）；
 * - emits 用 Vue 3.3+ 的「元组语法」：\`change: [value: number]\` 等价于
 *   3.2 的 \`(e: 'change', value: number) => void\` 函数签名写法，更短更好读；
 * - defineExpose 只暴露必要成员：<script setup> 组件默认对外「封闭」，
 *   父组件通过模板 ref 拿到的是空壳，除非显式 expose（对应 App.vue 的 TODO(2)(3)）。
 *
 * 坑点提醒：
 * - 编译器宏（defineProps / defineEmits / defineExpose / withDefaults）无需 import，
 *   写了 import 反而会编译报错；
 * - props 是单向数据流：子组件想改数值只能改自己的 count 再 emit 出去，
 *   直接改 props 不但无效，开发环境还会警告。
 */
import { ref } from 'vue'

// 类型语法 + withDefaults：可选 prop 的类型与默认值一起声明
const props = withDefaults(
  defineProps<{
    title?: string
    step?: number
    max?: number
  }>(),
  {
    title: '子组件打分器',
    step: 1,
    max: 10,
  },
)

// 元组语法类型化事件：父组件监听 @change / @reset 时获得完整的类型提示
const emit = defineEmits<{
  change: [value: number]
  reset: []
}>()

const count = ref(0)

function add(delta: number) {
  const next = Math.min(props.max, Math.max(0, count.value + delta))
  count.value = next
  emit('change', next) // 事件名与 payload 类型都受 defineEmits 约束
}

function reset() {
  count.value = 0
  emit('reset')
}

// double 会被父组件通过模板 ref 调用（见下面的 defineExpose）
function double(): number {
  return count.value * 2
}

// defineExpose：把内部成员交给父组件的模板 ref（不加这行，父组件拿到的实例是空壳）
defineExpose({ count, double, reset })
<\/script>

<template>
  <div class="scorer">
    <h3>{{ title }}</h3>
    <p>当前分值：<strong>{{ count }}</strong> / {{ max }}</p>
    <div class="row">
      <button @click="add(-step)">-{{ step }}</button>
      <button @click="add(step)">+{{ step }}</button>
      <button @click="reset">归零</button>
    </div>
  </div>
</template>

<style scoped>
.scorer {
  border: 1px dashed #b9c6ce;
  border-radius: 10px;
  padding: 14px 16px;
  display: grid;
  gap: 10px;
  font-family: sans-serif;
}
.scorer h3 {
  margin: 0;
  font-size: 15px;
}
.scorer p {
  margin: 0;
}
.scorer .row {
  display: flex;
  gap: 8px;
}
.scorer button {
  padding: 4px 12px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
}
.scorer button:hover {
  border-color: #42b883;
  color: #33a06f;
}
</style>
`,k=`<script setup lang="ts">
/**
 * 参考答案：script setup 与组件通信 —— 父组件侧
 *
 * 相比练习版补充了：
 * 1. onChildChange 完整实现（带时间戳的类型化事件处理）
 * 2. childRef 用 InstanceType<typeof Child> 拿到完整实例类型
 * 3. askDouble 通过可选链调用子组件 defineExpose 暴露的 double()
 * 4. 加分演示：调用 solution 版 Child 额外暴露的 setScore(n) 直接设定分值
 *
 * 为什么这么写：
 * - InstanceType<typeof Child>：子组件用 defineExpose 暴露了什么，这里就能
 *   点出什么（count / double / reset），改 Child 的 expose 时这边的类型自动跟随；
 * - 调用暴露方法一律 ?.：挂载前 childRef.value 是 null，子组件被 v-if 控制
 *   卸载后也会变回 null，直接点调用会在真实项目里炸；
 * - 事件日志统一走 addLog：时间戳取一次 Date.now()，避免多条日志同帧时序错乱。
 */
import { ref } from "vue";
import Child from "./Child.vue";

/* ───────── 1) 类型化事件监听 ───────── */
const eventLog = ref<string[]>([]);

function addLog(line: string) {
  const time = new Date().toLocaleTimeString();
  eventLog.value.push(\`[\${time}] \${line}\`);
}

// value 的 number 类型来自子组件 defineEmits 的元组声明，传错会在 IDE 里标红
function onChildChange(value: number) {
  addLog(\`change → \${value}\`);
}

function onChildReset() {
  addLog("reset → 已归零");
}

/* ───────── 2) 模板 ref 拿子组件实例 ───────── */
// 与模板里 ref="childRef" 同名关联；类型来自 Child 的 defineExpose
const childRef = ref<InstanceType<typeof Child> | null>(null);

/* ───────── 3) 调用子组件暴露的方法 ───────── */
const doubled = ref<number | null>(null);

function askDouble() {
  // 可选链防 null：子组件还没挂载时什么都不做，而不是抛错
  const result = childRef.value?.double();
  doubled.value = result ?? null;
}

/* ───────── 4) 加分演示：调用 setScore 直接设定分值 ───────── */
// setScore 只存在于 solution 版 Child.vue 的 defineExpose 里 ——
// 暴露面越大 = 父子耦合越大，按需取舍
function setToEight() {
  childRef.value?.setScore(8);
}

function clearLog() {
  eventLog.value = [];
}
<\/script>

<template>
  <section class="comm">
    <h2>📞 script setup 与组件通信</h2>

    <Child
      ref="childRef"
      title="父组件传来的标题（prop）"
      :step="2"
      @change="onChildChange"
      @reset="onChildReset"
    />

    <div class="panel">
      <button @click="askDouble">问子组件要双倍分值</button>
      <button @click="setToEight">直接把分值设为 8（加分）</button>
      <p>
        double() 返回：
        <strong>{{ doubled === null ? '（点上面的按钮试试）' : doubled }}</strong>
      </p>
    </div>

    <div class="panel">
      <h3>事件日志（子组件 emit → 父组件处理）</h3>
      <p v-if="eventLog.length === 0" class="empty">还没有事件，操作上面的子组件试试。</p>
      <ul v-else>
        <li v-for="(line, i) in eventLog.slice().reverse()" :key="i">{{ line }}</li>
      </ul>
      <button @click="clearLog">清空日志</button>
    </div>
  </section>
</template>

<style scoped>
.comm {
  max-width: 380px;
  margin: 24px auto;
  padding: 20px;
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  display: grid;
  gap: 14px;
  font-family: sans-serif;
}
.comm h2 {
  margin: 0;
  font-size: 17px;
}
.panel {
  border: 1px solid #eef2f4;
  border-radius: 8px;
  padding: 10px 14px;
  display: grid;
  gap: 8px;
}
.panel h3 {
  margin: 0;
  font-size: 14px;
  color: #61707a;
}
.panel button {
  justify-self: start;
  padding: 5px 12px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
}
.panel button:hover {
  border-color: #42b883;
  color: #33a06f;
}
.panel p {
  margin: 0;
}
.panel ul {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  color: #4a5a64;
}
.empty {
  margin: 0;
  color: #8fa0ab;
  font-size: 12px;
}
</style>
`,u=`<script setup lang="ts">
/**
 * 子组件：打分器 —— 声明侧参考答案版
 *
 * 相比 starter 版补充了 setScore：一个「父组件直接指挥子组件内部状态」的
 * 额外暴露方法，供 App.vue 的加分演示调用。
 *
 * 为什么这么写：
 * - defineExpose 暴露面越大，父子耦合越大：starter 版只暴露 count / double / reset
 *   三个必要成员；setScore 属于「明确需要父组件控制」时才加的能力；
 * - setScore 同样走 emit('change') 通知父组件：无论分值从哪个入口改，
 *   父组件都能通过同一个事件感知，数据流依然单向可追踪。
 *
 * 坑点提醒：
 * - 编译器宏（defineProps / defineEmits / defineExpose / withDefaults）无需 import；
 * - props 单向数据流：改数值改的是本地 count，永远不直接改 props。
 */
import { ref } from "vue";

// 类型语法 + withDefaults：可选 prop 的类型与默认值一起声明
const props = withDefaults(
  defineProps<{
    title?: string;
    step?: number;
    max?: number;
  }>(),
  {
    title: "子组件打分器",
    step: 1,
    max: 10,
  },
);

// 元组语法类型化事件：父组件监听 @change / @reset 时获得完整的类型提示
const emit = defineEmits<{
  change: [value: number];
  reset: [];
}>();

const count = ref(0);

function add(delta: number) {
  const next = Math.min(props.max, Math.max(0, count.value + delta));
  count.value = next;
  emit("change", next);
}

function reset() {
  count.value = 0;
  emit("reset");
}

function double(): number {
  return count.value * 2;
}

// 参考答案新增：父组件通过模板 ref 直接设定分值（暴露面更大 = 耦合更大，按需取舍）
function setScore(n: number) {
  count.value = Math.min(props.max, Math.max(0, n));
  emit("change", count.value); // 无论从哪个入口改，父组件都通过同一个事件感知
}

// defineExpose：把内部成员交给父组件的模板 ref（不加这行，父组件拿到的是空壳）
defineExpose({ count, double, reset, setScore });
<\/script>

<template>
  <div class="scorer">
    <h3>{{ title }}</h3>
    <p>当前分值：<strong>{{ count }}</strong> / {{ max }}</p>
    <div class="row">
      <button @click="add(-step)">-{{ step }}</button>
      <button @click="add(step)">+{{ step }}</button>
      <button @click="reset">归零</button>
    </div>
  </div>
</template>

<style scoped>
.scorer {
  border: 1px dashed #b9c6ce;
  border-radius: 10px;
  padding: 14px 16px;
  display: grid;
  gap: 10px;
  font-family: sans-serif;
}
.scorer h3 {
  margin: 0;
  font-size: 15px;
}
.scorer p {
  margin: 0;
}
.scorer .row {
  display: flex;
  gap: 8px;
}
.scorer button {
  padding: 4px 12px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
}
.scorer button:hover {
  border-color: #42b883;
  color: #33a06f;
}
</style>
`,b=JSON.parse('{"title":"03 script setup 与组件通信","description":"父子组件三类通信一次讲透：类型化 props、元组语法 emit、defineExpose + 模板 ref 调用子组件方法。","frontmatter":{"title":"03 script setup 与组件通信","description":"父子组件三类通信一次讲透：类型化 props、元组语法 emit、defineExpose + 模板 ref 调用子组件方法。","tags":["defineProps","defineEmits","defineExpose","withDefaults"]},"headers":[],"relativePath":"features/03-script-setup.md","filePath":"features/03-script-setup.md","lastUpdated":1792665939000}'),g={name:"features/03-script-setup.md"},y=Object.assign(g,{setup(f){const i={"App.vue":h,"Child.vue":c},t={"App.vue":k,"Child.vue":u};return(E,n)=>{const a=l("Playground");return p(),o("div",null,[n[0]||(n[0]=s("h1",{id:"script-setup-与组件通信",tabindex:"-1"},[e("script setup 与组件通信 "),s("a",{class:"header-anchor",href:"#script-setup-与组件通信","aria-label":'Permalink to "script setup 与组件通信"'},"​")],-1)),n[1]||(n[1]=s("blockquote",null,[s("p",null,[s("strong",null,"defineProps / defineEmits / defineExpose"),e(" · 难度：入门 · 引入版本：Vue 3.2")])],-1)),n[2]||(n[2]=s("div",{class:"feature-summary"},"父子组件三类通信一次讲透：类型化 props、元组语法 emit、defineExpose + 模板 ref 调用子组件方法。",-1)),r(a,{starter:i,solution:t}),n[3]||(n[3]=d(`<hr><h1 id="script-setup-与组件通信-1" tabindex="-1">script setup 与组件通信 <a class="header-anchor" href="#script-setup-与组件通信-1" aria-label="Permalink to &quot;script setup 与组件通信&quot;">​</a></h1><h2 id="这是什么" tabindex="-1">这是什么 <a class="header-anchor" href="#这是什么" aria-label="Permalink to &quot;这是什么&quot;">​</a></h2><p><code>&lt;script setup&gt;</code> 不只是更短的模板语法，它同时改变了组件的「边界规则」：</p><ul><li>声明式三件套由<strong>编译器宏</strong>提供：<code>defineProps</code>（接输入）、<code>defineEmits</code>（发出事件）、<code>defineExpose</code>（开门放行）；</li><li><strong>默认封闭</strong>：<code>&lt;script setup&gt;</code> 组件的实例默认对外不可见，父组件用模板 ref 拿到的是空壳——除非子组件显式 <code>defineExpose</code>；</li><li>宏无需 import：它们是编译期的特殊标识符，写 <code>import { defineProps } from &#39;vue&#39;</code> 反而会编译报错。</li></ul><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setup</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 三件套都不需要 import，直接使用</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> props</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> defineProps</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;{ </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">title</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }&gt;()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> emit</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> defineEmits</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;{ </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">change</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">value</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">number</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] }&gt;()</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">defineExpose</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({ </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">someMethod</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {} })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><p>本章的多文件演示里：<code>Child.vue</code>（打分器）是一份完整的参考实现（声明侧），你在 <code>App.vue</code>（消费侧）把三类通信串起来。</p><h2 id="核心-api-速览" tabindex="-1">核心 API 速览 <a class="header-anchor" href="#核心-api-速览" aria-label="Permalink to &quot;核心 API 速览&quot;">​</a></h2><table tabindex="0"><thead><tr><th>API</th><th>用途</th><th>关键点</th></tr></thead><tbody><tr><td><code>defineProps&lt;T&gt;()</code></td><td>声明输入</td><td>类型语法 / 对象语法二选一；运行时自动生成校验</td></tr><tr><td><code>withDefaults(p, d)</code></td><td>给可选 prop 补默认值</td><td>引用类型默认值必须用工厂函数：<code>() =&gt; []</code></td></tr><tr><td><code>defineEmits&lt;T&gt;()</code></td><td>声明事件</td><td>3.3+ 元组语法 <code>change: [value: number]</code>；返回 emit 函数</td></tr><tr><td><code>defineExpose(obj)</code></td><td>指定模板 ref 可见的成员</td><td>不 expose，父组件拿到的是空壳实例</td></tr><tr><td><code>ref=&quot;xxx&quot;</code></td><td>父组件拿子组件实例</td><td>变量名与字符串一致（3.5 的 useTemplateRef 见第 4 章）</td></tr></tbody></table><h2 id="动手试" tabindex="-1">动手试 <a class="header-anchor" href="#动手试" aria-label="Permalink to &quot;动手试&quot;">​</a></h2><p><code>Child.vue</code> 已完整给出并演示了声明侧三件套，请在 <code>App.vue</code> 按 TODO 补全消费侧：</p><ol><li>TODO(1)：实现类型化事件处理 <code>onChildChange(value: number)</code>，把事件追加进日志</li><li>TODO(2)：把 <code>childRef</code> 升级为 <code>InstanceType&lt;typeof Child&gt;</code> 类型，与模板 <code>ref=&quot;childRef&quot;</code> 对上</li><li>TODO(3)：实现 <code>askDouble()</code>，通过可选链调用子组件 <code>defineExpose</code> 暴露的 <code>double()</code></li><li>参考答案还演示了：调用 solution 版子组件额外暴露的 <code>setScore(n)</code> 直接设定分值</li></ol><h2 id="props-的两种声明姿势" tabindex="-1">props 的两种声明姿势 <a class="header-anchor" href="#props-的两种声明姿势" aria-label="Permalink to &quot;props 的两种声明姿势&quot;">​</a></h2><p>类型语法（推荐，纯 TS）与对象语法（运行时校验选项更丰富）二选一：</p><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setup</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 姿势一：类型语法 + withDefaults（本章 Child.vue 的写法）</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> props</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> withDefaults</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  defineProps</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;{ </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">title</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">tags</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[] }&gt;(),</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 引用类型的默认值必须是工厂函数，避免多实例共享同一数组</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  { title: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;默认标题&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">tags</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [] },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 姿势二：对象语法（Vue 2 风格，可加 validator 等校验）</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> props2</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> defineProps</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  title: { type: String, default: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;默认标题&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  level: { type: Number, </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">validator</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">v</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> number</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> v </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><p>emits 同样有两种姿势：3.2 的函数签名 <code>defineEmits&lt;{ (e: &#39;change&#39;, v: number): void }&gt;()</code>，与 3.3+ 的元组语法 <code>defineEmits&lt;{ change: [v: number] }&gt;()</code>——本章用后者，更短更好读。</p><h2 id="defineexpose-到底暴露了什么" tabindex="-1">defineExpose 到底暴露了什么 <a class="header-anchor" href="#defineexpose-到底暴露了什么" aria-label="Permalink to &quot;defineExpose 到底暴露了什么&quot;">​</a></h2><p>父组件 <code>childRef.value</code> 上能访问的<strong>只有</strong> <code>defineExpose</code> 里列出的成员：</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Child.vue</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> count</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ref</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> double</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> count.value </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">defineExpose</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({ count, double }) </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 只暴露这两个，其余内部状态对外不可见</span></span></code></pre></div><p>注意 <code>count</code> 暴露后在父组件里读 <code>childRef.value.count</code> 会<strong>自动解包</strong>成数值（exposed 对象上的 ref 会解包）——这也是「暴露方法比暴露裸状态更稳」的原因之一。</p><h2 id="常见坑-真实踩坑记录" tabindex="-1">常见坑（真实踩坑记录） <a class="header-anchor" href="#常见坑-真实踩坑记录" aria-label="Permalink to &quot;常见坑（真实踩坑记录）&quot;">​</a></h2><ul><li><strong>忘了 defineExpose</strong>：<code>&lt;script setup&gt;</code> 组件默认封闭，<code>childRef.value.double</code> 是 <code>undefined</code>，控制台只报「double is not a function」，不会提示你缺 expose。</li><li><strong>给宏写 import</strong>：<code>import { defineProps } from &#39;vue&#39;</code> 直接编译报错——它们是编译器宏，不是运行时函数。</li><li><strong>props 单向数据流</strong>：子组件直接改 <code>props.xxx</code> 无效且开发环境警告；正确姿势是维护本地状态 + emit 出去。</li><li><strong>withDefaults 的引用类型默认值</strong>：写 <code>default: []</code> 会在多个实例间共享同一个数组，要用工厂函数 <code>() =&gt; []</code>。</li><li><strong>emit 了没声明的事件</strong>：事件会作为原生 attribute 透传到子组件根元素上（fallthrough），触发奇怪的重复监听；声明过的 emit 才会被 Vue 正确剥离。</li><li><strong>模板 ref 时序</strong>：挂载前 <code>childRef.value</code> 是 null，调用方法必须 <code>?.</code>；子组件如果被 <code>v-if</code> 控制，卸载后 ref 也会变回 null。</li></ul><hr><h2 id="源码参考" tabindex="-1">源码参考 <a class="header-anchor" href="#源码参考" aria-label="Permalink to &quot;源码参考&quot;">​</a></h2><ul><li>特性目录：<a href="https://github.com/YZhiJie/vue3-features-lab/tree/main/src/features/03-script-setup" target="_blank" rel="noreferrer"><code>src/features/03-script-setup/</code></a></li></ul>`,25))])}}});export{b as __pageData,y as default};
