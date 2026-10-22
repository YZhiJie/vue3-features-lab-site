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
`,E=JSON.parse('{"title":"09 同名 v-bind 简写","description":"Vue 3.4 同名简写 :user、动态参数 @[eventName]、v-bind 对象合并的顺序规则实验（后者覆盖前者）。","frontmatter":{"title":"09 同名 v-bind 简写","description":"Vue 3.4 同名简写 :user、动态参数 @[eventName]、v-bind 对象合并的顺序规则实验（后者覆盖前者）。","tags":["v-bind","模板语法","动态参数"]},"headers":[],"relativePath":"features/09-vbind-shorthand.md","filePath":"features/09-vbind-shorthand.md","lastUpdated":1792665939000}'),g={name:"features/09-vbind-shorthand.md"},f=Object.assign(g,{setup(b){const a={"App.vue":h,"UserCard.vue":c},t={"App.vue":u,"UserCard.vue":k};return(x,n)=>{const i=r("Playground");return o(),l("div",null,[n[0]||(n[0]=e("h1",{id:"同名-v-bind-简写",tabindex:"-1"},[s("同名 v-bind 简写 "),e("a",{class:"header-anchor",href:"#同名-v-bind-简写","aria-label":'Permalink to "同名 v-bind 简写"'},"​")],-1)),n[1]||(n[1]=e("blockquote",null,[e("p",null,[e("strong",null,"Same-name Shorthand · Vue 3.4"),s(" · 难度：入门 · 引入版本：Vue 3.4")])],-1)),n[2]||(n[2]=e("div",{class:"feature-summary"},"Vue 3.4 同名简写 :user、动态参数 @[eventName]、v-bind 对象合并的顺序规则实验（后者覆盖前者）。",-1)),p(i,{starter:a,solution:t}),n[3]||(n[3]=d(`<hr><h1 id="同名-v-bind-简写-1" tabindex="-1">同名 v-bind 简写 <a class="header-anchor" href="#同名-v-bind-简写-1" aria-label="Permalink to &quot;同名 v-bind 简写&quot;">​</a></h1><h2 id="这是什么" tabindex="-1">这是什么 <a class="header-anchor" href="#这是什么" aria-label="Permalink to &quot;这是什么&quot;">​</a></h2><p>Vue 3.4 给模板带来了「同名简写」：当绑定的变量名与属性名一致时， 值可以省略 —— <code>:data</code> 等价于 <code>:data=&quot;data&quot;</code>。要传的 props 越多， 省掉的重复越明显：</p><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 3.4 之前 --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">UserCard</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> :</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">user</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">user</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> :</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">extra</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">extra</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 3.4 同名简写 --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">UserCard</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> :</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">user</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> :</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">extra</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;</span></span></code></pre></div><p>它只是书写糖，编译产物完全相同；同一套思路也适用于动态参数 <code>@[eventName]</code>，并且可以和 <code>v-bind=&quot;obj&quot;</code> 对象展开混用 （混用时有一条重要的顺序规则，见下）。</p><h2 id="三条核心规则" tabindex="-1">三条核心规则 <a class="header-anchor" href="#三条核心规则" aria-label="Permalink to &quot;三条核心规则&quot;">​</a></h2><table tabindex="0"><thead><tr><th>写法</th><th>含义</th><th>注意</th></tr></thead><tbody><tr><td><code>:data</code></td><td><code>:data=&quot;data&quot;</code> 的同名简写</td><td>变量名必须与属性名完全一致（含大小写）</td></tr><tr><td><code>@[eventName]=&quot;fn&quot;</code></td><td>动态参数：属性名由表达式决定</td><td>表达式只能是单个标识符，不能有空格/引号</td></tr><tr><td><code>&lt;UserCard v-bind=&quot;obj&quot; :level=&quot;v&quot; /&gt;</code></td><td>对象展开 + 显式绑定混用</td><td><strong>后面的覆盖前面的</strong>，与书写形式无关</td></tr></tbody></table><p>关于顺序规则（最容易翻车）：<code>v-bind=&quot;obj&quot;</code> 展开后的每个键都算一次 「显式绑定」，覆盖关系只看<strong>书写顺序</strong>：</p><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 对象在后：obj.level 赢 --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">UserCard</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> :</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">level</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">myLevel</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> v-bind</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{ level: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;来自 obj&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- 对象在前：myLevel 赢 --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">UserCard</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> v-bind</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{ level: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;来自 obj&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> :</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">level</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">myLevel</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;</span></span></code></pre></div><h2 id="动手试" tabindex="-1">动手试 <a class="header-anchor" href="#动手试" aria-label="Permalink to &quot;动手试&quot;">​</a></h2><p>演练场是一个「可配置用户卡片」：user / extra 两个对象在 App.vue 里声明， 通过同名简写传给子组件 UserCard.vue。按 TODO 补全：</p><ol><li>TODO(1) 把区块① 的 <code>:user=&quot;user&quot; :extra=&quot;extra&quot;</code> 改成同名简写 <code>:user :extra</code></li><li>TODO(2) 动态参数按钮：用 <code>@[eventName]=&quot;onPing&quot;</code> 替换静态写法， 下拉框可把触发事件从 click 切换到 mouseenter</li><li>TODO(3) 对照实验：区块③ 摆两张卡 —— A 卡 <code>v-bind=&quot;patch&quot;</code> 在后、 B 卡在前，直观感受「后者覆盖前者」</li><li>参考答案还演示了：改「试试改名字」输入框时卡片实时更新 （reactive/ref 数据穿 props 依然保持响应式）</li></ol><h2 id="常见坑-真实踩坑记录" tabindex="-1">常见坑（真实踩坑记录） <a class="header-anchor" href="#常见坑-真实踩坑记录" aria-label="Permalink to &quot;常见坑（真实踩坑记录）&quot;">​</a></h2><ul><li><strong>动态参数里写不了表达式</strong>：<code>:[eventName + &#39;Suffix&#39;]</code> 直接编译报错 —— 动态参数只能是单个标识符；复杂逻辑放 computed 里再传进来。</li><li><strong>in-DOM 模板的动态参数被小写化</strong>：浏览器解析 HTML 时会把属性名转成 小写，<code>:[attrName]</code> 会变成 <code>attrname</code>。只有写在 <code>.vue</code> 文件里 （走 SFC 编译器）才保留大小写 —— 本沙箱正是 SFC 编译，不用担心。</li><li><strong>同名简写要求「名字对得上」</strong>：<code>const userData = {...}</code> 想传给 <code>:user-data</code> 就不能简写（没有叫 user-data 的变量），只能写 <code>:user-data=&quot;userData&quot;</code>。</li><li><strong>v-bind 对象的覆盖顺序与直觉相反</strong>：合并时后者赢 —— 把「默认值对象」 放在显式绑定之后，默认值会悄悄覆盖你的显式值。约定俗成：把 <code>v-bind=&quot;defaults&quot;</code> 写在最前面，让显式绑定有机会覆盖它。</li><li><strong><code>:data</code> 绑的是「整个对象」</strong>：同名简写不会自动展开 —— 子组件如果期望 的是一堆零散 prop，收到的却是一个名为 data 的对象 prop； 需要展开请写 <code>v-bind=&quot;data&quot;</code>。</li></ul><hr><h2 id="源码参考" tabindex="-1">源码参考 <a class="header-anchor" href="#源码参考" aria-label="Permalink to &quot;源码参考&quot;">​</a></h2><ul><li>特性目录：<a href="https://github.com/YZhiJie/vue3-features-lab/tree/main/src/features/09-vbind-shorthand" target="_blank" rel="noreferrer"><code>src/features/09-vbind-shorthand/</code></a></li></ul>`,18))])}}});export{E as __pageData,f as default};
