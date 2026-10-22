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
`,g=JSON.parse('{"title":"04 模板引用与 useTemplateRef","description":"从 ref(null) 到 useTemplateRef：挂载后自动聚焦、读取元素宽度、v-for 函数 ref，三种拿 DOM 的姿势一次学会。","frontmatter":{"title":"04 模板引用与 useTemplateRef","description":"从 ref(null) 到 useTemplateRef：挂载后自动聚焦、读取元素宽度、v-for 函数 ref，三种拿 DOM 的姿势一次学会。","tags":["useTemplateRef","ref","onMounted","函数 ref"]},"headers":[],"relativePath":"features/04-template-refs.md","filePath":"features/04-template-refs.md","lastUpdated":1792665939000}'),u={name:"features/04-template-refs.md"},y=Object.assign(u,{setup(E){const e={"App.vue":k},t={"App.vue":o};return(c,s)=>{const a=l("Playground");return p(),r("div",null,[s[0]||(s[0]=n("h1",{id:"模板引用与-usetemplateref",tabindex:"-1"},[i("模板引用与 useTemplateRef "),n("a",{class:"header-anchor",href:"#模板引用与-usetemplateref","aria-label":'Permalink to "模板引用与 useTemplateRef"'},"​")],-1)),s[1]||(s[1]=n("blockquote",null,[n("p",null,[n("strong",null,"Template Refs · useTemplateRef (Vue 3.5)"),i(" · 难度：入门 · 引入版本：Vue 3.0 / 3.5 增强")])],-1)),s[2]||(s[2]=n("div",{class:"feature-summary"},"从 ref(null) 到 useTemplateRef：挂载后自动聚焦、读取元素宽度、v-for 函数 ref，三种拿 DOM 的姿势一次学会。",-1)),h(a,{starter:e,solution:t}),s[3]||(s[3]=d(`<hr><h1 id="模板引用与-usetemplateref-1" tabindex="-1">模板引用与 useTemplateRef <a class="header-anchor" href="#模板引用与-usetemplateref-1" aria-label="Permalink to &quot;模板引用与 useTemplateRef&quot;">​</a></h1><h2 id="这是什么" tabindex="-1">这是什么 <a class="header-anchor" href="#这是什么" aria-label="Permalink to &quot;这是什么&quot;">​</a></h2><p>响应式数据管「状态」，但总有些事必须<strong>直接摸到 DOM 元素</strong>：聚焦输入框、读取宽度、滚动到某一项、调用第三方 DOM 库的初始化。模板引用（template ref）就是 Vue 给你的「DOM 握手通道」。</p><p>Vue 3.5 带来了新的 <code>useTemplateRef</code> API，一句话改进：<strong>把「变量名必须与 ref 同名」的隐式约定，换成了显式的字符串 key</strong>。</p><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setup</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { onMounted, useTemplateRef } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 旧写法（3.0 起）：变量名必须与模板里的 ref=&quot;inputEl&quot; 一模一样才能对上</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// const inputEl = ref&lt;HTMLInputElement | null&gt;(null)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 新写法（3.5 起）：变量随便叫，字符串 key 才是与模板的连接点</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> inputEl</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> useTemplateRef</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">HTMLInputElement</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;inputEl&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">onMounted</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  inputEl.value?.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">focus</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 挂载后 ref 一定有值（前提：元素无条件渲染）</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">input</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ref</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;inputEl&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><h2 id="核心-api-速览" tabindex="-1">核心 API 速览 <a class="header-anchor" href="#核心-api-速览" aria-label="Permalink to &quot;核心 API 速览&quot;">​</a></h2><table tabindex="0"><thead><tr><th>API</th><th>用途</th><th>关键点</th></tr></thead><tbody><tr><td><code>useTemplateRef(key)</code></td><td>按字符串 key 拿模板 ref（3.5）</td><td>参数必须与 <code>ref=&quot;key&quot;</code> 一字不差；返回只读浅 ref</td></tr><tr><td><code>ref(null)</code></td><td>旧方式：同名变量自动关联</td><td>仍然可用；变量名 = 连接约定</td></tr><tr><td><code>:ref=&quot;fn&quot;</code></td><td>函数 ref</td><td>每次渲染都会调用，参数是元素或 <code>null</code></td></tr><tr><td><code>onMounted(fn)</code></td><td>ref 可用的最早时机</td><td>挂载前 ref 是 null；<code>v-if</code> 的元素随条件出现/消失</td></tr></tbody></table><p><strong>新旧怎么选？</strong> 3.5 之后新代码一律用 <code>useTemplateRef</code>：显式 key、改名安全、<code>useTemplateRefsList</code> 等配套更自然；维护旧代码遇到 <code>ref(null)</code> 不必强改。</p><h2 id="动手试" tabindex="-1">动手试 <a class="header-anchor" href="#动手试" aria-label="Permalink to &quot;动手试&quot;">​</a></h2><p>右侧起始代码有三个小任务，starter 里全是「能跑但不干活」的骨架，把每一处换成 <code>useTemplateRef</code> 并补全行为：</p><ol><li>TODO(1)：声明 <code>inputEl</code> 并在 <code>onMounted</code> 里自动聚焦（加分：再 <code>select()</code> 全选）</li><li>TODO(2)：拿到 <code>boxEl</code>，实现「测量宽度」（<code>offsetWidth</code> 读布局后的真实宽度）</li><li>TODO(3)：v-for 里用函数 ref 收集每个 <code>&lt;li&gt;</code>，实现点击高亮任意一项</li><li>参考答案还演示了：直接读取 input 的原始 DOM 值——ref 给你的是 DOM 本身，没有响应式</li></ol><h2 id="函数-ref-字符串-ref-覆盖不了的场景" tabindex="-1">函数 ref：字符串 ref 覆盖不了的场景 <a class="header-anchor" href="#函数-ref-字符串-ref-覆盖不了的场景" aria-label="Permalink to &quot;函数 ref：字符串 ref 覆盖不了的场景&quot;">​</a></h2><p>v-for 收集、动态挂载、按 key 精确对应……这些场景函数 ref 都能接住：</p><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  &lt;!-- 每次渲染都会调用：el 是元素或 null --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">li</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> v-for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">item </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">in</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> items</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> :</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">key</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">item.id</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> :</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ref</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">el</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> collect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(item.id, el)</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    {{ item.text }}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setup</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> els</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ref</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Map</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">number</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">HTMLElement</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;())</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> collect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">id</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> number</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">el</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> unknown</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> li</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> el </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">as</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> HTMLElement</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  li </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> els.value.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">set</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(id, li) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> els.value.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">delete</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(id) </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// null = 该槽位即将卸载</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><p>要点：<strong>用业务 id 而不是数组下标做 Map 的 key</strong>。列表排序 / 增删时下标会变，旧元素还挂在旧下标上就「错位」了；用 id 收集天然稳定。</p><h2 id="新旧写法差异速记" tabindex="-1">新旧写法差异速记 <a class="header-anchor" href="#新旧写法差异速记" aria-label="Permalink to &quot;新旧写法差异速记&quot;">​</a></h2><table tabindex="0"><thead><tr><th>维度</th><th><code>ref(null)</code> 旧写法</th><th><code>useTemplateRef(key)</code></th></tr></thead><tbody><tr><td>连接方式</td><td>变量名与 ref 字符串同名（隐式）</td><td>显式字符串 key（改名安全）</td></tr><tr><td>变量命名</td><td>被模板占用，不能随便起名</td><td>随意，key 才是身份标识</td></tr><tr><td>返回值</td><td>普通可写 ref</td><td>只读浅 ref（防误赋值）</td></tr><tr><td>拼错后果</td><td>变量名对不上时 ref 悄悄失联</td><td>key 拼错同样静默失败，都要靠自检</td></tr></tbody></table><h2 id="常见坑-真实踩坑记录" tabindex="-1">常见坑（真实踩坑记录） <a class="header-anchor" href="#常见坑-真实踩坑记录" aria-label="Permalink to &quot;常见坑（真实踩坑记录）&quot;">​</a></h2><ul><li><strong>key 拼错静默失败</strong>：<code>useTemplateRef(&#39;inpuEl&#39;)</code> 少打一个字母，不报错、不警告，<code>value</code> 永远是 <code>null</code>——这是新 API 最大的坑，排查时先对字符串。</li><li><strong>挂载前 / v-if 下访问 ref</strong>：<code>onMounted</code> 之前 ref 是 <code>null</code>；被 <code>v-if</code> 控制的元素卸载后也变回 <code>null</code>。调用方法一律 <code>?.</code>。</li><li><strong>函数 ref 忘记处理 null</strong>：列表重渲染时 Vue 会先用 <code>null</code> 调一次你的函数再传新元素，<code>el.classList.add</code> 直接抛 <code>Cannot read properties of null</code>。</li><li><strong>v-for 字符串 ref 的顺序</strong>：模板里 <code>ref=&quot;xxx&quot;</code> 写在 v-for 内会收集成数组，但官方明确<strong>不保证顺序与源数组一致</strong>；要精确对应就用函数 ref 按索引/按 key 收集。</li><li><strong>组件 ref 空壳</strong>：ref 指向的是 <code>&lt;script setup&gt;</code> 组件时，必须子组件 <code>defineExpose</code> 才有内容（见第 3 章）。</li><li><strong>把 ref 当响应式状态用</strong>：ref 里的 DOM 不参与响应式追踪，改了 DOM 属性视图不会「同步回来」——需要回写状态时，老老实实把值赋给一个 ref。</li></ul><hr><h2 id="源码参考" tabindex="-1">源码参考 <a class="header-anchor" href="#源码参考" aria-label="Permalink to &quot;源码参考&quot;">​</a></h2><ul><li>特性目录：<a href="https://github.com/YZhiJie/vue3-features-lab/tree/main/src/features/04-template-refs" target="_blank" rel="noreferrer"><code>src/features/04-template-refs/</code></a></li></ul>`,23))])}}});export{g as __pageData,y as default};
