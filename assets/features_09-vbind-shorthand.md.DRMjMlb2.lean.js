import{C as r,o,c as l,j as e,a as s,E as p,a2 as d}from"./chunks/framework.CE7vFz40.js";const h=`<script setup lang="ts">
/**
 * 练习：同名 v-bind 简写 —— 可配置用户卡片
 *
 * 起始代码把所有绑定写成完整形式（能跑，但啰嗦）。
 *   TODO(1) 区块① 改成同名简写 :user :extra
 *   TODO(2) 动态参数按钮 @[eventName]="onPing"（下拉切换 click / mouseenter）
 *   TODO(3) 区块③ 摆两张顺序对照卡：v-bind="patch" 在前 / 在后
 *
 * 坑点提醒：同名简写的前提是「变量名 === 属性名」——
 * user / extra / patch 这些名字就是为此而起的。
 */
import { ref } from 'vue'
import UserCard from './UserCard.vue'

// 与 UserCard 的 user prop 同名 → TODO(1) 后可以写 :user
const user = ref({ name: '小明', bio: 'Vue 3 爱好者，正在学同名简写' })
// 与 UserCard 的 extra prop 同名 → :extra
const extra = ref({ level: 'Lv.5', badge: '🥇 元老成员' })

// 顺序实验用的「补丁对象」：键名与 prop 名相同（extra），
// v-bind="patch" 展开后等价于 :extra="patch.extra"
const patch = { extra: { level: 'Lv.1', badge: '🌱 新人报道' } }

/* ── 动态参数：绑到按钮上的事件名由这个 ref 决定 ── */
const eventName = ref<'click' | 'mouseenter'>('click')
const pings = ref<string[]>([])

// TODO(2): 把 onPing 绑定到按钮的 @[eventName] 上（模板里写 @[eventName]="onPing"）
function onPing() {
  pings.value.unshift(\`\${new Date().toLocaleTimeString()} 触发了 @\${eventName.value}\`)
}
<\/script>

<template>
  <section class="shorthand-lab">
    <h2>⚡ 同名 v-bind 简写</h2>

    <!-- 区块①：同名简写 -->
    <h3>① 同名简写（TODO(1)）</h3>
    <!-- TODO(1): 把下面两个绑定改成 :user :extra -->
    <UserCard :user="user" :extra="extra" />
    <label class="row">
      试试改名字（props 保持响应式）：
      <input v-model="user.name" />
    </label>

    <!-- 区块②：动态参数 -->
    <h3>② 动态参数 [eventName]（TODO(2)）</h3>
    <label class="row">
      绑定哪个事件？
      <select v-model="eventName">
        <option value="click">click</option>
        <option value="mouseenter">mouseenter</option>
      </select>
    </label>
    <!-- TODO(2): 用 @[eventName]="onPing" 让这个按钮活过来 -->
    <button>在此按钮上触发 {{ eventName }}（完成 TODO(2)）</button>
    <p v-for="(item, i) in pings" :key="i" class="log">{{ item }}</p>

    <!-- 区块③：v-bind 对象与顺序合并 -->
    <h3>③ 顺序合并：后者覆盖前者（TODO(3)）</h3>
    <!-- TODO(3): 参考答案里有两张对照卡：
         A = :extra 在前、v-bind="patch" 在后（patch 赢）
         B = v-bind="patch" 在前、:extra 在后（:extra 赢）
         自己动手摆一摆，观察 badge/level 来自哪里。 -->
    <p class="note">当前这张卡：:extra 在前、对象在后 —— badge 已经被 patch 悄悄覆盖了</p>
    <UserCard :user="user" :extra="extra" v-bind="patch" />
  </section>
</template>

<style scoped>
.shorthand-lab {
  max-width: 560px;
  margin: 24px auto;
  padding: 20px;
  display: grid;
  gap: 10px;
  font-family: sans-serif;
}
.shorthand-lab h2 {
  margin: 0;
}
.shorthand-lab h3 {
  margin: 10px 0 4px;
  font-size: 14px;
}
.row {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  color: #55636d;
}
.row input,
.row select {
  padding: 4px 8px;
  border: 1px solid #dde5ea;
  border-radius: 6px;
  font: inherit;
}
.shorthand-lab > button {
  justify-self: start;
  padding: 6px 14px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
}
.shorthand-lab > button:hover {
  border-color: #42b883;
  color: #33a06f;
}
.log {
  margin: 0;
  font-size: 12px;
  color: #33a06f;
}
.note {
  margin: 0;
  font-size: 12px;
  color: #b3453c;
}
</style>
`,c=`<script setup lang="ts">
/**
 * 子组件：可配置用户卡片（接收方）
 *
 * 设计决策：故意用「两个对象 prop」而不是一堆零散 prop ——
 * 这样 App 侧的 :user :extra 同名简写才有展示价值；如果 props 是零散的
 * name/level/badge，那该用 v-bind="user" 展开而不是同名简写。
 *
 * 坑点：props 是浅层只读代理 —— 修改 props.user.xxx 能改（对象内部
 * 不受单向数据流拦截），但属于反模式；演示里由父组件自己改自己的对象。
 */
interface UserInfo {
  name: string
  bio: string
}
interface ExtraInfo {
  level: string
  badge: string
}

defineProps<{
  /** 与 App 里的 user 变量同名 → 父组件可以写 :user */
  user: UserInfo
  /** 与 App 里的 extra 变量同名 → 父组件可以写 :extra */
  extra: ExtraInfo
}>()
<\/script>

<template>
  <article class="user-card">
    <header>
      <strong class="name">{{ user.name }}</strong>
      <span class="badge">{{ extra.badge }}</span>
    </header>
    <p class="bio">{{ user.bio }}</p>
    <footer>等级：{{ extra.level }}</footer>
  </article>
</template>

<style scoped>
.user-card {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 14px;
  display: grid;
  gap: 8px;
  background: #fff;
}
.user-card header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.name {
  font-size: 15px;
}
.badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #f0faf5;
  color: #33a06f;
  border: 1px solid #d8efe4;
}
.bio {
  margin: 0;
  font-size: 13px;
  color: #55636d;
}
footer {
  font-size: 12px;
  color: #8fa0ab;
}
</style>
`,u=`<script setup lang="ts">
/**
 * 参考答案：同名 v-bind 简写 —— 可配置用户卡片
 *
 * 相比练习版补充：
 * 1. 区块① 用同名简写 :user :extra（等价 :user="user" :extra="extra"）；
 * 2. 区块② 用动态参数 @[eventName] 绑定事件，下拉切换 click / mouseenter；
 * 3. 区块③ 两张顺序对照卡：v-bind="patch" 在后 / 在前，直观展示
 *    「后者覆盖前者」—— 覆盖关系只看书写顺序，与书写形式无关。
 */
import { ref } from "vue";
import UserCard from "./UserCard.vue";

// 变量名与 prop 名完全一致 —— 同名简写的前提
const user = ref({ name: "小明", bio: "Vue 3 爱好者，正在学同名简写" });
const extra = ref({ level: "Lv.5", badge: "🥇 元老成员" });

// 补丁对象：键名与 prop 名相同，v-bind="patch" 展开后等价于 :extra="patch.extra"
const patch = { extra: { level: "Lv.1", badge: "🌱 新人报道" } };

/* ── 动态参数：属性名由这个 ref 的当前值决定 ── */
const eventName = ref<"click" | "mouseenter">("click");
const pings = ref<string[]>([]);

function onPing() {
  pings.value.unshift(
    \`\${new Date().toLocaleTimeString()} 触发了 @\${eventName.value}\`,
  );
}
<\/script>

<template>
  <section class="shorthand-lab">
    <h2>⚡ 同名 v-bind 简写</h2>

    <!-- 区块①：同名简写 —— :user 就是 :user="user" -->
    <h3>① 同名简写</h3>
    <UserCard :user :extra />
    <label class="row">
      试试改名字（props 保持响应式）：
      <input v-model="user.name" />
    </label>

    <!-- 区块②：动态参数 —— 属性名（事件名）由表达式决定 -->
    <h3>② 动态参数 [eventName]</h3>
    <label class="row">
      绑定哪个事件？
      <select v-model="eventName">
        <option value="click">click</option>
        <option value="mouseenter">mouseenter</option>
      </select>
    </label>
    <!-- @[eventName] 在 eventName='click' 时编译成 @click，切到 mouseenter 同理。
         切到 mouseenter 后，点击按钮不会触发 —— 鼠标移上去才触发。 -->
    <button @[eventName]="onPing">在此按钮上触发 {{ eventName }}</button>
    <p v-for="(item, i) in pings" :key="i" class="log">{{ item }}</p>

    <!-- 区块③：顺序对照实验 -->
    <h3>③ 顺序合并：后者覆盖前者</h3>
    <!-- 卡 A：:extra 在前、对象在后 → patch.extra 覆盖 :extra（显示「新人报道」） -->
    <p class="note">卡 A：:extra 在前、v-bind 对象在后 → patch 赢</p>
    <UserCard :user :extra="extra" v-bind="patch" />
    <!-- 卡 B：对象在前、:extra 在后 → :extra 覆盖 patch.extra（显示「元老成员」） -->
    <p class="ok">卡 B：v-bind 对象在前、:extra 在后 → :extra 赢</p>
    <UserCard :user v-bind="patch" :extra="extra" />
  </section>
</template>

<style scoped>
.shorthand-lab {
  max-width: 560px;
  margin: 24px auto;
  padding: 20px;
  display: grid;
  gap: 10px;
  font-family: sans-serif;
}
.shorthand-lab h2 {
  margin: 0;
}
.shorthand-lab h3 {
  margin: 10px 0 4px;
  font-size: 14px;
}
.row {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  color: #55636d;
}
.row input,
.row select {
  padding: 4px 8px;
  border: 1px solid #dde5ea;
  border-radius: 6px;
  font: inherit;
}
.shorthand-lab > button {
  justify-self: start;
  padding: 6px 14px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
}
.shorthand-lab > button:hover {
  border-color: #42b883;
  color: #33a06f;
}
.log {
  margin: 0;
  font-size: 12px;
  color: #33a06f;
}
.note,
.ok {
  margin: 0;
  font-size: 12px;
}
.note {
  color: #b3453c;
}
.ok {
  color: #33a06f;
}
</style>
`,k=`<script setup lang="ts">
/**
 * 子组件：可配置用户卡片（接收方）—— 与练习版一致
 *
 * 设计决策：故意用「两个对象 prop」而不是一堆零散 prop ——
 * 这样 App 侧的 :user :extra 同名简写才有展示价值；如果 props 是零散的
 * name/level/badge，那该用 v-bind="user" 展开而不是同名简写。
 *
 * 坑点：props 是浅层只读代理 —— 修改 props.user.xxx 能改（对象内部
 * 不受单向数据流拦截），但属于反模式；演示里由父组件自己改自己的对象。
 */
interface UserInfo {
  name: string
  bio: string
}
interface ExtraInfo {
  level: string
  badge: string
}

defineProps<{
  /** 与 App 里的 user 变量同名 → 父组件可以写 :user */
  user: UserInfo
  /** 与 App 里的 extra 变量同名 → 父组件可以写 :extra */
  extra: ExtraInfo
}>()
<\/script>

<template>
  <article class="user-card">
    <header>
      <strong class="name">{{ user.name }}</strong>
      <span class="badge">{{ extra.badge }}</span>
    </header>
    <p class="bio">{{ user.bio }}</p>
    <footer>等级：{{ extra.level }}</footer>
  </article>
</template>

<style scoped>
.user-card {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 14px;
  display: grid;
  gap: 8px;
  background: #fff;
}
.user-card header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.name {
  font-size: 15px;
}
.badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #f0faf5;
  color: #33a06f;
  border: 1px solid #d8efe4;
}
.bio {
  margin: 0;
  font-size: 13px;
  color: #55636d;
}
footer {
  font-size: 12px;
  color: #8fa0ab;
}
</style>
`,E=JSON.parse('{"title":"09 同名 v-bind 简写","description":"Vue 3.4 同名简写 :user、动态参数 @[eventName]、v-bind 对象合并的顺序规则实验（后者覆盖前者）。","frontmatter":{"title":"09 同名 v-bind 简写","description":"Vue 3.4 同名简写 :user、动态参数 @[eventName]、v-bind 对象合并的顺序规则实验（后者覆盖前者）。","tags":["v-bind","模板语法","动态参数"]},"headers":[],"relativePath":"features/09-vbind-shorthand.md","filePath":"features/09-vbind-shorthand.md","lastUpdated":1792665939000}'),g={name:"features/09-vbind-shorthand.md"},f=Object.assign(g,{setup(b){const a={"App.vue":h,"UserCard.vue":c},t={"App.vue":u,"UserCard.vue":k};return(x,n)=>{const i=r("Playground");return o(),l("div",null,[n[0]||(n[0]=e("h1",{id:"同名-v-bind-简写",tabindex:"-1"},[s("同名 v-bind 简写 "),e("a",{class:"header-anchor",href:"#同名-v-bind-简写","aria-label":'Permalink to "同名 v-bind 简写"'},"​")],-1)),n[1]||(n[1]=e("blockquote",null,[e("p",null,[e("strong",null,"Same-name Shorthand · Vue 3.4"),s(" · 难度：入门 · 引入版本：Vue 3.4")])],-1)),n[2]||(n[2]=e("div",{class:"feature-summary"},"Vue 3.4 同名简写 :user、动态参数 @[eventName]、v-bind 对象合并的顺序规则实验（后者覆盖前者）。",-1)),p(i,{starter:a,solution:t}),n[3]||(n[3]=d("",18))])}}});export{E as __pageData,f as default};
