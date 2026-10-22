import{C as l,o as r,c as p,j as n,a as i,E as d,a2 as h}from"./chunks/framework.CE7vFz40.js";const o=`<script setup lang="ts">
/**
 * 练习：渲染函数与函数式组件
 *
 *   TODO(1) DynamicHeading —— h() 基础：标签名插值 + slots/attrs
 *   TODO(2) UiBadge        —— ctx.emit + 动态 class
 *   TODO(3) DataTable      —— 配置驱动：map 替代 v-for、三元替代 v-if
 */
import { h, ref, type FunctionalComponent } from "vue";

/* ── TODO(1) 动态标题：应按 level 渲染 h1~h6 ── */
const DynamicHeading: FunctionalComponent<{ level: number }> = (
  props,
  { slots, attrs },
) => {
  // 练习版：忽略 level，永远渲染 div。
  // TODO(1): return h(\`h\${props.level}\`, attrs, slots.default?.())
  return h("div", attrs, slots.default?.());
};
DynamicHeading.props = {
  level: { type: Number, default: 1 },
};

/* ── TODO(2) 函数式徽标：点击派发事件 ── */
type BadgeType = "success" | "warn";
const UiBadge: FunctionalComponent<{ type: BadgeType }> = (
  props,
  { slots, emit },
) => {
  // 练习版：class 写死、不派发事件。
  // TODO(2):
  //   return h('span', {
  //     class: ['badge', \`badge--\${props.type}\`],
  //     onClick: () => emit('click'),
  //   }, slots.default?.())
  void props;
  void emit;
  return h("span", { class: "badge" }, slots.default?.());
};
UiBadge.props = {
  type: { type: String as () => BadgeType, default: "success" },
};
UiBadge.emits = ["click"];

/* ── TODO(3) 配置驱动表格 ── */
interface User {
  id: number;
  name: string;
  role: string;
  active: boolean;
}
interface Column {
  key: keyof User;
  title: string;
  /** 自定义单元格：返回 VNode（等价于模板里具名插槽的自由度） */
  render?: (row: User) => unknown;
}

const columns: Column[] = [
  { key: "id", title: "ID" },
  { key: "name", title: "姓名" },
  { key: "role", title: "角色" },
  {
    key: "active",
    title: "状态",
    // 配置里直接产出 VNode：布尔值 → 彩色徽标
    render: (row) =>
      h(
        UiBadge,
        { type: row.active ? "success" : "warn" },
        { default: () => (row.active ? "启用" : "停用") },
      ),
  },
];

const rows: User[] = [
  { id: 1, name: "林默", role: "管理员", active: true },
  { id: 2, name: "苏晓", role: "编辑", active: false },
  { id: 3, name: "陈北", role: "访客", active: true },
];

const DataTable: FunctionalComponent<{ columns: Column[]; rows: User[] }> = (
  _props,
) => {
  // TODO(3)：用 h() 渲染（样式类名用 rf-table）
  //   h('table', { class: 'rf-table' }, [
  //     h('thead', {}, h('tr', {}, columns.map(c => h('th', { key: c.key }, c.title)))),
  //     h('tbody', {}, props.rows.map(row =>
  //       h('tr', { key: row.id }, columns.map(col =>
  //         h('td', { key: col.key },
  //           col.render ? [col.render(row) as any] : String(row[col.key] ?? ''))
  //       ))
  //     ))
  //   ])
  return h("p", { class: "muted" }, "TODO(3)：在这里按 columns 配置渲染 table");
};
DataTable.props = {
  columns: { type: Array as () => Column[], required: true },
  rows: { type: Array as () => User[], required: true },
};

/* 徽标点击计数（验证 TODO(2) 的 emit） */
const badgeClicks = ref(0);
<\/script>

<template>
  <section class="lab">
    <h2>🧱 渲染函数实验室</h2>

    <div class="card">
      <h3>① DynamicHeading：同一组件渲染 h1 / h3 / h6</h3>
      <DynamicHeading :level="1" class="dh">我应该是 h1</DynamicHeading>
      <DynamicHeading :level="3" class="dh">我应该是 h3</DynamicHeading>
      <DynamicHeading :level="6" class="dh">我应该是 h6</DynamicHeading>
      <p class="muted">
        练习版三个都是 div；TODO(1) 完成后标签名随 level 变化。
      </p>
    </div>

    <div class="card">
      <h3>② UiBadge：函数式组件的 slots 与 emit</h3>
      <p>
        <UiBadge type="success" @click="badgeClicks++">成功徽标</UiBadge>
        <UiBadge type="warn" @click="badgeClicks++">警告徽标</UiBadge>
      </p>
      <p class="muted">
        徽标被点击次数：<strong>{{ badgeClicks }}</strong>
        （练习版点击无反应，TODO(2) 后 +1）
      </p>
    </div>

    <div class="card">
      <h3>③ DataTable：列配置驱动渲染（含 VNode 列）</h3>
      <DataTable :columns="columns" :rows="rows" />
    </div>
  </section>
</template>

<style scoped>
.lab {
  max-width: 600px;
  margin: 20px auto;
  padding: 16px;
  display: grid;
  gap: 14px;
  font-family: sans-serif;
}
.lab h2 {
  margin: 0;
}
.card {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 14px;
  display: grid;
  gap: 8px;
}
.card h3 {
  margin: 0;
  font-size: 14px;
}
.card p {
  margin: 0;
  font-size: 13px;
}
.dh {
  margin: 2px 0;
}
.muted {
  font-size: 12px;
  color: #8fa0ab;
}
</style>

<!--
  非 scoped 样式：函数式组件通过 h() 创建的 VNode 不经过模板编译，
  内部节点不会带上 SFC 的 data-v scope id（只有作为子组件根节点的
  那一个节点会继承父级 scope）。因此 badge / table 内部样式用
  普通 style 块 + 前缀类名，保证 h() 产出的节点也能命中。
-->
<style>
.badge {
  display: inline-block;
  margin-right: 8px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid #d5dce1;
  background: #f5f7f8;
  color: #55636d;
}
.badge--success {
  background: #e6f8f0;
  border-color: #42b883;
  color: #2a8f65;
}
.badge--warn {
  background: #fff4e5;
  border-color: #e0a03b;
  color: #b97413;
}
.rf-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.rf-table th,
.rf-table td {
  border: 1px solid #e4e9ec;
  padding: 7px 10px;
  text-align: left;
}
.rf-table th {
  background: #f5f7f8;
}
</style>
`,k=`<script setup lang="ts">
/**
 * 参考答案：渲染函数与函数式组件
 *
 * - DynamicHeading：标签名由 prop 插值，透传 attrs 与默认插槽
 * - UiBadge：动态 class + ctx.emit，演示组件的事件派发
 * - DataTable：配置驱动，map 当 v-for、三元当 v-if、每级带 key，
 *   列配置的 render 直接产出 VNode（状态列渲染成彩色 UiBadge）
 */
import { h, ref, type FunctionalComponent } from 'vue'

/* ① 动态标题：纯标签插值的最简函数式组件 */
const DynamicHeading: FunctionalComponent<{ level: number }> = (
  props,
  { slots, attrs },
) => {
  // 标签名就是个字符串：\`h1\` ~ \`h6\`；attrs 把父级 class/id 等透传到真实标签
  const tag = \`h\${props.level}\` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  return h(tag, attrs, slots.default?.())
}
DynamicHeading.props = {
  level: { type: Number, default: 1 },
}

/* ② 函数式徽标：默认插槽 + emit */
type BadgeType = 'success' | 'warn'
const UiBadge: FunctionalComponent<{ type: BadgeType }> = (
  props,
  { slots, emit },
) => {
  return h(
    'span',
    {
      // 模板 :class="['badge', \`badge--\${type}\`]" 的等价写法
      class: ['badge', \`badge--\${props.type}\`],
      // 模板 @click 的等价写法：onXxx 形式的 props 键
      onClick: () => emit('click'),
    },
    // slots.default 是函数，调用后才是 VNode 数组；无插槽时为 undefined
    slots.default?.(),
  )
}
UiBadge.props = {
  type: { type: String as () => BadgeType, default: 'success' },
}
UiBadge.emits = ['click']

/* ③ 配置驱动表格 */
interface User {
  id: number
  name: string
  role: string
  active: boolean
}
interface Column {
  key: keyof User
  title: string
  /** 自定义单元格渲染：返回 VNode —— 等价于模板中给一列一个具名插槽 */
  render?: (row: User) => unknown
}

const columns: Column[] = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: '姓名' },
  { key: 'role', title: '角色' },
  {
    key: 'active',
    title: '状态',
    // 给组件传插槽用「插槽对象」：{ default: () => VNode }
    render: (row) =>
      h(UiBadge, { type: row.active ? 'success' : 'warn' }, {
        default: () => (row.active ? '启用' : '停用'),
      }),
  },
]

const rows: User[] = [
  { id: 1, name: '林默', role: '管理员', active: true },
  { id: 2, name: '苏晓', role: '编辑', active: false },
  { id: 3, name: '陈北', role: '访客', active: true },
]

const DataTable: FunctionalComponent<{ columns: Column[]; rows: User[] }> = (
  props,
) => {
  // v-for → map；每一级 h 的第二个参数都带 key（与模板列表的 key 同理）
  return h('table', { class: 'rf-table' }, [
    h(
      'thead',
      {},
      h(
        'tr',
        {},
        props.columns.map((col) => h('th', { key: col.key }, col.title)),
      ),
    ),
    h(
      'tbody',
      {},
      props.rows.map((row) =>
        h(
          'tr',
          { key: row.id },
          props.columns.map((col) =>
            // v-if → 三元：有 render 用 VNode（包成数组），否则取纯文本
            h(
              'td',
              { key: col.key },
              col.render
                ? [col.render(row) as never]
                : String(row[col.key] ?? ''),
            ),
          ),
        ),
      ),
    ),
  ])
}
DataTable.props = {
  columns: { type: Array as () => Column[], required: true },
  rows: { type: Array as () => User[], required: true },
}

const badgeClicks = ref(0)
<\/script>

<template>
  <section class="lab">
    <h2>🧱 渲染函数实验室</h2>

    <div class="card">
      <h3>① DynamicHeading：同一组件渲染 h1 / h3 / h6</h3>
      <DynamicHeading :level="1" class="dh">我是 h1</DynamicHeading>
      <DynamicHeading :level="3" class="dh">我是 h3</DynamicHeading>
      <DynamicHeading :level="6" class="dh">我是 h6</DynamicHeading>
      <p class="muted">DOM 里是三种不同标签，attrs 上的 class 也透传成功。</p>
    </div>

    <div class="card">
      <h3>② UiBadge：函数式组件的 slots 与 emit</h3>
      <p>
        <UiBadge type="success" @click="badgeClicks++">成功徽标</UiBadge>
        <UiBadge type="warn" @click="badgeClicks++">警告徽标</UiBadge>
      </p>
      <p class="muted">
        徽标被点击次数：<strong>{{ badgeClicks }}</strong>
      </p>
    </div>

    <div class="card">
      <h3>③ DataTable：列配置驱动渲染（含 VNode 列）</h3>
      <DataTable :columns="columns" :rows="rows" />
      <p class="muted">状态列没有写死在表格里，而是 columns 配置里的 render 产出 UiBadge。</p>
    </div>
  </section>
</template>

<style scoped>
.lab {
  max-width: 600px;
  margin: 20px auto;
  padding: 16px;
  display: grid;
  gap: 14px;
  font-family: sans-serif;
}
.lab h2 {
  margin: 0;
}
.card {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 14px;
  display: grid;
  gap: 8px;
}
.card h3 {
  margin: 0;
  font-size: 14px;
}
.card p {
  margin: 0;
  font-size: 13px;
}
.dh {
  margin: 2px 0;
}
.muted {
  font-size: 12px;
  color: #8fa0ab;
}
</style>

<!-- 非 scoped：h() 产出的内部节点不带 data-v scope id，见 starter 注释 -->
<style>
.badge {
  display: inline-block;
  margin-right: 8px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid #d5dce1;
  background: #f5f7f8;
  color: #55636d;
}
.badge--success {
  background: #e6f8f0;
  border-color: #42b883;
  color: #2a8f65;
}
.badge--warn {
  background: #fff4e5;
  border-color: #e0a03b;
  color: #b97413;
}
.rf-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.rf-table th,
.rf-table td {
  border: 1px solid #e4e9ec;
  padding: 7px 10px;
  text-align: left;
}
.rf-table th {
  background: #f5f7f8;
}
</style>
`,u=JSON.parse('{"title":"16 渲染函数与函数式组件","description":"手写 h() 构造 VNode：标签插值、插槽与 attrs 透传、emit、配置驱动表格（map/三元替代 v-for/v-if）。","frontmatter":{"title":"16 渲染函数与函数式组件","description":"手写 h() 构造 VNode：标签插值、插槽与 attrs 透传、emit、配置驱动表格（map/三元替代 v-for/v-if）。","tags":["渲染函数","h()","函数式组件","FunctionalComponent"]},"headers":[],"relativePath":"features/16-render-functions.md","filePath":"features/16-render-functions.md","lastUpdated":1792665939000}'),c={name:"features/16-render-functions.md"},m=Object.assign(c,{setup(g){const a={"App.vue":o},e={"App.vue":k};return(E,s)=>{const t=l("Playground");return r(),p("div",null,[s[0]||(s[0]=n("h1",{id:"渲染函数与函数式组件",tabindex:"-1"},[i("渲染函数与函数式组件 "),n("a",{class:"header-anchor",href:"#渲染函数与函数式组件","aria-label":'Permalink to "渲染函数与函数式组件"'},"​")],-1)),s[1]||(s[1]=n("blockquote",null,[n("p",null,[n("strong",null,"h() · FunctionalComponent · 配置驱动渲染"),i(" · 难度：高级 · 引入版本：Vue 3.0")])],-1)),s[2]||(s[2]=n("div",{class:"feature-summary"},"手写 h() 构造 VNode：标签插值、插槽与 attrs 透传、emit、配置驱动表格（map/三元替代 v-for/v-if）。",-1)),d(t,{starter:a,solution:e}),s[3]||(s[3]=h(`<hr><h1 id="渲染函数与函数式组件-1" tabindex="-1">渲染函数与函数式组件 <a class="header-anchor" href="#渲染函数与函数式组件-1" aria-label="Permalink to &quot;渲染函数与函数式组件&quot;">​</a></h1><h2 id="模板的底层-render-函数" tabindex="-1">模板的底层：render 函数 <a class="header-anchor" href="#模板的底层-render-函数" aria-label="Permalink to &quot;模板的底层：render 函数&quot;">​</a></h2><p>Vue 模板最终会被编译成一个返回 VNode 树的 <strong>render 函数</strong>。 99% 的场景直接写模板即可；但当你需要<strong>完全用 JS 的能力动态构造 VNode</strong> 时（递归结构、按配置数组生成组件、库级封装），可以手写 render 函数，或使用更轻量的<strong>函数式组件</strong>。</p><h2 id="h-创建-vnode" tabindex="-1">h()：创建 VNode <a class="header-anchor" href="#h-创建-vnode" aria-label="Permalink to &quot;h()：创建 VNode&quot;">​</a></h2><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { h } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// h(标签/组件, props 对象, 子节点)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">h</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;div&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, { id: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;x&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, class: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;a&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, { b: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }] }, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;文本&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">h</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;ul&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, { onClick: handle }, items.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">map</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">((</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">it</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> h</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;li&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, { key: it.id }, it.name)))</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">h</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(MyCard, { title: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;t&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }, {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> h</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;p&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;默认插槽&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  footer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> h</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;button&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;具名插槽&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><p><code>children</code> 支持三种形态：字符串/数字、VNode 数组、<strong>插槽对象</strong><code>{ default: () =&gt; ..., 具名: () =&gt; ... }</code>（给组件传插槽时用对象形式）。</p><p>模板到 h 的常见映射：</p><table tabindex="0"><thead><tr><th>模板</th><th>渲染函数</th></tr></thead><tbody><tr><td><code>v-if</code></td><td><code>if/else</code> 或三元，不想要的分支返回 <code>null</code></td></tr><tr><td><code>v-for</code></td><td><code>arr.map(item =&gt; h(&#39;li&#39;, { key: item.id }, ...))</code></td></tr><tr><td><code>@click</code></td><td><code>onClick: fn</code>；<code>@click.once</code> 用 <code>onClickOnce</code></td></tr><tr><td><code>:class</code></td><td><code>class: &#39;x&#39; / [&#39;x&#39;, { y: true }]</code></td></tr><tr><td><code>&lt;slot&gt;</code></td><td><code>slots.default?.()</code>（调用返回 VNode 数组）</td></tr><tr><td><code>&lt;component :is&gt;</code></td><td><code>h(comp)</code>，comp 本身就是第一个参数</td></tr><tr><td><code>v-model</code></td><td><code>modelValue</code> + <code>onUpdate:modelValue</code></td></tr></tbody></table><p>注意：<strong>key 加在 h 的第二个参数里</strong>（<code>h(&#39;li&#39;, { key: item.id })</code>）， VNode 创建后不可再改；条件分支返回 <code>null</code> 表示不渲染。</p><h2 id="函数式组件-props-ctx-vnode" tabindex="-1">函数式组件：(props, ctx) =&gt; VNode <a class="header-anchor" href="#函数式组件-props-ctx-vnode" aria-label="Permalink to &quot;函数式组件：(props, ctx) =&gt; VNode&quot;">​</a></h2><p>函数式组件就是一个<strong>返回 VNode 的普通函数</strong>：没有实例、没有 响应式状态、没有生命周期，渲染开销更小。</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { h, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> FunctionalComponent } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Heading</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> FunctionalComponent</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;{ </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">level</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> number</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }&gt; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">props</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, { </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">slots</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">emit</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">attrs</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> h</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">\`h\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">props</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">level</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, attrs, slots.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">?.())</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Heading.props </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { level: { type: Number, default: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Heading.emits </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;click&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 显式声明，与对象式组件 emits 等价</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Heading.inheritAttrs </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> false</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 需要时关闭自动 attrs 透传</span></span></code></pre></div><p>第二个参数 <code>ctx</code> 提供：<code>slots</code>（插槽函数集合）、<code>emit</code>（派发事件）、 <code>attrs</code>（透传 attribute）、<code>expose</code>。props 类型通过 <code>FunctionalComponent&lt;Props&gt;</code> 标注；运行时 props 校验仍要挂载 <code>.props</code>（和普通组件的 <code>props</code> 选项同构）。</p><h2 id="有状态的-render-函数-setup-返回函数" tabindex="-1">有状态的 render 函数：setup 返回函数 <a class="header-anchor" href="#有状态的-render-函数-setup-返回函数" aria-label="Permalink to &quot;有状态的 render 函数：setup 返回函数&quot;">​</a></h2><p>组件需要响应式状态、computed、生命周期时，让 <code>setup</code> <strong>返回一个函数</strong>， 它就成为该组件的 render：</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">defineComponent</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  props: { nodes: { type: Array, required: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } },</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  setup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">props</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> selected</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ref</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">string</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> h</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;ul&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, props.nodes.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">map</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">n</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =&gt;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">      h</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;li&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        key: n.id,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        class: { active: selected.value </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">===</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> n.id },</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        onClick</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (selected.value </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> n.id),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }, n.label),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    ))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><p>递归树/菜单是这种写法的经典场景（子节点里 h(当前组件, ...)）。</p><h2 id="什么时候才用渲染函数" tabindex="-1">什么时候才用渲染函数 <a class="header-anchor" href="#什么时候才用渲染函数" aria-label="Permalink to &quot;什么时候才用渲染函数&quot;">​</a></h2><ul><li>✅ 递归结构（树、菜单、评论嵌套）；</li><li>✅ 配置驱动渲染（后端/用户传入列配置、组件映射表）；</li><li>✅ 组件库的无状态包装器（Heading、Badge、布局壳）；</li><li>❌ 普通业务 UI —— 模板更易读、有编译期优化（静态提升、补丁标志）， 手写 h 反而绕过了这些优化；</li><li>❌ 需要大量状态/生命周期 —— 用对象式/<code>&lt;script setup&gt;</code> 组件， 只在内部局部使用 render 函数。</li></ul><h2 id="动手试" tabindex="-1">动手试 <a class="header-anchor" href="#动手试" aria-label="Permalink to &quot;动手试&quot;">​</a></h2><ol><li><strong>TODO(1) DynamicHeading</strong>：把占位的 <code>div</code> 改成按 <code>level</code> 返回 <code>h1</code>~<code>h6</code>，并透传默认插槽与 attrs。</li><li><strong>TODO(2) UiBadge</strong>：函数式徽标 —— 渲染默认插槽，点击时 <code>emit(&#39;click&#39;)</code>，class 随 <code>type</code>（success/warn）变化； 观察父组件计数随之增加。</li><li><strong>TODO(3) DataTable</strong>：配置驱动的函数式表格 —— 按 <code>columns</code> 配置 <code>map</code> 出表头与行单元格（<code>v-for</code> → map），列定义提供 <code>render</code> 时渲染自定义 VNode，否则渲染纯文本（<code>v-if</code> → 三元）。</li></ol><h2 id="常见坑-真实踩坑记录" tabindex="-1">常见坑（真实踩坑记录） <a class="header-anchor" href="#常见坑-真实踩坑记录" aria-label="Permalink to &quot;常见坑（真实踩坑记录）&quot;">​</a></h2><ul><li><strong>函数式组件里用 ref/reactive</strong>：它没有实例，闭包状态在同函数 多次复用时会串。要状态就用 setup 返回渲染函数的对象式组件。</li><li><strong>忘了声明 <code>.props</code></strong>：TS 类型有了但运行时把 props 当 attrs 透传/校验缺失；<code>FunctionalComponent&lt;Props&gt;</code> 只管类型，运行时 props 仍要挂载。</li><li><strong>插槽当数据用</strong>：<code>slots.default</code> 是函数，必须 <code>slots.default?.()</code> 调用才拿到 VNode 数组；空插槽是 <code>undefined</code>，可选链别漏。</li><li><strong>VNode 复用/修改</strong>：h() 产出的 VNode 是一次性描述，不要在多处 复用同一个可变 VNode 或创建后改它的 props；需要复用就封装成函数 每次重新创建。</li><li><strong>列表忘 key</strong>：<code>map</code> 出的 h 第二个参数给 <code>key</code>，否则动态列表 复用节点时状态错位，和模板 v-for 的 key 完全同理。</li><li><strong>事件名写错</strong>：render 里是 <code>onClick</code> / <code>onUpdate:modelValue</code> 这种小驼峰 props 键，不是 <code>@click</code> 字符串。</li></ul><hr><h2 id="源码参考" tabindex="-1">源码参考 <a class="header-anchor" href="#源码参考" aria-label="Permalink to &quot;源码参考&quot;">​</a></h2><ul><li>特性目录：<a href="https://github.com/YZhiJie/vue3-features-lab/tree/main/src/features/16-render-functions" target="_blank" rel="noreferrer"><code>src/features/16-render-functions/</code></a></li></ul>`,27))])}}});export{u as __pageData,m as default};
