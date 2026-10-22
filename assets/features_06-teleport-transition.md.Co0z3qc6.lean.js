import{C as s,o as l,c as r,j as t,a as e,E as d,a2 as p}from"./chunks/framework.CE7vFz40.js";const c=`<script setup lang="ts">
/**
 * 练习：传送门与过渡动画 —— 弹窗 + 可增删的待办列表
 *
 * 交互逻辑（开关弹窗 / 增删 / 打乱）已全部写好，你的任务全在「包一层」：
 *   TODO(1) 给模态框包 <Teleport to="body"> —— 打开后看 DOM：节点跑到 body 末尾
 *   TODO(2) 给模态框包 <Transition name="modal">，并在 <style> 里补全 .modal-* 六件套
 *   TODO(3) 把列表 <ul> 换成 <TransitionGroup name="list" tag="ul">，补全 .list-* class
 *
 * 设计决策：
 * - 弹窗初始为 false、列表初始有 3 条：保证 starter 渲染零报错，
 *   动画类补全与否都不影响功能（动画是「锦上添花」的最后一层）；
 * - 沙箱的 <Teleport to="body"> 传送到的是预览 iframe 的 body，可用；
 * - 打乱按钮用洗牌而不是排序，是为了让 TransitionGroup 的 move 动画更直观；
 * - ul 已设 position: relative、li 已有背景色：为 leave-active 的
 *   position:absolute 补位方案做好地基（见 style 里的注释）。
 *
 * 坑点提醒：
 * - TransitionGroup 的每一项必须给稳定唯一的 :key（本例用业务 id，别换下标）；
 * - .list-leave-active 配 position:absolute 才能让其它项平滑补位；
 * - scoped 样式对 Teleport 传送走的元素依然生效（data 属性跟着节点走）。
 */
import { ref } from 'vue'

/* ───────── 弹窗（TODO 1/2 的主角） ───────── */
const showModal = ref(false)

/* ───────── 待办列表（TODO 3 的主角） ───────── */
interface Todo {
  id: number
  text: string
}
let uid = 4
const todos = ref<Todo[]>([
  { id: 1, text: '读完 feature.md 讲解' },
  { id: 2, text: '补全 starter 里的 TODO' },
  { id: 3, text: '对照 solution 检查' },
])
const newText = ref('')

function addTodo() {
  const text = newText.value.trim()
  if (!text) return
  todos.value.push({ id: uid++, text })
  newText.value = ''
}
function removeTodo(id: number) {
  todos.value = todos.value.filter((t) => t.id !== id)
}
function shuffle() {
  todos.value = [...todos.value].sort(() => Math.random() - 0.5)
}
<\/script>

<template>
  <section class="tt">
    <h2>🚪 传送门与过渡动画</h2>

    <div class="block">
      <h3>① Teleport + Transition：模态框</h3>
      <button class="primary" @click="showModal = true">打开模态框</button>

      <!-- TODO(1): 用 <Teleport to="body"> 把下面整个弹窗包起来 -->
      <!-- TODO(2): 再用 <Transition name="modal"> 包住 v-if 的遮罩层 -->
      <div v-if="showModal" class="mask" @click.self="showModal = false">
        <div class="dialog">
          <h3>我是一个模态框</h3>
          <p>我原本长在 App 的组件树里，被 Teleport 传送到了 body 末尾。</p>
          <button @click="showModal = false">关闭</button>
        </div>
      </div>
    </div>

    <div class="block">
      <h3>② TransitionGroup：列表增删与移动</h3>
      <form class="row" @submit.prevent="addTodo">
        <input v-model="newText" placeholder="新待办，回车添加" />
        <button type="submit">添加</button>
        <button type="button" @click="shuffle">打乱顺序</button>
      </form>

      <!-- TODO(3): 把 <ul> 换成 <TransitionGroup name="list" tag="ul"> -->
      <ul class="todo-list">
        <li v-for="todo in todos" :key="todo.id">
          {{ todo.text }}
          <button class="del" @click="removeTodo(todo.id)">×</button>
        </li>
      </ul>
      <p class="tip">提示：完成后添加 / 删除 / 打乱，列表项都会带着动画进出与补位。</p>
    </div>
  </section>
</template>

<style scoped>
/* 基础样式已就绪；动画 class 见下方 TODO 注释 */

/* TODO(2): 补全模态框动画六件套
 *   .modal-enter-active / .modal-leave-active  → 过渡时长与属性（遮罩透明度）
 *   .modal-enter-from   / .modal-leave-to      → 透明度 0 作为起点 / 终点
 *   弹窗卡片的上浮可以挂在 .mask 的子选择器上，如：
 *   .modal-enter-active .dialog { transition: transform …; }
 *   .modal-enter-from   .dialog { transform: translateY(16px) scale(0.96); }
 *   （enter-to / leave-from 可省略——默认就是最终状态，初学建议写全）
 */
/* TODO(3): 补全列表动画
 *   .list-enter-active / .list-leave-active / .list-move
 *   .list-enter-from   / .list-leave-to
 *   记得给 .list-leave-active 加 position: absolute（配合 .list-move 补位）；
 *   ul 已设置 position: relative 作为定位基准。
 */

.tt {
  max-width: 400px;
  margin: 24px auto;
  padding: 20px;
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  display: grid;
  gap: 18px;
  font-family: sans-serif;
}
.tt h2 {
  margin: 0;
  font-size: 17px;
}
.block {
  display: grid;
  gap: 10px;
}
.block h3 {
  margin: 0;
  font-size: 14px;
  color: #61707a;
}
.block button {
  padding: 5px 12px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
}
.block button:hover {
  border-color: #42b883;
  color: #33a06f;
}
.block button.primary {
  background: #42b883;
  border-color: #42b883;
  color: #fff;
}
.row {
  display: flex;
  gap: 8px;
}
.row input {
  flex: 1;
  padding: 5px 10px;
  border: 1px solid #d8e0e5;
  border-radius: 6px;
}

/* 模态框基础样式（TODO 1 完成后它会出现在 body 末尾，样式不受影响） */
.mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 34, 43, 0.45);
  display: grid;
  place-items: center;
  z-index: 50;
}
.dialog {
  background: #fff;
  border-radius: 12px;
  padding: 22px 26px;
  max-width: 320px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  display: grid;
  gap: 10px;
}
.dialog h3 {
  margin: 0;
  font-size: 15px;
}
.dialog p {
  margin: 0;
  font-size: 13px;
  color: #4a5a64;
}
.dialog button {
  justify-self: start;
}

/* 列表基础样式：relative 是 leave-active 绝对定位的基准 */
.todo-list {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
}
.todo-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f5f7f8;
  border-radius: 6px;
  font-size: 13px;
}
.todo-list .del {
  padding: 0 8px;
  line-height: 20px;
}
.tip {
  margin: 0;
  color: #8fa0ab;
  font-size: 12px;
}
</style>
`,u=`<script setup lang="ts">
/**
 * 参考答案：传送门与过渡动画
 *
 * 相比练习版补充了：
 * 1. <Teleport to="body"> + <Transition name="modal"> 完整模态框（遮罩淡入 + 卡片上浮）
 * 2. <TransitionGroup> 列表动画：入场滑入、离场滑出 + absolute 补位、.list-move 平移
 * 3. 加分演示 1：mode="out-in" 的双面板切换（旧面板先走完，新的再进）
 * 4. 加分演示 2：TransitionGroup 的 appear（首次渲染的 3 条也播放入场动画）
 *
 * 为什么这么写：
 * - 卡片上浮挂在 .modal-enter-from .dialog 这类「后代选择器」上：
 *   遮罩淡入（opacity）与卡片上浮（transform）是两套属性，各管各的，
 *   一组 name 触发两层动画，比拆两个 Transition 简洁；
 * - .list-leave-active 配 position:absolute + width:100%：被删项脱离文档流，
 *   其它项立刻开始补位（.list-move 的 FLIP 动画），视觉上才连贯；
 * - 双面板用 v-if / v-else + 不同 key：Transition 靠 key 区分新旧元素；
 *   同标签分支不加 key 会复用 DOM，out-in 直接失效。
 * - 没有现场演示 <Teleport defer>（Vue 3.5）：它解决的是「目标容器晚于
 *   内容渲染」的时序问题，而我们的目标 body 永远先存在，演示不出差异，
 *   详见 feature.md 的表格与坑点。
 */
import { ref } from "vue";

/* ───────── 弹窗 ───────── */
const showModal = ref(false);

/* ───────── 待办列表 ───────── */
interface Todo {
  id: number;
  text: string;
}
let uid = 4;
const todos = ref<Todo[]>([
  { id: 1, text: "读完 feature.md 讲解" },
  { id: 2, text: "补全 starter 里的 TODO" },
  { id: 3, text: "对照 solution 检查" },
]);
const newText = ref("");

function addTodo() {
  const text = newText.value.trim();
  if (!text) return;
  todos.value.push({ id: uid++, text });
  newText.value = "";
}
function removeTodo(id: number) {
  todos.value = todos.value.filter((t) => t.id !== id);
}
function shuffle() {
  todos.value = [...todos.value].sort(() => Math.random() - 0.5);
}

/* ───────── 加分演示：mode="out-in" 面板切换 ───────── */
const tab = ref<"a" | "b">("a");
<\/script>

<template>
  <section class="tt">
    <h2>🚪 传送门与过渡动画</h2>

    <div class="block">
      <h3>① Teleport + Transition：模态框</h3>
      <button class="primary" @click="showModal = true">打开模态框</button>

      <!-- Teleport：渲染到预览 iframe 的 body 末尾，脱离本组件的层叠上下文 -->
      <Teleport to="body">
        <!-- Transition：进出场时自动挂摘 .modal-* 六件套 -->
        <Transition name="modal">
          <div v-if="showModal" class="mask" @click.self="showModal = false">
            <div class="dialog">
              <h3>我是一个模态框</h3>
              <p>我原本长在 App 的组件树里，被 Teleport 传送到了 body 末尾。</p>
              <button @click="showModal = false">关闭</button>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>

    <div class="block">
      <h3>② TransitionGroup：列表增删与移动</h3>
      <form class="row" @submit.prevent="addTodo">
        <input v-model="newText" placeholder="新待办，回车添加" />
        <button type="submit">添加</button>
        <button type="button" @click="shuffle">打乱顺序</button>
      </form>

      <!-- appear：首次渲染的 3 条也播放入场动画（加分演示） -->
      <TransitionGroup name="list" tag="ul" class="todo-list" appear>
        <li v-for="todo in todos" :key="todo.id">
          {{ todo.text }}
          <button class="del" @click="removeTodo(todo.id)">×</button>
        </li>
      </TransitionGroup>
      <p class="tip">添加 / 删除 / 打乱试试：进出是滑动，移动是 FLIP 补位。</p>
    </div>

    <div class="block">
      <h3>③ 加分：mode="out-in" 面板切换</h3>
      <div class="row">
        <button :class="{ on: tab === 'a' }" @click="tab = 'a'">面板 A</button>
        <button :class="{ on: tab === 'b' }" @click="tab = 'b'">面板 B</button>
      </div>
      <!-- 同标签的两个分支必须给不同 key，Transition 才认得出新旧 -->
      <Transition name="fade" mode="out-in">
        <p v-if="tab === 'a'" key="a" class="pane">面板 A：out-in 保证旧面板先走完，新的再进，不会叠在一起闪。</p>
        <p v-else key="b" class="pane">面板 B：如果去掉 mode，两个面板会同帧交叉淡入淡出。</p>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.tt {
  max-width: 400px;
  margin: 24px auto;
  padding: 20px;
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  display: grid;
  gap: 18px;
  font-family: sans-serif;
}
.tt h2 {
  margin: 0;
  font-size: 17px;
}
.block {
  display: grid;
  gap: 10px;
}
.block h3 {
  margin: 0;
  font-size: 14px;
  color: #61707a;
}
.block button {
  padding: 5px 12px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
}
.block button:hover {
  border-color: #42b883;
  color: #33a06f;
}
.block button.primary {
  background: #42b883;
  border-color: #42b883;
  color: #fff;
}
.block button.on {
  border-color: #42b883;
  color: #33a06f;
}
.row {
  display: flex;
  gap: 8px;
}
.row input {
  flex: 1;
  padding: 5px 10px;
  border: 1px solid #d8e0e5;
  border-radius: 6px;
}

/* ───── 模态框动画六件套（name="modal"）───── */
/* 遮罩：opacity 淡入淡出 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
/* 卡片：transform 上浮（挂后代选择器，遮罩与卡片两层动画共用一组 name） */
.modal-enter-active .dialog,
.modal-leave-active .dialog {
  transition: transform 0.25s ease;
}
.modal-enter-from .dialog,
.modal-leave-to .dialog {
  transform: translateY(16px) scale(0.96);
}

/* 模态框基础样式 */
.mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 34, 43, 0.45);
  display: grid;
  place-items: center;
  z-index: 50;
}
.dialog {
  background: #fff;
  border-radius: 12px;
  padding: 22px 26px;
  max-width: 320px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  display: grid;
  gap: 10px;
}
.dialog h3 {
  margin: 0;
  font-size: 15px;
}
.dialog p {
  margin: 0;
  font-size: 13px;
  color: #4a5a64;
}
.dialog button {
  justify-self: start;
}

/* ───── 列表动画六件套（name="list"）───── */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
/* 离场项脱离文档流：其它项立刻补位，.list-move 才能演出平滑平移 */
.list-leave-active {
  position: absolute;
  width: 100%;
}
/* FLIP 移动动画：列表项「换位置」时的补位平移 */
.list-move {
  transition: transform 0.3s ease;
}

/* 列表基础样式 */
.todo-list {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
}
.todo-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f5f7f8;
  border-radius: 6px;
  font-size: 13px;
}
.todo-list .del {
  padding: 0 8px;
  line-height: 20px;
}

/* ───── 面板切换动画（name="fade"）───── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pane {
  margin: 0;
  padding: 10px 12px;
  background: #eef7f2;
  border-radius: 6px;
  font-size: 13px;
  color: #2f6e52;
}
.tip {
  margin: 0;
  color: #8fa0ab;
  font-size: 12px;
}
</style>
`,k=JSON.parse('{"title":"06 传送门与过渡动画","description":"用 Teleport 把模态框送到 body 末尾，用 Transition / TransitionGroup 的 CSS class 六件套做出进出场与列表动画。","frontmatter":{"title":"06 传送门与过渡动画","description":"用 Teleport 把模态框送到 body 末尾，用 Transition / TransitionGroup 的 CSS class 六件套做出进出场与列表动画。","tags":["Teleport","Transition","TransitionGroup","mode"]},"headers":[],"relativePath":"features/06-teleport-transition.md","filePath":"features/06-teleport-transition.md","lastUpdated":1792665939000}'),h={name:"features/06-teleport-transition.md"},b=Object.assign(h,{setup(g){const o={"App.vue":c},i={"App.vue":u};return(m,n)=>{const a=s("Playground");return l(),r("div",null,[n[0]||(n[0]=t("h1",{id:"传送门与过渡动画",tabindex:"-1"},[e("传送门与过渡动画 "),t("a",{class:"header-anchor",href:"#传送门与过渡动画","aria-label":'Permalink to "传送门与过渡动画"'},"​")],-1)),n[1]||(n[1]=t("blockquote",null,[t("p",null,[t("strong",null,"Teleport / Transition / TransitionGroup"),e(" · 难度：进阶 · 引入版本：Vue 3.0 / 3.5 defer")])],-1)),n[2]||(n[2]=t("div",{class:"feature-summary"},"用 Teleport 把模态框送到 body 末尾，用 Transition / TransitionGroup 的 CSS class 六件套做出进出场与列表动画。",-1)),d(a,{starter:o,solution:i}),n[3]||(n[3]=p("",23))])}}});export{k as __pageData,b as default};
