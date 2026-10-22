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
`,u=JSON.parse('{"title":"16 渲染函数与函数式组件","description":"手写 h() 构造 VNode：标签插值、插槽与 attrs 透传、emit、配置驱动表格（map/三元替代 v-for/v-if）。","frontmatter":{"title":"16 渲染函数与函数式组件","description":"手写 h() 构造 VNode：标签插值、插槽与 attrs 透传、emit、配置驱动表格（map/三元替代 v-for/v-if）。","tags":["渲染函数","h()","函数式组件","FunctionalComponent"]},"headers":[],"relativePath":"features/16-render-functions.md","filePath":"features/16-render-functions.md","lastUpdated":1792665939000}'),c={name:"features/16-render-functions.md"},m=Object.assign(c,{setup(g){const a={"App.vue":o},e={"App.vue":k};return(E,s)=>{const t=l("Playground");return r(),p("div",null,[s[0]||(s[0]=n("h1",{id:"渲染函数与函数式组件",tabindex:"-1"},[i("渲染函数与函数式组件 "),n("a",{class:"header-anchor",href:"#渲染函数与函数式组件","aria-label":'Permalink to "渲染函数与函数式组件"'},"​")],-1)),s[1]||(s[1]=n("blockquote",null,[n("p",null,[n("strong",null,"h() · FunctionalComponent · 配置驱动渲染"),i(" · 难度：高级 · 引入版本：Vue 3.0")])],-1)),s[2]||(s[2]=n("div",{class:"feature-summary"},"手写 h() 构造 VNode：标签插值、插槽与 attrs 透传、emit、配置驱动表格（map/三元替代 v-for/v-if）。",-1)),d(t,{starter:a,solution:e}),s[3]||(s[3]=h("",27))])}}});export{u as __pageData,m as default};
