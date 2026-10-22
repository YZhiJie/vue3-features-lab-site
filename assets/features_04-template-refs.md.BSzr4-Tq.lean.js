import{C as l,o as p,c as r,j as n,a as i,E as h,a2 as d}from"./chunks/framework.CE7vFz40.js";const k=`<script setup lang="ts">
/**
 * 练习：模板引用与 useTemplateRef（Vue 3.5）
 *
 * 三个小任务围绕「拿 DOM 元素」展开：
 *   TODO(1) 用 useTemplateRef 声明 inputEl，挂载后自动聚焦（加分：全选）
 *   TODO(2) 同样方式拿到 boxEl，实现「测量宽度」
 *   TODO(3) v-for 里用函数 ref 收集每个 <li>，实现点击高亮
 *
 * 设计决策：
 * - starter 里的旧写法 ref(null) 全部保留骨架（能跑但不干活），
 *   你把每一处换成 useTemplateRef('xxx') 并补全行为 —— 顺便对比两种写法；
 * - 函数 ref 的回调参数类型放得很宽（unknown）：模板里 ref 回调的实际类型
 *   是 Element | ComponentPublicInstance | null，教学里没必要展开。
 *
 * 坑点提醒：
 * - useTemplateRef 的参数必须和模板里 ref="..." 字符串一字不差，
 *   拼错不报错、只是拿到 undefined；
 * - ref 变量在 onMounted 之前是 null，v-if 控制的元素更要当心。
 */
import { onMounted, ref, useTemplateRef } from 'vue'

/* ───────── 1) 挂载后自动聚焦 ───────── */
// 旧写法（Vue 3.0 起）：变量名与模板 ref="inputEl" 同名建立关联
// TODO(1): 整行换成 const inputEl = useTemplateRef<HTMLInputElement>('inputEl')
const inputEl = ref<HTMLInputElement | null>(null)

// TODO(1): 在 onMounted 里调用 inputEl.value?.focus()
//   加分：再调用 .select() 全选已有文字
onMounted(() => {
  // 留空：补全我
})

/* ───────── 2) 读取元素宽度 ───────── */
// TODO(2): 换成 useTemplateRef('boxEl')，并实现 measure()
const boxEl = ref<HTMLElement | null>(null)
const boxWidth = ref(0)

function measure() {
  // 留空：补全我 —— offsetWidth 读的是「布局后的真实宽度」
}

/* ───────── 3) v-for 中的函数 ref ───────── */
const items = ['水星', '金星', '地球', '火星', '木星']

// TODO(3): 每次渲染时 Vue 都会用「元素 or null」调用这个函数：
//   el 非 null 时按索引收进 itemEls，为 null 时清掉对应槽位
const itemEls = ref<unknown[]>([])
function setItemRef(index: number, el: unknown) {
  // 留空：补全我
}

// TODO(3): 高亮第 index 项：先清掉所有 .picked，再给目标加 .picked
function highlight(index: number) {
  // 留空：补全我
}
<\/script>

<template>
  <section class="refs">
    <h2>🎯 模板引用与 useTemplateRef</h2>

    <!-- 1) 自动聚焦：完成 TODO(1) 后刷新预览，光标应直接落在这里 -->
    <div class="block">
      <h3>① 挂载后自动聚焦</h3>
      <input ref="inputEl" value="我会被自动聚焦并全选" />
      <p class="tip">完成 TODO(1) 后刷新预览，光标会自动落进输入框。</p>
    </div>

    <!-- 2) 读取布局信息 -->
    <div class="block">
      <h3>② 读取元素宽度</h3>
      <div ref="boxEl" class="box">我是被引用的盒子（宽度由内容决定）</div>
      <p>
        当前宽度：<strong>{{ boxWidth || '—' }}</strong> px
      </p>
      <button @click="measure">测量宽度</button>
    </div>

    <!-- 3) 函数 ref + v-for -->
    <div class="block">
      <h3>③ v-for 中的函数 ref</h3>
      <ul>
        <li v-for="(item, i) in items" :key="item" :ref="(el) => setItemRef(i, el)">
          {{ item }}
        </li>
      </ul>
      <div class="row">
        <button v-for="(item, i) in items" :key="item" @click="highlight(i)">
          高亮 {{ item }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.refs {
  max-width: 380px;
  margin: 24px auto;
  padding: 20px;
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  display: grid;
  gap: 16px;
  font-family: sans-serif;
}
.refs h2 {
  margin: 0;
  font-size: 17px;
}
.block {
  display: grid;
  gap: 8px;
}
.block h3 {
  margin: 0;
  font-size: 14px;
  color: #61707a;
}
.block input {
  padding: 6px 10px;
  border: 1px solid #d8e0e5;
  border-radius: 6px;
}
.block button {
  justify-self: start;
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
.box {
  padding: 10px 14px;
  background: #eef7f2;
  border: 1px solid #bfe3d2;
  border-radius: 6px;
  width: fit-content;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 4px;
}
li {
  padding: 6px 12px;
  background: #f5f7f8;
  border-radius: 6px;
  font-size: 13px;
}
/* TODO(3) 完成后生效：被高亮的项 */
li.picked {
  background: #42b883;
  color: #fff;
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tip {
  margin: 0;
  color: #8fa0ab;
  font-size: 12px;
}
</style>
`,o=`<script setup lang="ts">
/**
 * 参考答案：模板引用与 useTemplateRef（Vue 3.5）
 *
 * 相比练习版：
 * 1. 三处 ref 全部换成 useTemplateRef —— 一行声明 + 显式字符串 key，
 *    不再要求「变量名与 ref="..." 同名」的隐式约定；
 * 2. 自动聚焦额外演示 select() 全选；
 * 3. measure 挂载后自动执行一次，并注释了 offsetWidth 与
 *    getBoundingClientRect().width 的差别；
 * 4. 函数 ref：null 槽位清理（列表重渲染时 Vue 会先传 null 再传元素）；
 * 5. 加分演示：直接读 input 的原始 DOM 值 —— ref 给你的是 DOM 本身，
 *    没有响应式，读取时机完全在你自己手里。
 *
 * 为什么这么写：
 * - useTemplateRef 的类型参数只收「元素类型」，返回的浅 ref 默认就是
 *   XxxElement | null，比手写 ref<...>(null) 更省心；
 * - 函数 ref 用索引做 key 收集：本例列表是静态的所以安全；若列表会
 *   排序 / 增删，应改用 Map<item.id, el> 按 key 收集，避免错位；
 * - 高亮用 classList 直接操作 DOM（这正是模板 ref 的用武之地），
 *   同时维护 pickedIndex 用于界面提示，两头各司其职。
 */
import { onMounted, ref, useTemplateRef } from "vue";

/* ───────── 1) 挂载后自动聚焦 ───────── */
const inputEl = useTemplateRef<HTMLInputElement>("inputEl");

onMounted(() => {
  // DOM 已挂载，ref 一定非 null（仍用 ?. 保持习惯，防 v-if 场景）
  inputEl.value?.focus();
  inputEl.value?.select(); // 加分：聚焦顺便全选，方便直接改写
});

/* ───────── 2) 读取宽度 ───────── */
const boxEl = useTemplateRef<HTMLElement>("boxEl");
const boxWidth = ref(0);

function measure() {
  const el = boxEl.value;
  if (!el) return;
  // offsetWidth：四舍五入的整数，含 border；
  // getBoundingClientRect().width：小数精度，但受 transform 缩放影响
  boxWidth.value = el.offsetWidth;
}

/* ───────── 3) 函数 ref + v-for ───────── */
const items = ["水星", "金星", "地球", "火星", "木星"];
// 按索引收集；模板回调里的 null 表示「该槽位即将卸载 / 重建」
const itemEls = ref<HTMLElement[]>([]);

function setItemRef(index: number, el: unknown) {
  const li = el as HTMLElement | null;
  if (li) {
    itemEls.value[index] = li;
  } else {
    // 忘了清理会残留旧 DOM 引用：内存泄漏 + 高亮错位
    delete itemEls.value[index];
  }
}

const pickedIndex = ref(-1);
function highlight(index: number) {
  pickedIndex.value = index;
  // 先全清再加，保证「唯一高亮」语义
  itemEls.value.forEach((li) => li.classList.remove("picked"));
  itemEls.value[index]?.classList.add("picked");
}

/* ───────── 4) 加分演示：直接读 DOM（无响应式） ───────── */
const domValue = ref("");
function readDom() {
  // 不经过 v-model，直接读原始 DOM 值 —— 点按钮时才读一次
  domValue.value = inputEl.value?.value ?? "";
}
<\/script>

<template>
  <section class="refs">
    <h2>🎯 模板引用与 useTemplateRef</h2>

    <div class="block">
      <h3>① 挂载后自动聚焦</h3>
      <input ref="inputEl" value="我会被自动聚焦并全选" />
      <p class="tip">刷新预览，光标已自动落进输入框并全选。</p>
    </div>

    <div class="block">
      <h3>② 读取元素宽度</h3>
      <div ref="boxEl" class="box">我是被引用的盒子（宽度由内容决定）</div>
      <p>
        当前宽度：<strong>{{ boxWidth || '—' }}</strong> px
      </p>
      <button @click="measure">测量宽度</button>
    </div>

    <div class="block">
      <h3>③ v-for 中的函数 ref</h3>
      <ul>
        <li v-for="(item, i) in items" :key="item" :ref="(el) => setItemRef(i, el)">
          {{ item }}
        </li>
      </ul>
      <div class="row">
        <button v-for="(item, i) in items" :key="item" @click="highlight(i)">
          高亮 {{ item }}
        </button>
      </div>
      <p class="tip">{{ pickedIndex >= 0 ? \`已高亮第 \${pickedIndex + 1} 项\` : '点上面按钮试试' }}</p>
    </div>

    <div class="block">
      <h3>④ 加分：直接读 DOM（无响应式）</h3>
      <button @click="readDom">读取输入框的原始 DOM 值</button>
      <p class="tip">
        读到的值：<strong>{{ domValue || '（还没读）' }}</strong>
        —— 改文字不会自动刷新，点按钮才读一次，因为 DOM 不是响应式状态。
      </p>
    </div>
  </section>
</template>

<style scoped>
.refs {
  max-width: 380px;
  margin: 24px auto;
  padding: 20px;
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  display: grid;
  gap: 16px;
  font-family: sans-serif;
}
.refs h2 {
  margin: 0;
  font-size: 17px;
}
.block {
  display: grid;
  gap: 8px;
}
.block h3 {
  margin: 0;
  font-size: 14px;
  color: #61707a;
}
.block input {
  padding: 6px 10px;
  border: 1px solid #d8e0e5;
  border-radius: 6px;
}
.block button {
  justify-self: start;
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
.box {
  padding: 10px 14px;
  background: #eef7f2;
  border: 1px solid #bfe3d2;
  border-radius: 6px;
  width: fit-content;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 4px;
}
li {
  padding: 6px 12px;
  background: #f5f7f8;
  border-radius: 6px;
  font-size: 13px;
  transition: background 0.2s;
}
li.picked {
  background: #42b883;
  color: #fff;
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tip {
  margin: 0;
  color: #8fa0ab;
  font-size: 12px;
}
</style>
`,g=JSON.parse('{"title":"04 模板引用与 useTemplateRef","description":"从 ref(null) 到 useTemplateRef：挂载后自动聚焦、读取元素宽度、v-for 函数 ref，三种拿 DOM 的姿势一次学会。","frontmatter":{"title":"04 模板引用与 useTemplateRef","description":"从 ref(null) 到 useTemplateRef：挂载后自动聚焦、读取元素宽度、v-for 函数 ref，三种拿 DOM 的姿势一次学会。","tags":["useTemplateRef","ref","onMounted","函数 ref"]},"headers":[],"relativePath":"features/04-template-refs.md","filePath":"features/04-template-refs.md","lastUpdated":1792665939000}'),u={name:"features/04-template-refs.md"},y=Object.assign(u,{setup(E){const e={"App.vue":k},t={"App.vue":o};return(c,s)=>{const a=l("Playground");return p(),r("div",null,[s[0]||(s[0]=n("h1",{id:"模板引用与-usetemplateref",tabindex:"-1"},[i("模板引用与 useTemplateRef "),n("a",{class:"header-anchor",href:"#模板引用与-usetemplateref","aria-label":'Permalink to "模板引用与 useTemplateRef"'},"​")],-1)),s[1]||(s[1]=n("blockquote",null,[n("p",null,[n("strong",null,"Template Refs · useTemplateRef (Vue 3.5)"),i(" · 难度：入门 · 引入版本：Vue 3.0 / 3.5 增强")])],-1)),s[2]||(s[2]=n("div",{class:"feature-summary"},"从 ref(null) 到 useTemplateRef：挂载后自动聚焦、读取元素宽度、v-for 函数 ref，三种拿 DOM 的姿势一次学会。",-1)),h(a,{starter:e,solution:t}),s[3]||(s[3]=d("",23))])}}});export{g as __pageData,y as default};
