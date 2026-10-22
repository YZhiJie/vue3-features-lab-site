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
`,f=JSON.parse('{"title":"11 Pinia 状态管理","description":"在沙箱里用 setActivePinia 引导 Pinia 4：options 式仓库、$patch、storeToRefs、同源 CDN 实例一次讲清。","frontmatter":{"title":"11 Pinia 状态管理","description":"在沙箱里用 setActivePinia 引导 Pinia 4：options 式仓库、$patch、storeToRefs、同源 CDN 实例一次讲清。","tags":["pinia","状态管理","setActivePinia","storeToRefs"]},"headers":[],"relativePath":"features/11-pinia-integration.md","filePath":"features/11-pinia-integration.md","lastUpdated":1792665939000}'),h={name:"features/11-pinia-integration.md"},E=Object.assign(h,{setup(k){const s={"App.vue":d},i={"App.vue":u};return(g,t)=>{const a=o("Playground");return r(),p("div",null,[t[0]||(t[0]=n("h1",{id:"pinia-状态管理",tabindex:"-1"},[e("Pinia 状态管理 "),n("a",{class:"header-anchor",href:"#pinia-状态管理","aria-label":'Permalink to "Pinia 状态管理"'},"​")],-1)),t[1]||(t[1]=n("blockquote",null,[n("p",null,[n("strong",null,"Pinia 4 · 沙箱内集成"),e(" · 难度：进阶 · 引入版本：Pinia 4")])],-1)),t[2]||(t[2]=n("div",{class:"feature-summary"},"在沙箱里用 setActivePinia 引导 Pinia 4：options 式仓库、$patch、storeToRefs、同源 CDN 实例一次讲清。",-1)),c(a,{starter:s,solution:i}),t[3]||(t[3]=l("",22))])}}});export{f as __pageData,E as default};
