import{C as o,o as r,c as p,j as n,a as e,E as c,a2 as l}from"./chunks/framework.CE7vFz40.js";const d=`<script setup lang="ts">
/**
 * 练习：Pinia 状态管理（沙箱内集成）
 *
 * 设计决策：
 * - 沙箱没有 createApp 入口，无法 app.use(pinia)，所以用
 *   setActivePinia(createPinia()) 手动激活 —— useStore 在 inject 失败时
 *   会回落到 active pinia（Pinia 内置兜底）。生产项目直接 app.use(pinia)，
 *   不要这样写。
 * - 文件列表里附带 import-map.json（编辑器中隐藏）：让 pinia 与沙箱
 *   内置 vue 解析到同一实例 —— 否则双 Vue 实例会导致改 state 视图
 *   不更新（原理详见左侧文档「import-map.json」一节）。
 *
 * TODO 清单：
 *   TODO(1) getters：double 与 quad（quad 依赖 double）
 *   TODO(2) actions：increment(step) 与 reset()
 *   TODO(3) $patch 批量修改按钮
 *   TODO(4) storeToRefs 解构，替换 counter.count 直取
 */
import { createPinia, defineStore, setActivePinia } from "pinia";

/* ── 沙箱专用引导：必须在 defineStore / useStore 之前执行 ── */
setActivePinia(createPinia());

const useCounterStore = defineStore("counter", {
  // state 必须是函数，返回初始对象（工厂函数保证每次实例拿到全新状态）
  state: () => ({
    count: 0,
    logs: [] as string[], // 类型断言声明数组元素类型
  }),
  // TODO(1): getters ——
  //   double: (state) => state.count * 2
  //   quad(): number { return this.double * 2 }   // 访问其他 getter 用 this（普通方法，别用箭头函数）
  // TODO(2): actions ——
  //   increment(step = 1)：count 加 step，并 this.logs.unshift(\`increment(\${step}) → \${this.count}\`)
  //   reset()：调用 this.$reset()（Options 仓库专属），再 unshift 一条 'reset → 0'
});

const counter = useCounterStore();

/* TODO(4): 用 storeToRefs(counter) 解构出 count / double / quad（保持响应式），
 *          然后把模板里的 counter.count / counter.double / counter.quad
 *          换成解构出来的 ref。直接 const { count } = counter 是快照，会丢响应式！
 *          注意：storeToRefs 需要 import { storeToRefs } from 'pinia'。 */
<\/script>

<template>
  <section class="pinia-lab">
    <h2>🍍 Pinia 状态管理</h2>

    <div class="readout">
      <p>
        count：<strong>{{ counter.count }}</strong>
      </p>
      <p>
        double（getter）：<strong>{{ counter.double }}</strong>
      </p>
      <p>
        quad（getter 链）：<strong>{{ counter.quad }}</strong>
      </p>
      <!-- 沙箱没有 devtools，用 logs 数组当「变更日志」 -->
      <p class="muted">
        最近变更：{{ counter.logs.slice(0, 3).join(" | ") || "（暂无）" }}
      </p>
    </div>

    <div class="actions">
      <!-- ① 直接改 state：Pinia 允许（不像 Vuex 需要 mutation） -->
      <button @click="counter.count++">直接改 state +1</button>

      <!-- TODO(2): action 按钮 —— @click="counter.increment(5)" / @click="counter.reset()" -->
      <button>increment(5)（TODO(2)）</button>
      <button>reset（TODO(2)）</button>

      <!-- TODO(3): $patch 批量修改 —— 一次点击把 count 改到 100 并 unshift 一条 log。
           对象形式：counter.$patch({ count: 100, logs: [...] })
           函数形式：counter.$patch((state) => { ... }) -->
      <button>$patch 批量修改（TODO(3)）</button>
    </div>

    <p class="tip">
      完成后对照参考答案：storeToRefs 解构 + $subscribe 变更订阅。
    </p>
  </section>
</template>

<style scoped>
.pinia-lab {
  max-width: 480px;
  margin: 24px auto;
  padding: 20px;
  display: grid;
  gap: 14px;
  font-family: sans-serif;
}
.pinia-lab h2 {
  margin: 0;
}
.readout {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 12px;
  display: grid;
  gap: 6px;
}
.readout p {
  margin: 0;
  font-size: 13px;
  color: #55636d;
}
.readout strong {
  font-variant-numeric: tabular-nums;
  color: #33a06f;
}
.muted {
  font-size: 12px;
  color: #8fa0ab;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.actions button {
  padding: 6px 12px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
  font-size: 13px;
}
.actions button:hover {
  border-color: #42b883;
  color: #33a06f;
}
.tip {
  margin: 0;
  font-size: 12px;
  color: #8fa0ab;
}
</style>
`,u=`<script setup lang="ts">
/**
 * 参考答案：Pinia 状态管理（沙箱内集成）
 *
 * 相比练习版补充：
 * 1. getters 完整实现：double（箭头函数）+ quad（普通方法访问 this.double）；
 * 2. actions：increment / reset（this.$reset 是 Options 仓库专属）；
 * 3. storeToRefs 解构 count/double/quad —— actions 仍用 counter.xxx() 调用；
 * 4. $patch 对象形式与函数形式、$subscribe 变更订阅（持久化/埋点位置）。
 *
 * 坑点说明：
 * - setActivePinia 必须在 defineStore/useStore 之前（沙箱无 app 入口，
 *   inject 失败后靠 active pinia 兜底）；
 * - 直接解构 store 会丢响应式，必须 storeToRefs（actions 不需要包装）。
 */
import { createPinia, defineStore, setActivePinia, storeToRefs } from 'pinia'

/* ── 沙箱专用引导：必须在 defineStore / useStore 之前执行 ── */
setActivePinia(createPinia())

const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    logs: [] as string[],
  }),
  getters: {
    // 箭头函数 getter：第一个参数是 state（此时拿不到 this）
    double: (state) => state.count * 2,
    // 普通方法 getter：可以通过 this 访问其他 getter（返回类型要显式标注）
    quad(): number {
      return this.double * 2
    },
  },
  actions: {
    increment(step = 1) {
      this.count += step
      this.logs.unshift(\`increment(\${step}) → \${this.count}\`)
    },
    reset() {
      // $reset：一键恢复初始 state —— Options 式仓库专属能力
      this.$reset()
      this.logs.unshift('reset → 0')
    },
  },
})

const counter = useCounterStore()

// storeToRefs：解构 state/getters 且保持响应式（等价于一批 toRefs）。
// actions 是函数不依赖响应式包装，直接 counter.increment(5) 调用即可。
const { count, double, quad } = storeToRefs(counter)

// $subscribe：订阅仓库的任意 state 变化（真实项目常用于持久化 / 埋点）
counter.$subscribe((_mutation, state) => {
  console.log('[pinia] state 变更：count =', state.count)
})

/* $patch 对象形式：多个字段一次提交，devtools 里只记一条 */
function patchObject() {
  counter.$patch({
    count: 100,
    logs: ['（$patch 对象）count → 100', ...counter.logs],
  })
}

/* $patch 函数形式：基于现值修改（数组 push 等场景更顺手），
   多次变更合并为一次订阅通知 */
function patchFunction() {
  counter.$patch((state) => {
    state.count += 5
    state.logs.unshift('（$patch 函数）count +5')
  })
}

/* 直接改 state：Pinia 允许（不用 Vuex 的 mutation），最简单的写法 */
function direct() {
  counter.logs.unshift('（直接改）count +1')
  counter.count += 1
}
<\/script>

<template>
  <section class="pinia-lab">
    <h2>🍍 Pinia 状态管理</h2>

    <div class="readout">
      <!-- 解构自 storeToRefs 的 ref：模板自动解包，不用 .value -->
      <p>count：<strong>{{ count }}</strong></p>
      <p>double（getter）：<strong>{{ double }}</strong></p>
      <p>quad（getter 链）：<strong>{{ quad }}</strong></p>
      <p class="muted">最近变更：{{ counter.logs.slice(0, 3).join(' | ') || '（暂无）' }}</p>
    </div>

    <div class="actions">
      <button @click="direct">直接改 state +1</button>
      <button @click="counter.increment(5)">increment(5)</button>
      <button @click="counter.reset">reset</button>
      <button @click="patchObject">$patch 对象</button>
      <button @click="patchFunction">$patch 函数</button>
    </div>

    <p class="tip">
      打开预览下方 Console：$subscribe 会在每次 state 变更时输出日志。
    </p>
  </section>
</template>

<style scoped>
.pinia-lab {
  max-width: 480px;
  margin: 24px auto;
  padding: 20px;
  display: grid;
  gap: 14px;
  font-family: sans-serif;
}
.pinia-lab h2 {
  margin: 0;
}
.readout {
  border: 1px solid #d8efe4;
  border-radius: 10px;
  padding: 12px;
  display: grid;
  gap: 6px;
  background: #f7fcf9;
}
.readout p {
  margin: 0;
  font-size: 13px;
  color: #55636d;
}
.readout strong {
  font-variant-numeric: tabular-nums;
  color: #33a06f;
}
.muted {
  font-size: 12px;
  color: #8fa0ab;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.actions button {
  padding: 6px 12px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
  font-size: 13px;
}
.actions button:hover {
  border-color: #42b883;
  color: #33a06f;
}
.tip {
  margin: 0;
  font-size: 12px;
  color: #8fa0ab;
}
</style>
`,f=JSON.parse('{"title":"11 Pinia 状态管理","description":"在沙箱里用 setActivePinia 引导 Pinia 4：options 式仓库、$patch、storeToRefs、同源 CDN 实例一次讲清。","frontmatter":{"title":"11 Pinia 状态管理","description":"在沙箱里用 setActivePinia 引导 Pinia 4：options 式仓库、$patch、storeToRefs、同源 CDN 实例一次讲清。","tags":["pinia","状态管理","setActivePinia","storeToRefs"]},"headers":[],"relativePath":"features/11-pinia-integration.md","filePath":"features/11-pinia-integration.md","lastUpdated":1792665939000}'),h={name:"features/11-pinia-integration.md"},E=Object.assign(h,{setup(k){const s={"App.vue":d},i={"App.vue":u};return(g,t)=>{const a=o("Playground");return r(),p("div",null,[t[0]||(t[0]=n("h1",{id:"pinia-状态管理",tabindex:"-1"},[e("Pinia 状态管理 "),n("a",{class:"header-anchor",href:"#pinia-状态管理","aria-label":'Permalink to "Pinia 状态管理"'},"​")],-1)),t[1]||(t[1]=n("blockquote",null,[n("p",null,[n("strong",null,"Pinia 4 · 沙箱内集成"),e(" · 难度：进阶 · 引入版本：Pinia 4")])],-1)),t[2]||(t[2]=n("div",{class:"feature-summary"},"在沙箱里用 setActivePinia 引导 Pinia 4：options 式仓库、$patch、storeToRefs、同源 CDN 实例一次讲清。",-1)),c(a,{starter:s,solution:i}),t[3]||(t[3]=l(`<hr><h1 id="pinia-状态管理-沙箱内集成" tabindex="-1">Pinia 状态管理（沙箱内集成） <a class="header-anchor" href="#pinia-状态管理-沙箱内集成" aria-label="Permalink to &quot;Pinia 状态管理（沙箱内集成）&quot;">​</a></h1><h2 id="这是什么" tabindex="-1">这是什么 <a class="header-anchor" href="#这是什么" aria-label="Permalink to &quot;这是什么&quot;">​</a></h2><p>Pinia 是 Vue 官方推荐的状态管理库。生产项目里它通过 <code>app.use(pinia)</code> 挂到应用上；本沙箱拿不到 <code>createApp</code> 入口，所以用 <code>setActivePinia(createPinia())</code> 手动激活 —— 之后 <code>defineStore</code> 创建的仓库 在 <code>useStore()</code> 时会先尝试 <code>inject</code> 应用上注册的 pinia，失败后回落到 <strong>active pinia</strong>（Pinia 的内置兜底逻辑）。</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { createPinia, defineStore, setActivePinia } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;pinia&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 沙箱专用引导：没有 app.use(pinia)，必须手动设置 active pinia</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setActivePinia</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">createPinia</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">())</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> useCounterStore</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> defineStore</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;counter&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  state</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ({ count: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  getters: { </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">double</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">state</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> state.count </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  actions: { </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">increment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">step</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.count </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> step } },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><h2 id="本特性的-import-map-json-为什么-vue-和-pinia-必须同源" tabindex="-1">本特性的 import-map.json：为什么 vue 和 pinia 必须同源 <a class="header-anchor" href="#本特性的-import-map-json-为什么-vue-和-pinia-必须同源" aria-label="Permalink to &quot;本特性的 import-map.json：为什么 vue 和 pinia 必须同源&quot;">​</a></h2><p>本特性的文件列表里多了一个特殊文件 <code>import-map.json</code>（编辑器里被隐藏）， 它是沙箱的模块解析表 —— 与 Vue 官方 SFC Playground 的机制完全一致：</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;imports&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;vue&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;https://cdn.jsdelivr.net/npm/@vue/runtime-dom@3.5.42/dist/runtime-dom.esm-browser.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;pinia&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;https://esm.sh/pinia@4.0.3?external=vue&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>原因：pinia 是从 esm.sh 加载的独立模块，它内部也要 <code>import &#39;vue&#39;</code>。 默认情况下 esm.sh 会帮它解析成「esm.sh 自己的 vue」，与沙箱内置的 jsdelivr vue 构成<strong>两个不同的模块实例</strong>，页面里同时存在两个 Vue 运行时：</p><ul><li>store 里的 ref/effect 与组件用的不是同一套响应式系统 → <strong>改 state 视图不更新</strong>（响应式失效）；</li><li>还可能伴随 &quot;Invalid VNode type&quot; 之类的诡异报错。</li></ul><p>修复思路是让两边解析到<strong>同一个实例</strong>：</p><ul><li><code>?external=vue</code> 告诉 esm.sh「不要帮我解析 vue，保留裸导入」；</li><li>于是 pinia 里的 <code>import &quot;vue&quot;</code> 回到沙箱的 import map， 与应用代码解析到同一个 jsdelivr vue。</li></ul><p>这也是真实项目的经典问题：monorepo 或多份打包产物里 vue 被装了两份， 症状一模一样（对应 pnpm 的 <code>pnpm dedupe</code>、bundler 的 <code>resolve.alias</code>）。</p><h2 id="核心-api-速览" tabindex="-1">核心 API 速览 <a class="header-anchor" href="#核心-api-速览" aria-label="Permalink to &quot;核心 API 速览&quot;">​</a></h2><table tabindex="0"><thead><tr><th>API</th><th>用途</th><th>关键点</th></tr></thead><tbody><tr><td><code>defineStore(id, { state, getters, actions })</code></td><td>Options 式仓库定义</td><td>state 必须是返回初始对象的函数</td></tr><tr><td><code>useCounterStore()</code></td><td>拿到仓库实例</td><td>是 reactive 代理，模板里可直接用</td></tr><tr><td><code>storeToRefs(store)</code></td><td>解构 state/getters 并保持响应式</td><td>actions 是函数，直接 <code>store.xxx()</code> 调用</td></tr><tr><td><code>store.$patch({...})</code></td><td>批量修改（对象形式）</td><td>适合一次改多个字段</td></tr><tr><td><code>store.$patch((s) =&gt; {...})</code></td><td>批量修改（函数形式）</td><td>适合基于现值的修改（数组 push 等），多次变更合并为一次通知</td></tr><tr><td><code>store.$reset()</code></td><td>恢复初始 state</td><td>Options 式仓库专属</td></tr><tr><td><code>store.$subscribe(fn)</code></td><td>订阅任意 state 变化</td><td>常用于持久化 / 埋点（参考答案演示）</td></tr></tbody></table><h2 id="动手试" tabindex="-1">动手试 <a class="header-anchor" href="#动手试" aria-label="Permalink to &quot;动手试&quot;">​</a></h2><ol><li>TODO(1) 补全 getters：<code>double</code> 与 <code>quad</code>（quad 依赖 double， 体验 getter 之间的依赖链）</li><li>TODO(2) 补全 actions：<code>increment(step)</code>（count 加 step 并写一条 log） 与 <code>reset()</code>（用 <code>this.$reset()</code>）</li><li>TODO(3) 实现「$patch 批量修改」按钮：一次把 count 改到 100 并写一条 log（试试对象形式与函数形式各写一个）</li><li>TODO(4) 用 <code>storeToRefs(counter)</code> 解构 count / double， 替换模板里的 <code>counter.count</code> 直取</li><li>参考答案还演示了：直接改 state 与 action 的对比、$patch 两种形式、 $subscribe 变更订阅</li></ol><h2 id="常见坑-真实踩坑记录" tabindex="-1">常见坑（真实踩坑记录） <a class="header-anchor" href="#常见坑-真实踩坑记录" aria-label="Permalink to &quot;常见坑（真实踩坑记录）&quot;">​</a></h2><ul><li><strong>忘记 setActivePinia</strong>：报 &quot;getActivePinia was called with no active Pinia&quot;。沙箱 / 测试环境（vitest 单测同理）没有 <code>app.use(pinia)</code>， 必须手动激活，而且要在 <code>defineStore</code> / <code>useStore</code> 之前。</li><li><strong>双 Vue 实例 → 响应式静默失效</strong>：import map 里 vue 与 pinia 的依赖 版本不一致时页面不报错，但 state 改了视图不动 —— 最阴险的一类 bug。 自检方法：<code>console.log(useStore().$state)</code> 有值但不刷新，基本就是双实例。</li><li><strong>解构丢响应式</strong>：<code>const { count } = store</code> 拿到的是当时的快照数字， 不会随 store 更新；必须 <code>const { count } = storeToRefs(store)</code>。 actions 直接解构没问题（函数不依赖响应式包装）。</li><li><strong>getter 里拿不到 this</strong>：箭头函数 getter <code>(state) =&gt; ...</code> 只能看到 state；要访问其他 getter 就写成普通方法用 <code>this</code>，并且显式标注返回类型。</li><li><strong>$reset 是 Options 仓库专属</strong>：setup 式 defineStore（传入函数的那种） 没有 <code>$reset</code>，需要自己写 reset action。</li><li><strong>$patch 函数形式才是数组的好姿势</strong>：直接 <code>state.list.push(x)</code> 也行 （Pinia 允许直接改 state），但 $patch 函数形式能把多次变更合并成 一次通知，devtools 里的记录也更干净。</li></ul><hr><h2 id="源码参考" tabindex="-1">源码参考 <a class="header-anchor" href="#源码参考" aria-label="Permalink to &quot;源码参考&quot;">​</a></h2><ul><li>特性目录：<a href="https://github.com/YZhiJie/vue3-features-lab/tree/main/src/features/11-pinia-integration" target="_blank" rel="noreferrer"><code>src/features/11-pinia-integration/</code></a></li></ul>`,22))])}}});export{f as __pageData,E as default};
