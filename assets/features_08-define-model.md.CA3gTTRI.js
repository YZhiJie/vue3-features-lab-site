import{C as d,o as a,c as s,j as n,a as t,E as r,a2 as p}from"./chunks/framework.CE7vFz40.js";const u=`<script setup lang="ts">
/**
 * 练习：defineModel 双向绑定 —— 父组件侧
 *
 * 父组件的 v-model 用法在 3.4 前后完全一致，练习主战场在 CustomInput.vue
 * （把三件套重构成 defineModel）。本文件留了两个体验型 TODO：
 *   TODO(4) 给实例② 的 v-model 加 .capitalize 修饰符
 *   TODO(5) 实现 reset() 并绑定到「重置」按钮
 *
 * 观察点：
 * - 每张卡片都有三个输入框，但父组件只绑定了其中一部分 ——
 *   在「没绑定」的输入框里打字，下方 readout 不会变：
 *   defineModel 在父组件未绑定时退化为本地 ref（3.4+ 行为）。
 */
import { ref } from 'vue'
import CustomInput from './CustomInput.vue'

// 实例①：最基本的 v-model（对应 CustomInput 的默认 model）
const greeting = ref('hello vue')

// 实例②：TODO(4) —— 给下面的 v-model 加上 .capitalize，观察首字母自动大写
//         （提示：先完成 CustomInput.vue 的 TODO(1)(3) 才会生效）
const roar = ref('shout out')

// 实例③：一个组件绑两个 model；注意主输入框没绑 → 它是本地状态
const post = ref({ title: '', content: '' })

/* TODO(5): 实现 reset —— 把三个 ref 恢复成初始值，并绑定到下方按钮。
 *          从父组件直接改 ref，子组件输入框会跟着变：这就是「双向」的另一半。 */
function reset() {
  /* TODO */
}

/** 父组件实时读到的值 —— 证明双向真的打通了（模板里调用，依赖自动收集） */
function dump() {
  return JSON.stringify({
    greeting: greeting.value,
    roar: roar.value,
    post: post.value,
  })
}
<\/script>

<template>
  <section class="define-model-lab">
    <h2>🔁 defineModel 双向绑定</h2>

    <div class="cards">
      <div>
        <h3>① 基本 v-model</h3>
        <CustomInput v-model="greeting" />
        <p class="bound">已绑定：v-model</p>
      </div>
      <div>
        <h3>② 修饰符 .capitalize（TODO(4)）</h3>
        <CustomInput v-model="roar" />
        <p class="bound">已绑定：v-model（记得加修饰符）</p>
      </div>
      <div>
        <h3>③ 一个组件多个 v-model</h3>
        <CustomInput v-model:title="post.title" v-model:content="post.content" />
        <p class="bound">已绑定：v-model:title / v-model:content</p>
      </div>
    </div>

    <div class="readout">
      <p>父组件实时读到的值：<code>{{ dump() }}</code></p>
      <!-- TODO(5): 给这个按钮绑定 @click="reset" -->
      <button>♻️ 重置（完成 TODO(5) 后生效）</button>
    </div>

    <p class="tip">
      试试在卡片①的「标题」输入框里打字 —— readout 不变，
      因为父组件没绑 v-model:title（本地状态）。
    </p>
  </section>
</template>

<style scoped>
.define-model-lab {
  max-width: 720px;
  margin: 24px auto;
  padding: 20px;
  display: grid;
  gap: 16px;
  font-family: sans-serif;
}
.define-model-lab h2 {
  margin: 0;
}
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.cards h3 {
  margin: 0 0 6px;
  font-size: 13px;
}
.bound {
  margin: 6px 0 0;
  font-size: 11px;
  color: #33a06f;
}
.readout {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 12px;
  display: grid;
  gap: 8px;
  justify-items: start;
}
.readout p {
  margin: 0;
  font-size: 12px;
  color: #55636d;
  word-break: break-all;
}
.readout code {
  color: #b3453c;
}
.readout button {
  padding: 6px 14px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
}
.readout button:hover {
  border-color: #42b883;
  color: #33a06f;
}
.tip {
  margin: 0;
  font-size: 12px;
  color: #8fa0ab;
}
</style>
`,c=`<script setup lang="ts">
/**
 * 练习：defineModel 双向绑定 ——「三件套」起步版
 *
 * 本文件是 Vue 3.4 之前实现 v-model 的标准姿势：
 *   props 声明 + emits 声明 + 手动转发输入事件。
 * 它完全能跑，但每加一个 model 就要多写三份样板代码。
 *
 * 练习目标（把整个文件重构成 defineModel 版本，见 feature.md「核心 API」）：
 *   TODO(1) modelValue 三件套 → const model = defineModel<string>()
 *   TODO(2) title / content 三件套 → defineModel<string>('title') / ('content')
 *   TODO(3) 给默认 model 支持 .capitalize 修饰符（元组形式 + set 转换）
 *
 * 坑点：手动转发时 e.target 要断言成 HTMLInputElement / HTMLTextAreaElement；
 * 输入框只绑 :value 不绑 @input 会变成只读。
 */
const props = defineProps<{
  modelValue?: string;
  title?: string;
  content?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "update:title", value: string): void;
  (e: "update:content", value: string): void;
}>();

/* 三个手动转发函数 —— 重构后 defineModel 会把这一切全部吃掉 */
function onMainInput(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
}
function onTitleInput(event: Event) {
  emit("update:title", (event.target as HTMLInputElement).value);
}
function onContentInput(event: Event) {
  emit("update:content", (event.target as HTMLTextAreaElement).value);
}
<\/script>

<!-- 模板里的 props.modelValue / props.title 等在 defineModel 版本里
     要换成对应的 model ref（模板中自动解包，不用 .value） -->
<template>
  <section class="note-card">
    <label class="field">
      <span>主输入（v-model）</span>
      <!-- 旧写法：:value + @input 手动转发；defineModel 版可直接 v-model="model" -->
      <input
        :value="props.modelValue"
        @input="onMainInput"
        placeholder="试试在这里打字…"
      />
    </label>

    <label class="field">
      <span>标题（v-model:title）</span>
      <input :value="props.title" @input="onTitleInput" placeholder="标题" />
    </label>

    <label class="field">
      <span>正文（v-model:content）</span>
      <textarea
        :value="props.content"
        @input="onContentInput"
        rows="3"
        placeholder="正文"
      />
    </label>
  </section>
</template>

<style scoped>
.note-card {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 14px;
  display: grid;
  gap: 10px;
  background: #fff;
}
.field {
  display: grid;
  gap: 4px;
  font-size: 13px;
  color: #55636d;
}
.field input,
.field textarea {
  padding: 6px 10px;
  border: 1px solid #dde5ea;
  border-radius: 6px;
  font: inherit;
  resize: vertical;
}
</style>
`,m=`<script setup lang="ts">
/**
 * 参考答案：defineModel 双向绑定 —— 父组件侧
 *
 * 相比练习版补充：
 * 1. 实例② 加上 .capitalize 修饰符（依赖 CustomInput 里的 set 转换）；
 * 2. reset()：父组件直接改 ref —— 双向绑定的「父 → 子」方向；
 * 3. dump() readout 面板：证明只有绑定的 model 才会同步回父组件。
 */
import { ref } from 'vue'
import CustomInput from './CustomInput.vue'

// 实例①：基本 v-model
const greeting = ref('hello vue')

// 实例②：.capitalize 修饰符 —— 修改会先经过子组件 set 里的转换再写回这里
const roar = ref('shout out')

// 实例③：一个组件绑两个命名 model；主输入框未绑定 → 子组件内部是本地状态
const post = ref({ title: '', content: '' })

/* 重置：直接改父组件的 ref，子组件输入框跟着变 —— v-model 的另一半方向 */
function reset() {
  greeting.value = 'hello vue'
  roar.value = 'shout out'
  post.value.title = ''
  post.value.content = ''
}

/** 实时读出父组件持有的值（模板中调用，依赖自动收集） */
function dump() {
  return JSON.stringify({
    greeting: greeting.value,
    roar: roar.value,
    post: post.value,
  })
}
<\/script>

<template>
  <section class="define-model-lab">
    <h2>🔁 defineModel 双向绑定</h2>

    <div class="cards">
      <div>
        <h3>① 基本 v-model</h3>
        <CustomInput v-model="greeting" />
        <p class="bound">已绑定：v-model</p>
      </div>
      <div>
        <h3>② 修饰符 .capitalize</h3>
        <!-- 打 "vue" 实际存进来的是 "Vue"：子组件 set 转换的功劳 -->
        <CustomInput v-model.capitalize="roar" />
        <p class="bound">已绑定：v-model.capitalize</p>
      </div>
      <div>
        <h3>③ 一个组件多个 v-model</h3>
        <CustomInput v-model:title="post.title" v-model:content="post.content" />
        <p class="bound">已绑定：v-model:title / v-model:content</p>
      </div>
    </div>

    <div class="readout">
      <p>父组件实时读到的值：<code>{{ dump() }}</code></p>
      <button @click="reset">♻️ 重置</button>
    </div>

    <p class="tip">
      三张卡片的「标题/正文」输入框里，没绑定的那些改了 readout 不动
      —— defineModel 未绑定时是本地 ref；「重置」演示父 → 子方向。
    </p>
  </section>
</template>

<style scoped>
.define-model-lab {
  max-width: 720px;
  margin: 24px auto;
  padding: 20px;
  display: grid;
  gap: 16px;
  font-family: sans-serif;
}
.define-model-lab h2 {
  margin: 0;
}
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.cards h3 {
  margin: 0 0 6px;
  font-size: 13px;
}
.bound {
  margin: 6px 0 0;
  font-size: 11px;
  color: #33a06f;
}
.readout {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 12px;
  display: grid;
  gap: 8px;
  justify-items: start;
}
.readout p {
  margin: 0;
  font-size: 12px;
  color: #55636d;
  word-break: break-all;
}
.readout code {
  color: #b3453c;
}
.readout button {
  padding: 6px 14px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
}
.readout button:hover {
  border-color: #42b883;
  color: #33a06f;
}
.tip {
  margin: 0;
  font-size: 12px;
  color: #8fa0ab;
}
</style>
`,h=`<script setup lang="ts">
/**
 * 参考答案：defineModel 版 CustomInput
 *
 * 对比练习版（三件套约 20 行脚本），这里每个 model 一行，并自动获得：
 * 1. prop + emit 的声明与转发；
 * 2. 父组件未绑定时的本地 ref 兜底（3.4+ 行为，仍可读写但不同步）；
 * 3. 修饰符支持（元组第二个元素）。
 *
 * 坑点说明：
 * - set 的返回值才是最终写回父组件的值，忘 return 会写回 undefined；
 * - get 必须是纯函数（只做读转换），改状态会无限重渲染；
 * - model 是 ref：JS 里 .value，模板里自动解包（v-model="model"）。
 */

// ① 默认 model：对应 v-model="x"。
//    元组形式 [model, modelModifiers]：modifiers.capitalize
//    来自父组件模板上的 v-model.capitalize。
const [model, modelModifiers] = defineModel<string>({
  // get：读转换。父组件没绑定时 prop 是 undefined，
  // 这里兜底成空字符串，输入框绑定永远拿到 string（只换形状，无副作用）
  get: (value) => value ?? '',
  // set：写转换 —— capitalize 修饰符开启时首字母大写。
  // 注意必须 return 结果，漏了 return 父组件会收到 undefined
  set: (value) => {
    if (modelModifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  },
})

// ② 命名 model：分别对应 v-model:title / v-model:content —— 一个组件可有多个 model
const title = defineModel<string>('title')
const content = defineModel<string>('content')
<\/script>

<template>
  <section class="note-card">
    <label class="field">
      <span>主输入（v-model）</span>
      <!-- defineModel 版：直接 v-model 绑定 ref，无需 :value + @input 手动转发 -->
      <input v-model="model" placeholder="试试在这里打字…" />
    </label>

    <label class="field">
      <span>标题（v-model:title）</span>
      <input v-model="title" placeholder="标题" />
    </label>

    <label class="field">
      <span>正文（v-model:content）</span>
      <textarea v-model="content" rows="3" placeholder="正文" />
    </label>
  </section>
</template>

<style scoped>
.note-card {
  border: 1px solid #d8efe4;
  border-radius: 10px;
  padding: 14px;
  display: grid;
  gap: 10px;
  background: #fff;
}
.field {
  display: grid;
  gap: 4px;
  font-size: 13px;
  color: #55636d;
}
.field input,
.field textarea {
  padding: 6px 10px;
  border: 1px solid #dde5ea;
  border-radius: 6px;
  font: inherit;
  resize: vertical;
}
</style>
`,b=JSON.parse('{"title":"08 defineModel 双向绑定","description":"一行 defineModel 替换 props+emit 三件套：命名 model、get/set 转换、capitalize 修饰符一次讲透。","frontmatter":{"title":"08 defineModel 双向绑定","description":"一行 defineModel 替换 props+emit 三件套：命名 model、get/set 转换、capitalize 修饰符一次讲透。","tags":["defineModel","v-model","双向绑定"]},"headers":[],"relativePath":"features/08-define-model.md","filePath":"features/08-define-model.md","lastUpdated":1792665939000}'),f={name:"features/08-define-model.md"},x=Object.assign(f,{setup(g){const i={"App.vue":u,"CustomInput.vue":c},o={"App.vue":m,"CustomInput.vue":h};return(v,e)=>{const l=d("Playground");return a(),s("div",null,[e[0]||(e[0]=n("h1",{id:"definemodel-双向绑定",tabindex:"-1"},[t("defineModel 双向绑定 "),n("a",{class:"header-anchor",href:"#definemodel-双向绑定","aria-label":'Permalink to "defineModel 双向绑定"'},"​")],-1)),e[1]||(e[1]=n("blockquote",null,[n("p",null,[n("strong",null,"defineModel() · Vue 3.4 稳定"),t(" · 难度：入门 · 引入版本：Vue 3.4")])],-1)),e[2]||(e[2]=n("div",{class:"feature-summary"},"一行 defineModel 替换 props+emit 三件套：命名 model、get/set 转换、capitalize 修饰符一次讲透。",-1)),r(l,{starter:i,solution:o}),e[3]||(e[3]=p(`<hr><h1 id="definemodel-双向绑定-1" tabindex="-1">defineModel 双向绑定 <a class="header-anchor" href="#definemodel-双向绑定-1" aria-label="Permalink to &quot;defineModel 双向绑定&quot;">​</a></h1><h2 id="这是什么" tabindex="-1">这是什么 <a class="header-anchor" href="#这是什么" aria-label="Permalink to &quot;这是什么&quot;">​</a></h2><p><code>defineModel()</code> 是 Vue 3.4 转正的编译宏，一行声明「双向绑定 prop」： 编译器自动帮你生成 <code>modelValue</code> prop + <code>update:modelValue</code> 事件， 父组件照常写 <code>v-model=&quot;xxx&quot;</code> 即可。</p><p>Vue 3.4 之前，同样的效果必须写「三件套」：</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 旧写法：props 声明 + emits 声明 + 手动转发，每个 model 三份样板</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> props</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> defineProps</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;{ </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">modelValue</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }&gt;()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> emit</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> defineEmits</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;{ (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">e</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;update:modelValue&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">v</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }&gt;()</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 模板里还要 :value=&quot;modelValue&quot; @input=&quot;emit(&#39;update:modelValue&#39;, ...)&quot;</span></span></code></pre></div><p>3.4 之后一行搞定：</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> model</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> defineModel</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;() </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// model 是一个「打通两端」的 ref</span></span></code></pre></div><p>子组件里给 <code>model.value</code> 赋值会自动 emit 给父组件；父组件值变更也会自动 流回来。本演示的 CustomInput.vue 起始代码就是完整的三件套版本 （能跑但啰嗦），练习就是把整个文件重构成 defineModel 版本。</p><h2 id="核心-api-速览" tabindex="-1">核心 API 速览 <a class="header-anchor" href="#核心-api-速览" aria-label="Permalink to &quot;核心 API 速览&quot;">​</a></h2><table tabindex="0"><thead><tr><th>用法</th><th>说明</th></tr></thead><tbody><tr><td><code>defineModel&lt;string&gt;()</code></td><td>默认 model，对应 <code>v-model=&quot;x&quot;</code></td></tr><tr><td><code>defineModel&lt;string&gt;(&#39;title&#39;)</code></td><td>命名 model，对应 <code>v-model:title=&quot;x&quot;</code></td></tr><tr><td><code>defineModel&lt;string&gt;({ default: &#39;&#39; })</code></td><td>父组件没绑定时的默认值</td></tr><tr><td><code>const [m, mods] = defineModel({ set(v) {...} })</code></td><td>元组形式：<code>m</code> 是 model，<code>mods</code> 是修饰符对象</td></tr><tr><td><code>{ get(v) {...}, set(v) {...} }</code></td><td>读写转换钩子：get 必须纯函数，set 必须 return 结果</td></tr><tr><td><code>v-model.capitalize=&quot;x&quot;</code></td><td>修饰符写法，组件内用 <code>modifiers.capitalize</code> 读取</td></tr></tbody></table><h2 id="一个组件多个-v-model-与修饰符" tabindex="-1">一个组件多个 v-model 与修饰符 <a class="header-anchor" href="#一个组件多个-v-model-与修饰符" aria-label="Permalink to &quot;一个组件多个 v-model 与修饰符&quot;">​</a></h2><ul><li>一个组件可以声明任意多个 model：<code>defineModel&lt;string&gt;(&#39;title&#39;)</code> + <code>defineModel&lt;string&gt;(&#39;content&#39;)</code>，父组件 <code>v-model:title=&quot;a&quot; v-model:content=&quot;b&quot;</code> 各绑各的。</li><li>修饰符通过元组第二个元素拿到：<code>v-model.capitalize=&quot;x&quot;</code> → <code>modifiers.capitalize === true</code>；kebab-case 修饰符（如 <code>v-model.first-name</code>）会自动驼峰化成 <code>modifiers.firstName</code>。</li></ul><h2 id="动手试" tabindex="-1">动手试 <a class="header-anchor" href="#动手试" aria-label="Permalink to &quot;动手试&quot;">​</a></h2><ol><li>TODO(1) 在 CustomInput.vue 里用 <code>defineModel&lt;string&gt;()</code> 替换 modelValue 的 props + emit 三件套</li><li>TODO(2) 用两个命名 model 替换 title / content 的三件套</li><li>TODO(3) 给默认 model 加 capitalize 修饰符支持（元组形式 + set 转换）</li><li>TODO(4) 在 App.vue 给实例② 的 v-model 加上 <code>.capitalize</code>， 对比首字母是否自动大写</li><li>TODO(5) 实现 App 的「重置」按钮：从父组件直接改 ref， 体会双向绑定的另一半（父 → 子）</li><li>观察点：三张卡片里「父组件没绑定的 model」可以输入但不进 readout —— 3.4+ 的 defineModel 在未绑定时退化为本地 ref</li></ol><h2 id="常见坑-真实踩坑记录" tabindex="-1">常见坑（真实踩坑记录） <a class="header-anchor" href="#常见坑-真实踩坑记录" aria-label="Permalink to &quot;常见坑（真实踩坑记录）&quot;">​</a></h2><ul><li><strong>JS 里忘 <code>.value</code></strong>：defineModel 返回的是 ref，JS 里必须 <code>model.value = &#39;x&#39;</code>；模板里自动解包，直接 <code>v-model=&quot;model&quot;</code>。</li><li><strong>set 里忘 return</strong>：<code>set(v) { v.trim() }</code> 会让父组件收到 undefined， 输入框直接清空 —— set 的返回值才是最终写回的值。</li><li><strong>get 里做副作用</strong>：get 必须是纯函数，只做「读的时候换个形状」 （格式化、兜底、单位换算）；在里面改状态会无限重渲染。</li><li><strong>未绑定的 model 是本地状态</strong>：父组件没绑 v-model 时仍可读写， 但改动不会同步给任何人。演示卡片 ①② 的 title/content 输入框就是 这种状态 —— 在里面打字，父组件 readout 纹丝不动。</li><li><strong>同名 model 不能绑两次</strong>：<code>v-model:title=&quot;a&quot; v-model:title=&quot;b&quot;</code> 直接编译报错（重复 prop）；多个 model 必须起不同名字。</li><li><strong>修饰符判断要写在 set 闭包里</strong>：跟着每次赋值重新判断才正确； 想加新修饰符（如 trim）就照 capitalize 的样子往 set 里加分支。</li></ul><hr><h2 id="源码参考" tabindex="-1">源码参考 <a class="header-anchor" href="#源码参考" aria-label="Permalink to &quot;源码参考&quot;">​</a></h2><ul><li>特性目录：<a href="https://github.com/YZhiJie/vue3-features-lab/tree/main/src/features/08-define-model" target="_blank" rel="noreferrer"><code>src/features/08-define-model/</code></a></li></ul>`,20))])}}});export{b as __pageData,x as default};
