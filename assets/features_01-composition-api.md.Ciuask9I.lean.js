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
`,v=JSON.parse('{"title":"01 组合式 API 入门","description":"用 ref / reactive / computed / onMounted 从零搭一个迷你购物车，体会响应式从无到有。","frontmatter":{"title":"01 组合式 API 入门","description":"用 ref / reactive / computed / onMounted 从零搭一个迷你购物车，体会响应式从无到有。","tags":["ref","reactive","computed","onMounted"]},"headers":[],"relativePath":"features/01-composition-api.md","filePath":"features/01-composition-api.md","lastUpdated":1792665939000}'),u={name:"features/01-composition-api.md"},f=Object.assign(u,{setup(k){const i={"App.vue":c},s={"App.vue":h};return(g,t)=>{const a=o("Playground");return l(),r("div",null,[t[0]||(t[0]=n("h1",{id:"组合式-api-入门",tabindex:"-1"},[e("组合式 API 入门 "),n("a",{class:"header-anchor",href:"#组合式-api-入门","aria-label":'Permalink to "组合式 API 入门"'},"​")],-1)),t[1]||(t[1]=n("blockquote",null,[n("p",null,[n("strong",null,"Composition API · <script setup>"),e(" · 难度：入门 · 引入版本：Vue 3.0")])],-1)),t[2]||(t[2]=n("div",{class:"feature-summary"},"用 ref / reactive / computed / onMounted 从零搭一个迷你购物车，体会响应式从无到有。",-1)),p(a,{starter:i,solution:s}),t[3]||(t[3]=d("",20))])}}});export{v as __pageData,f as default};
