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
`,b=JSON.parse('{"title":"03 script setup 与组件通信","description":"父子组件三类通信一次讲透：类型化 props、元组语法 emit、defineExpose + 模板 ref 调用子组件方法。","frontmatter":{"title":"03 script setup 与组件通信","description":"父子组件三类通信一次讲透：类型化 props、元组语法 emit、defineExpose + 模板 ref 调用子组件方法。","tags":["defineProps","defineEmits","defineExpose","withDefaults"]},"headers":[],"relativePath":"features/03-script-setup.md","filePath":"features/03-script-setup.md","lastUpdated":1792665939000}'),g={name:"features/03-script-setup.md"},y=Object.assign(g,{setup(f){const i={"App.vue":h,"Child.vue":c},t={"App.vue":k,"Child.vue":u};return(E,n)=>{const a=l("Playground");return p(),o("div",null,[n[0]||(n[0]=s("h1",{id:"script-setup-与组件通信",tabindex:"-1"},[e("script setup 与组件通信 "),s("a",{class:"header-anchor",href:"#script-setup-与组件通信","aria-label":'Permalink to "script setup 与组件通信"'},"​")],-1)),n[1]||(n[1]=s("blockquote",null,[s("p",null,[s("strong",null,"defineProps / defineEmits / defineExpose"),e(" · 难度：入门 · 引入版本：Vue 3.2")])],-1)),n[2]||(n[2]=s("div",{class:"feature-summary"},"父子组件三类通信一次讲透：类型化 props、元组语法 emit、defineExpose + 模板 ref 调用子组件方法。",-1)),r(a,{starter:i,solution:t}),n[3]||(n[3]=d("",25))])}}});export{b as __pageData,y as default};
