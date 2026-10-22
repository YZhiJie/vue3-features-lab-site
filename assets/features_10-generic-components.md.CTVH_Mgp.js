import{C as l,o as r,c as o,j as n,a as i,E as p,a2 as d}from"./chunks/framework.CE7vFz40.js";const c=`<script setup lang="ts">
/**
 * 练习：泛型组件 —— 父组件侧
 *
 * 练习版已实例化第一个列表（对象数组）。请按 TODO 补全：
 *   TODO(1) 在 SelectableList.vue 里完成泛型改造（any → T）
 *   TODO(2) 用 string 数组实例化第二个列表（tags / pickedTag 已备好）
 *   TODO(3) 完成后观察回调里的精确类型
 *
 * 坑点提醒：泛型组件只能靠 props 推导类型，模板里不能写
 * <SelectableList<Employee>>；所以 employees 的类型标注必须完整。
 */
import { ref } from 'vue'
import SelectableList from './SelectableList.vue'

interface Employee {
  id: number
  name: string
  role: string
}

// 类型标注完整的数组 —— 泛型推导稳定的前提
const employees = ref<Employee[]>([
  { id: 1, name: '小明', role: '前端工程师' },
  { id: 2, name: '小红', role: '产品经理' },
  { id: 3, name: '老王', role: '测试工程师' },
])
// 选中值类型写死为 Employee | null —— 泛型改造完成后这里不需要动
const pickedEmployee = ref<Employee | null>(null)

/* TODO(2): string 列表的数据已备好，在下方模板里实例化第二个 <SelectableList> */
const tags = ref<string[]>(['Vue 3.5', 'TypeScript', 'Pinia', 'Vite'])
const pickedTag = ref<string | null>(null)

/**
 * TODO(3): 把 pickedEmployee 直接交给它 —— 泛型生效后无需任何类型断言，
 *          参数类型就是 Employee（any 版本里这里拿到的是 any）
 */
function describeEmployee(employee: Employee): string {
  return \`\${employee.name}（\${employee.role}）· 工号 \${employee.id}\`
}
<\/script>

<template>
  <section class="generic-lab">
    <h2>🧬 泛型组件</h2>

    <div class="panels">
      <div>
        <h3>对象数组：Employee[]</h3>
        <SelectableList
          v-model="pickedEmployee"
          :items="employees"
          :label="(item) => item.name + '（' + item.role + '）'"
        />
        <p class="result">
          选中：{{ pickedEmployee ? describeEmployee(pickedEmployee) : '（未选择）' }}
        </p>
      </div>

      <div>
        <h3>string 数组（TODO(2)）</h3>
        <!-- TODO(2): 在这里实例化第二个 <SelectableList>，绑 tags / pickedTag -->
        <p class="result">选中：{{ pickedTag ?? '（未选择）' }}</p>
      </div>
    </div>

    <p class="tip">
      完成 TODO(1) 后，把鼠标悬停在 pickedEmployee / pickedTag 上看推导类型；
      在 :label 回调里输入 item. 还能弹出补全 —— 这就是与 any 的区别。
    </p>
  </section>
</template>

<style scoped>
.generic-lab {
  max-width: 640px;
  margin: 24px auto;
  padding: 20px;
  display: grid;
  gap: 16px;
  font-family: sans-serif;
}
.generic-lab h2 {
  margin: 0;
}
.panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.panels h3 {
  margin: 0 0 8px;
  font-size: 13px;
}
.result {
  margin: 8px 0 0;
  font-size: 12px;
  color: #55636d;
}
.tip {
  margin: 0;
  font-size: 12px;
  color: #8fa0ab;
}
</style>
`,h=`<script setup lang="ts">
/**
 * 练习：泛型组件 —— any 起步版
 *
 * 起始代码用 any[] 让组件先跑起来：功能正常，但回调拿到的全是 any，
 * 编辑器没有补全、写错字段名也不报错。
 *
 * TODO(1): 泛型改造 ——
 *   1. 给 <script setup> 标签加 generic="T"（必须搭配 lang="ts"）；
 *   2. 把本文件里所有 any 换成 T（props / emits / 函数签名一个不剩）。
 *   带约束的写法（真实业务常用）：generic="T extends { id: number }"；
 *   本演示要同时支持 string 列表，所以不加约束。
 *
 * 坑点：any 会顺着调用链污染类型 —— 漏改一个 any，
 * 父组件的回调就还是 any，前功尽弃。
 */
const props = defineProps<{
  /** 列表数据：TODO(1) 后变成 T[] */
  items: any[]
  /** 当前选中项（v-model） */
  modelValue?: any | null
  /** 展示文案函数：不传则对 string 直接展示、对象 JSON 兜底 */
  label?: (item: any) => string
}>()

const emit = defineEmits<{
  /** TODO(1) 后 value 变成 T */
  (e: 'update:modelValue', value: any): void
}>

function choose(item: any) {
  emit('update:modelValue', item)
}

function isActive(item: any): boolean {
  return props.modelValue !== undefined && props.modelValue === item
}

/* 展示兜底：运行时没有类型信息，只能基于「值的形状」分支 */
function displayOf(item: any): string {
  if (typeof item === 'string') return item
  return JSON.stringify(item)
}

/* key 兜底：string 用自身，对象优先用 id */
function keyOf(item: any): string {
  return typeof item === 'string' ? item : String((item as { id?: unknown }).id ?? JSON.stringify(item))
}
<\/script>

<template>
  <ul class="selectable-list">
    <li v-for="item in items" :key="keyOf(item)">
      <button :class="{ active: isActive(item) }" @click="choose(item)">
        {{ label ? label(item) : displayOf(item) }}
      </button>
    </li>
  </ul>
</template>

<style scoped>
.selectable-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 6px;
}
.selectable-list button {
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border: 1px solid #e4e9ec;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  color: #55636d;
}
.selectable-list button:hover {
  border-color: #42b883;
}
.selectable-list button.active {
  border-color: #42b883;
  background: #f0faf5;
  color: #33a06f;
  font-weight: 600;
}
</style>
`,g=`<script setup lang="ts">
/**
 * 参考答案：泛型组件 —— 父组件侧
 *
 * 相比练习版补充：
 * 1. SelectableList 改造成 generic="T" 版（见 SelectableList.vue）；
 * 2. 第二个列表用 string 数组实例化 —— 同一个组件，T 推导成 string；
 * 3. describeEmployee / describeTag 不需要任何类型断言：
 *    pickedEmployee 是 Employee | null，pickedTag 是 string | null，
 *    全靠泛型推导（可悬停验证）。
 */
import { ref } from 'vue'
import SelectableList from './SelectableList.vue'

interface Employee {
  id: number
  name: string
  role: string
}

// T 推导为 Employee：items 是 Employee[]
const employees = ref<Employee[]>([
  { id: 1, name: '小明', role: '前端工程师' },
  { id: 2, name: '小红', role: '产品经理' },
  { id: 3, name: '老王', role: '测试工程师' },
])
// 类型：Employee | null —— 泛型推导，没有写 any
const pickedEmployee = ref<Employee | null>(null)

// 同一个组件再实例化一次：T 推导为 string
const tags = ref<string[]>(['Vue 3.5', 'TypeScript', 'Pinia', 'Vite'])
// 类型：string | null —— 换一组数据，推导结果跟着换
const pickedTag = ref<string | null>(null)

/** 参数就是精确的 Employee —— 回调载荷由泛型保证，零断言 */
function describeEmployee(employee: Employee): string {
  return \`\${employee.name}（\${employee.role}）· 工号 \${employee.id}\`
}

/** 参数就是精确的 string */
function describeTag(tag: string): string {
  return \`#\${tag}\`
}
<\/script>

<template>
  <section class="generic-lab">
    <h2>🧬 泛型组件</h2>

    <div class="panels">
      <div>
        <h3>对象数组：Employee[]（T = Employee）</h3>
        <!-- label 函数的 item 参数也是 Employee：函数 prop 同样吃泛型 -->
        <SelectableList
          v-model="pickedEmployee"
          :items="employees"
          :label="(item) => item.name + '（' + item.role + '）'"
        />
        <p class="result">
          选中：{{ pickedEmployee ? describeEmployee(pickedEmployee) : '（未选择）' }}
        </p>
      </div>

      <div>
        <h3>string 数组（T = string）</h3>
        <!-- 不传 label：组件内部对 string 直接展示 -->
        <SelectableList v-model="pickedTag" :items="tags" />
        <p class="result">
          选中：{{ pickedTag ? describeTag(pickedTag) : '（未选择）' }}
        </p>
      </div>
    </div>

    <p class="tip">
      把鼠标悬停在 pickedEmployee / pickedTag 上看推导类型；试着把 tags
      传给第一个列表 —— T 会变成 string，label 回调里的 item.name 立刻标红。
    </p>
  </section>
</template>

<style scoped>
.generic-lab {
  max-width: 640px;
  margin: 24px auto;
  padding: 20px;
  display: grid;
  gap: 16px;
  font-family: sans-serif;
}
.generic-lab h2 {
  margin: 0;
}
.panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.panels h3 {
  margin: 0 0 8px;
  font-size: 13px;
}
.result {
  margin: 8px 0 0;
  font-size: 12px;
  color: #55636d;
}
.tip {
  margin: 0;
  font-size: 12px;
  color: #8fa0ab;
}
</style>
`,m=`<script setup lang="ts" generic="T">
/**
 * 参考答案：泛型列表组件
 *
 * 设计决策：
 * - generic="T" 声明类型参数：T 同时出现在 props 与 emits 里，
 *   父组件传什么类型的 items，回调就拿到什么类型的载荷。
 * - 没加 extends 约束：为了同时支持 string[] 与对象数组两种实例化。
 *   真实业务如果只接受「带 id 的对象」，推荐
 *   generic="T extends { id: number }"，传错形状编辑器直接标红。
 * - label prop 是 (item: T) => string：函数 prop 同样吃泛型 ——
 *   父组件的回调参数自动获得精确类型，这是泛型组件最常用的配合技巧。
 *
 * 坑点记录：
 * - 模板不能写 <SelectableList<Employee>> 显式实例化，T 只能从 props 推导；
 * - 泛型纯编译期：运行时不存在 T，typeof 分支基于「值的形状」。
 */
const props = defineProps<{
  items: T[]
  /** v-model：当前选中项（对象数组时是引用相等比较） */
  modelValue?: T | null
  /** 展示文案函数：不传则对 string 直接展示、对象 JSON 兜底 */
  label?: (item: T) => string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void
}>()

function choose(item: T) {
  emit('update:modelValue', item)
}

function isActive(item: T): boolean {
  return props.modelValue !== undefined && props.modelValue === item
}

/* 展示兜底：运行时没有类型信息，只能基于「值的形状」分支 */
function displayOf(item: T): string {
  if (typeof item === 'string') return item
  return JSON.stringify(item)
}

/* key 兜底：string 用自身，对象优先用 id */
function keyOf(item: T): string {
  return typeof item === 'string' ? item : String((item as { id?: unknown }).id ?? JSON.stringify(item))
}
<\/script>

<template>
  <ul class="selectable-list">
    <li v-for="item in items" :key="keyOf(item)">
      <button :class="{ active: isActive(item) }" @click="choose(item)">
        {{ label ? label(item) : displayOf(item) }}
      </button>
    </li>
  </ul>
</template>

<style scoped>
.selectable-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 6px;
}
.selectable-list button {
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border: 1px solid #e4e9ec;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  color: #55636d;
}
.selectable-list button:hover {
  border-color: #42b883;
}
.selectable-list button.active {
  border-color: #42b883;
  background: #f0faf5;
  color: #33a06f;
  font-weight: 600;
}
</style>
`,b=JSON.parse('{"title":"10 泛型组件","description":"generic=","frontmatter":{"title":"10 泛型组件","description":"generic=","tags":["泛型","TypeScript","defineEmits"]},"headers":[],"relativePath":"features/10-generic-components.md","filePath":"features/10-generic-components.md","lastUpdated":1792665939000}'),k={name:"features/10-generic-components.md"},f=Object.assign(k,{setup(u){const t={"App.vue":c,"SelectableList.vue":h},s={"App.vue":g,"SelectableList.vue":m};return(y,e)=>{const a=l("Playground");return r(),o("div",null,[e[0]||(e[0]=n("h1",{id:"泛型组件",tabindex:"-1"},[i("泛型组件 "),n("a",{class:"header-anchor",href:"#泛型组件","aria-label":'Permalink to "泛型组件"'},"​")],-1)),e[1]||(e[1]=n("blockquote",null,[n("p",null,[n("strong",null,"generic="),i(" · 难度：高级 · 引入版本：Vue 3.3")])],-1)),e[2]||(e[2]=n("div",{class:"feature-summary"},"generic=",-1)),p(a,{starter:t,solution:s}),e[3]||(e[3]=d(`<hr><h1 id="泛型组件-1" tabindex="-1">泛型组件 <a class="header-anchor" href="#泛型组件-1" aria-label="Permalink to &quot;泛型组件&quot;">​</a></h1><h2 id="这是什么" tabindex="-1">这是什么 <a class="header-anchor" href="#这是什么" aria-label="Permalink to &quot;这是什么&quot;">​</a></h2><p><code>&lt;script setup generic=&quot;...&quot;&gt;</code>（Vue 3.3+）让组件拥有自己的类型参数： 父组件传入什么样的 props，<code>T</code> 就被推导成什么类型 —— props、emits、 函数签名里的 T 全部联动，回调里拿到的是<strong>精确类型</strong>而不是 <code>any</code>。</p><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- SelectableList.vue --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setup</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ts&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> generic</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">T</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">defineProps</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;{ </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">items</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[] }&gt;()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> emit</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> defineEmits</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;{ (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">e</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;select&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">value</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> T</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }&gt;()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 父组件：传 string[] 时 T = string，传 Employee[] 时 T = Employee --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">SelectableList</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> :</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">items</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">tags</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">select</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">v</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> ...</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;SelectableList :items=&quot;employees&quot; @select=&quot;v =&gt; ...&quot; /&gt;</span></span></code></pre></div><h2 id="类型是怎么推导的" tabindex="-1">类型是怎么推导的 <a class="header-anchor" href="#类型是怎么推导的" aria-label="Permalink to &quot;类型是怎么推导的&quot;">​</a></h2><ol><li>父组件写 <code>:items=&quot;tags&quot;</code>，tags 是 <code>string[]</code> → T 被绑定为 <code>string</code>；</li><li>组件内所有 T（items、emit 载荷、暴露函数的参数）同步替换成 <code>string</code>；</li><li>父组件的 <code>@update:model-value</code> 回调参数因此拿到精确类型 —— 全程零手写泛型标注。</li></ol><p>编辑器里把鼠标悬停在本演示的 <code>pickedTag</code> / <code>pickedEmployee</code> 上可以直接 看到推导结果；在 <code>:label</code> 回调里输入 <code>item.</code> 还能弹出补全。</p><h2 id="generic-属性怎么写" tabindex="-1">generic 属性怎么写 <a class="header-anchor" href="#generic-属性怎么写" aria-label="Permalink to &quot;generic 属性怎么写&quot;">​</a></h2><table tabindex="0"><thead><tr><th>写法</th><th>说明</th></tr></thead><tbody><tr><td><code>generic=&quot;T&quot;</code></td><td>单个类型参数，无约束（本演示用，为了兼容 string 与对象两种数组）</td></tr><tr><td><code>generic=&quot;T extends { id: number }&quot;</code></td><td>带约束：items 必须是含数字 id 的对象数组，传错形状编辑器标红</td></tr><tr><td><code>generic=&quot;T, U&quot;</code></td><td>多个类型参数，逗号分隔</td></tr><tr><td><code>generic=&quot;T extends X = DefaultT&quot;</code></td><td>带默认值的类型参数</td></tr></tbody></table><h2 id="与-any-的区别" tabindex="-1">与 any 的区别 <a class="header-anchor" href="#与-any-的区别" aria-label="Permalink to &quot;与 any 的区别&quot;">​</a></h2><table tabindex="0"><thead><tr><th></th><th><code>items: any[]</code></th><th><code>items: T[]</code></th></tr></thead><tbody><tr><td>回调参数类型</td><td>any（类型检查关闭）</td><td>精确推导（如 Employee）</td></tr><tr><td>写错字段名</td><td>运行时才炸</td><td>编辑器立刻标红</td></tr><tr><td>补全</td><td>没有</td><td>有</td></tr><tr><td>约束能力</td><td>无</td><td>extends 约束输入形状</td></tr></tbody></table><p>泛型是<strong>纯编译期</strong>概念：运行时不存在 T，零开销。</p><h2 id="动手试" tabindex="-1">动手试 <a class="header-anchor" href="#动手试" aria-label="Permalink to &quot;动手试&quot;">​</a></h2><ol><li>TODO(1) 把 SelectableList.vue 从 <code>any[]</code> 版改造成 <code>generic=&quot;T&quot;</code> 版 （props / emits / 函数签名里的 any 一个不剩全换成 T）</li><li>TODO(2) 在 App.vue 用 string 数组实例化第二个列表 （tags / pickedTag 数据已备好）</li><li>TODO(3) 完成后观察回调里的精确类型：describeEmployee 不需要任何 类型断言，参数就是 Employee</li><li>加分项：给对象列表传一个 <code>:label=&quot;(item) =&gt; ...&quot;</code> 函数 prop， 体会函数参数同样吃泛型推导</li></ol><h2 id="常见坑-真实踩坑记录" tabindex="-1">常见坑（真实踩坑记录） <a class="header-anchor" href="#常见坑-真实踩坑记录" aria-label="Permalink to &quot;常见坑（真实踩坑记录）&quot;">​</a></h2><ul><li><strong>模板里不能显式实例化泛型</strong>：<code>&lt;SelectableList&lt;Employee&gt; ... /&gt;</code> 不被 支持 —— 泛型只能从 props 推导；想让 T 稳定，就保证 items 的类型标注 完整（别写 any[]）。</li><li><strong>generic 是字符串属性</strong>：里面写不了模板语法，多参数用逗号、约束用 extends、默认值用 <code>=</code> —— 与 TS 类型参数语法一致，只是整体包在引号里。</li><li><strong>props/emits 引用了未声明的类型参数</strong>：generic 里只写了 T，props 里 却用了 U → 编译报错；每个出现的类型参数都必须在 generic 里声明。</li><li><strong>any 起步要舍得删干净</strong>：any 会顺着调用链污染类型 —— 练习版只要 漏改一个 any（比如回调参数），父组件拿到的就还是 any，前功尽弃。</li><li><strong>运行时没有 T</strong>：想根据 T 写不同运行时逻辑做不到（类型擦除）； 运行时分支请基于值本身判断（如 <code>typeof item === &#39;string&#39;</code>， 本组件的展示兜底就是这么写的）。</li></ul><hr><h2 id="源码参考" tabindex="-1">源码参考 <a class="header-anchor" href="#源码参考" aria-label="Permalink to &quot;源码参考&quot;">​</a></h2><ul><li>特性目录：<a href="https://github.com/YZhiJie/vue3-features-lab/tree/main/src/features/10-generic-components" target="_blank" rel="noreferrer"><code>src/features/10-generic-components/</code></a></li></ul>`,21))])}}});export{b as __pageData,f as default};
