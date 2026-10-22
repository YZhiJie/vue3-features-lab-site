import{C as o,o as l,c as r,j as n,a as e,E as p,a2 as d}from"./chunks/framework.CE7vFz40.js";const c=`<script setup lang="ts">
/**
 * 练习：组合式 API 入门 —— 迷你购物车
 *
 * 起始代码是「能跑但没反应」的状态：price/count 是普通 let，
 * 改输入框不会刷新视图。请按 TODO 逐项补全，体会响应式从无到有：
 *   TODO(1) ref 声明 price / count
 *   TODO(2) reactive 声明 user
 *   TODO(3)(4) computed 派生 total / vipTotal
 *   TODO(5) onMounted 打印日志
 *   TODO(6) 已在模板中替换占位（本次练习模板已完整，无需改动）
 */
import { computed, onMounted, reactive, ref } from 'vue'

/* ───────────────────────────────────────────────
 * 1) ref：包装基础类型
 *    JS 中读写要 .value；模板中自动解包（不用写 .value）
 * ─────────────────────────────────────────────── */
// TODO(1): 把下面两个 let 改成 ref(10) 和 ref(2)，观察右侧预览的变化
let price = 0
let count = 0

/* ───────────────────────────────────────────────
 * 2) reactive：包装对象，直接访问属性，无需 .value
 *    坑：不要对 reactive 对象解构/展开，会丢失响应式
 * ─────────────────────────────────────────────── */
// TODO(2): 用 reactive 创建 { name: '小明', vip: true }
const user = { name: '', vip: false }

/* ───────────────────────────────────────────────
 * 3) computed：派生状态（带缓存：依赖不变就不重算）
 *    本质是 ref，模板里当普通值用
 * ─────────────────────────────────────────────── */
// TODO(3): 总价 total = price * count（注意 ref 的 .value）
const total = 0
// TODO(4): VIP 折扣价 vipTotal = total * 0.8
const vipTotal = 0

/* ───────────────────────────────────────────────
 * 4) onMounted：DOM 挂载后执行，适合放初始副作用
 * ─────────────────────────────────────────────── */
// TODO(5): 挂载后 console.log 一条欢迎语，并到预览区 Console 面板查看
<\/script>

<template>
  <section class="cart">
    <h2>🛒 迷你购物车</h2>

    <label>
      单价（元）：
      <!-- v-model.number：把输入值自动转成数字，避免 '10' + 2 的字符串陷阱 -->
      <input v-model.number="price" type="number" min="0" />
    </label>

    <label>
      数量：
      <input v-model.number="count" type="number" min="0" />
    </label>

    <p>总价：<strong>{{ total }} 元</strong></p>
    <p v-if="user.vip">
      VIP 折后价：<strong class="vip">{{ vipTotal }} 元</strong>
    </p>

    <p class="tip">完成 TODO(1) 后，拖动输入框试试 —— 视图应当实时更新。</p>
  </section>
</template>

<style scoped>
.cart {
  max-width: 340px;
  margin: 24px auto;
  padding: 20px;
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  display: grid;
  gap: 12px;
  font-family: sans-serif;
}
.cart label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.cart input {
  width: 90px;
  padding: 4px 8px;
}
.vip {
  color: #d98b1f;
}
.tip {
  color: #8fa0ab;
  font-size: 12px;
}
</style>
`,h=`<script setup lang="ts">
/**
 * 参考答案：组合式 API 入门 —— 迷你购物车
 *
 * 相比练习版补充了：
 * 1. 所有 TODO 的完整实现（ref / reactive / computed / onMounted）
 * 2. 事件处理函数直接写在 <script setup> 顶层 —— 无需 methods 选项
 * 3. computed 的缓存演示：total 依赖的 price/count 未变时不会重算
 */
import { computed, onMounted, reactive, ref } from "vue";

/* ref：基础类型的响应式。初始值给了 10 / 2，模板立即可交互 */
const price = ref(10);
const count = ref(2);

/* reactive：对象类型的响应式。这里聚合「用户信息」这组相关字段 */
const user = reactive({ name: "小明", vip: true });

/*
 * computed 派生：
 * - total 依赖 price/count，任一变化自动重算
 * - vipTotal 依赖 total，形成派生链（价格变化 → total 变 → vipTotal 变）
 * - computed 自带缓存：依赖未变时多次读取不会重复执行函数体
 */
const total = computed(() => price.value * count.value);
const vipTotal = computed(() => total.value * 0.8);

/* 生命周期：挂载后执行一次。打开预览下方 Console 面板可以看到输出 */
onMounted(() => {
  console.log("[迷你购物车] 已挂载，欢迎体验组合式 API！");
});

/* 事件处理：script setup 顶层定义，模板直接使用，等价于 Options API 的 methods */
function add(delta: number) {
  // 注意 JS 里 ref 必须 .value；Math.max 防止减成负数
  count.value = Math.max(0, count.value + delta);
}

/* reactive 对象直接修改属性即可触发更新，这正是代理的好处 */
function toggleVip() {
  user.vip = !user.vip;
}
<\/script>

<template>
  <section class="cart">
    <h2>🛒 迷你购物车</h2>

    <label>
      单价（元）：
      <input v-model.number="price" type="number" min="0" />
    </label>

    <label>
      数量：
      <button @click="add(-1)">−</button>
      <!-- 模板中 ref 自动解包，直接写 count -->
      <span class="count">{{ count }}</span>
      <button @click="add(1)">＋</button>
    </label>

    <p>
      总价：<strong>{{ total }} 元</strong>
    </p>

    <p v-if="user.vip">
      VIP 折后价：<strong class="vip">{{ vipTotal }} 元</strong>
    </p>
    <button @click="toggleVip">
      {{ user.vip ? "退出 VIP（恢复原价）" : "开通 VIP（打八折）" }}
    </button>
  </section>
</template>

<style scoped>
.cart {
  max-width: 340px;
  margin: 24px auto;
  padding: 20px;
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  display: grid;
  gap: 12px;
  font-family: sans-serif;
}
.cart label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.cart input {
  width: 90px;
  padding: 4px 8px;
}
.cart button {
  padding: 4px 12px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
}
.cart button:hover {
  border-color: #42b883;
  color: #33a06f;
}
.count {
  min-width: 24px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.vip {
  color: #d98b1f;
}
</style>
`,v=JSON.parse('{"title":"01 组合式 API 入门","description":"用 ref / reactive / computed / onMounted 从零搭一个迷你购物车，体会响应式从无到有。","frontmatter":{"title":"01 组合式 API 入门","description":"用 ref / reactive / computed / onMounted 从零搭一个迷你购物车，体会响应式从无到有。","tags":["ref","reactive","computed","onMounted"]},"headers":[],"relativePath":"features/01-composition-api.md","filePath":"features/01-composition-api.md","lastUpdated":1792665939000}'),u={name:"features/01-composition-api.md"},f=Object.assign(u,{setup(k){const i={"App.vue":c},s={"App.vue":h};return(g,t)=>{const a=o("Playground");return l(),r("div",null,[t[0]||(t[0]=n("h1",{id:"组合式-api-入门",tabindex:"-1"},[e("组合式 API 入门 "),n("a",{class:"header-anchor",href:"#组合式-api-入门","aria-label":'Permalink to "组合式 API 入门"'},"​")],-1)),t[1]||(t[1]=n("blockquote",null,[n("p",null,[n("strong",null,"Composition API · <script setup>"),e(" · 难度：入门 · 引入版本：Vue 3.0")])],-1)),t[2]||(t[2]=n("div",{class:"feature-summary"},"用 ref / reactive / computed / onMounted 从零搭一个迷你购物车，体会响应式从无到有。",-1)),p(a,{starter:i,solution:s}),t[3]||(t[3]=d(`<hr><h1 id="组合式-api-composition-api" tabindex="-1">组合式 API（Composition API） <a class="header-anchor" href="#组合式-api-composition-api" aria-label="Permalink to &quot;组合式 API（Composition API）&quot;">​</a></h1><h2 id="这是什么" tabindex="-1">这是什么 <a class="header-anchor" href="#这是什么" aria-label="Permalink to &quot;这是什么&quot;">​</a></h2><p>组合式 API 是 Vue 3 最重要的编程范式变化。它允许你<strong>按逻辑关注点</strong>（而不是选项类型）组织代码：一个功能的所有状态、计算、副作用都写在一起。</p><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setup</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// &lt;script setup&gt; 是组合式 API 的语法糖：</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 顶层代码就是 setup() 函数体，声明的变量直接在模板可用</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { computed, onMounted, reactive, ref } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><p>对比 Options API（Vue 2 风格）：<code>data / methods / computed / mounted</code> 被拆散在不同选项里，功能一多就要来回跳；组合式 API 把它们聚拢，且天然获得完整的 TypeScript 类型推导。</p><h2 id="核心-api-速览" tabindex="-1">核心 API 速览 <a class="header-anchor" href="#核心-api-速览" aria-label="Permalink to &quot;核心 API 速览&quot;">​</a></h2><table tabindex="0"><thead><tr><th>API</th><th>用途</th><th>关键点</th></tr></thead><tbody><tr><td><code>ref(v)</code></td><td>包装<strong>任意类型</strong>为响应式引用</td><td>JS 中读写要 <code>.value</code>；模板中自动解包</td></tr><tr><td><code>reactive(obj)</code></td><td>把<strong>对象</strong>变成响应式代理</td><td>访问属性无需 <code>.value</code>；不能整体替换</td></tr><tr><td><code>computed(fn)</code></td><td>派生状态，依赖不变时走缓存</td><td>是 ref，使用方式与 ref 一致</td></tr><tr><td><code>onMounted(fn)</code></td><td>DOM 挂载后执行的副作用</td><td>可安全访问 DOM / 发起请求</td></tr><tr><td><code>watch(src, cb)</code></td><td>侦听响应式变化执行副作用</td><td>详见第 5 章</td></tr></tbody></table><h2 id="ref-与-reactive-怎么选" tabindex="-1"><code>ref</code> 与 <code>reactive</code> 怎么选？ <a class="header-anchor" href="#ref-与-reactive-怎么选" aria-label="Permalink to &quot;\`ref\` 与 \`reactive\` 怎么选？&quot;">​</a></h2><ul><li><strong>默认用 <code>ref</code></strong>：类型一致（<code>.value</code> 心智统一）、可以整体替换、支持任意类型。</li><li><code>reactive</code> 适合<strong>聚合一组相关字段</strong>且不会整体替换的本地状态（表单对象等）。</li><li>最大的坑：对 <code>reactive</code> 对象做<strong>解构或展开会丢失响应式</strong>（需要 <code>toRefs</code> 补救）：</li></ul><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> state</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> reactive</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({ x: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, y: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> })</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">x</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> state        </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ❌ x 是普通数字，失去响应式</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">x</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> toRefs</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(state) </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ✅ x 是 Ref，保持响应式</span></span></code></pre></div><h2 id="动手试" tabindex="-1">动手试 <a class="header-anchor" href="#动手试" aria-label="Permalink to &quot;动手试&quot;">​</a></h2><p>右侧编辑器里的起始代码是一个「迷你购物车」，按 TODO 逐项补全：</p><ol><li>用 <code>ref</code> 声明 <code>price</code>、<code>count</code>（起始是普通 <code>let</code>，改完输入框才会驱动视图）</li><li>用 <code>reactive</code> 声明 <code>user</code> 对象</li><li>用 <code>computed</code> 派生 <code>total</code> 与 <code>vipTotal</code></li><li>在 <code>onMounted</code> 里打一条欢迎日志（打开预览下方的 <strong>Console</strong> 查看）</li><li>参考答案还演示了：事件处理函数直接写在 <code>setup</code> 顶层</li></ol><p>改完每一项，右侧预览都会<strong>实时刷新</strong> —— 这就是响应式。</p><h2 id="常见坑-真实踩坑记录" tabindex="-1">常见坑（真实踩坑记录） <a class="header-anchor" href="#常见坑-真实踩坑记录" aria-label="Permalink to &quot;常见坑（真实踩坑记录）&quot;">​</a></h2><ul><li><strong>忘记 <code>.value</code></strong>：<code>count + 1</code> 拿到的是 NaN（count 是 Ref 对象）。</li><li><strong>模板里写 <code>.value</code></strong>：模板自动解包，写 <code>&amp;#123;&amp;#123; count.value }}</code> 反而报错。</li><li><strong><code>reactive</code> 整体替换</strong>：<code>state = { ...newObj }</code> 直接把响应式代理扔掉了；要么改属性，要么改用 <code>ref</code>。</li><li><strong>解构 reactive</strong>：见上文 <code>toRefs</code>。</li><li><strong>顶层 await</strong>：<code>&lt;script setup&gt;</code> 顶层 <code>await</code> 会把组件变成异步组件，需要 <code>&lt;Suspense&gt;</code> 包裹（见第 7 章）——沙箱根组件没有 Suspense，请不要在 App.vue 顶层使用。</li></ul><hr><h2 id="源码参考" tabindex="-1">源码参考 <a class="header-anchor" href="#源码参考" aria-label="Permalink to &quot;源码参考&quot;">​</a></h2><ul><li>特性目录：<a href="https://github.com/YZhiJie/vue3-features-lab/tree/main/src/features/01-composition-api" target="_blank" rel="noreferrer"><code>src/features/01-composition-api/</code></a></li></ul>`,20))])}}});export{v as __pageData,f as default};
