import{C as l,o,c as r,j as n,a as t,E as p,a2 as h}from"./chunks/framework.CE7vFz40.js";const d=`<script setup lang="ts">
/**
 * 练习：响应式系统精要 —— 1000 行大表 + 防抖搜索
 *
 * 表格的生成 / 过滤 / 渲染逻辑已写好，你的任务是把 4 个进阶 API 用对地方：
 *   TODO(1) rows 换成 shallowRef（1000 行数据不必逐行深层代理）
 *   TODO(2) 修好 addRow：shallowRef 下 push 不刷新视图
 *   TODO(3) 用 customRef 把 useDebouncedRef 升级为 300ms 防抖 ref
 *   TODO(4) 用 effectScope 收编统计 watch，「停止统计」按钮才能真正停下
 *
 * 设计决策：
 * - 表格只渲染过滤结果的前 20 行：iframe 沙箱里塞 1000 个 <tr> 会卡，
 *   「数据量大 ≠ 全量渲染」本身就是本课的性能主题之一；
 * - useDebouncedRef 内联在本文件：沙箱只允许 import 'vue'，
 *   组合式函数就近定义是教学沙箱的标准做法；
 * - filtered 始终 filter 出新数组：computed 只有「值变化」才通知 watch，
 *   若空关键词时直接返回 rows.value（同一个引用），统计 watch 会失灵。
 *
 * 坑点提醒：
 * - TODO(1) 完成前 addRow 是正常的（深层的 ref）；换成 shallowRef 后它
 *   会「静默失效」，这正是 TODO(2) 要修的东西；
 * - effectScope.stop() 是终态，停了就停了，重启要新建 scope（见参考答案）。
 */
import { computed, customRef, effectScope, ref, shallowRef, triggerRef, watch } from 'vue'

/* ───────── 1) 大数据列表：shallowRef + triggerRef ───────── */
const POOL = ['阿尔卑斯', '贝加尔', '加利福尼亚', '多瑙河', '爱琴海']
function genRows(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: \`\${POOL[i % POOL.length]}-\${i + 1}\`,
    score: (i * 37) % 100,
  }))
}

// TODO(1): 把 ref 换成 shallowRef —— 整表只做一层代理，性能立省
const rows = ref(genRows(1000))

// TODO(2): shallowRef 下这行 push 不再刷新视图，两种修法任选：
//   a) rows.value = [...rows.value, newRow]   —— 整体替换，天然触发
//   b) push 完调用 triggerRef(rows)           —— 手动触发，省一次数组拷贝
function addRow() {
  rows.value.push(genRows(1)[0])
}

// 整表替换：.value 引用换人，shallowRef 一定感知（保持原样即可）
function replaceRows() {
  rows.value = genRows(1000)
}

/* ───────── 2) 防抖搜索：customRef ───────── */
/**
 * TODO(3): 用 customRef 把普通 ref 升级为防抖 ref，套路四步：
 *   1. value / timer 放进函数闭包（这个 ref 的定时器归它自己管）
 *   2. get() 里调用 track() 收集依赖，再返回 value
 *   3. set(nv) 里先 clearTimeout(timer)，定时器到期后才执行
 *      value = nv 并调用 trigger()
 *   4. 最终 return customRef((track, trigger) => ({ get, set }))
 * 完成后连续打字，「用于过滤的关键词」要停顿 300ms 才跟上输入框。
 */
function useDebouncedRef(initial: string, delay = 300) {
  return ref(initial)
}
const keyword = useDebouncedRef('')

const filtered = computed(() => {
  // 始终返回新数组：保证 rows 或 keyword 变化时 watch(filtered) 可靠触发
  const kw = keyword.value.trim()
  return rows.value.filter((r) => !kw || r.name.includes(kw))
})
// 大列表只渲染前 20 行，避免沙箱卡顿（过滤仍作用于全部 1000 行）
const visibleRows = computed(() => filtered.value.slice(0, 20))

/* ───────── 3) effectScope：批量管理副作用 ───────── */
const statLog = ref<string[]>([])
// TODO(4): 把这个 watch 装进 effectScope：
//   const scope = effectScope()
//   scope.run(() => { watch(...) })
// 然后「停止统计」按钮里调用 scope.stop() —— Console 就安静了。
watch(filtered, (list) => {
  statLog.value.push(\`命中 \${list.length} 行\`)
  if (statLog.value.length > 30) statLog.value.shift()
  console.log(\`[统计] 当前命中 \${list.length} 行\`)
})
function stopStats() {
  // TODO(4): 在这里调用 scope.stop()，并 console.log 一条说明
}
<\/script>

<template>
  <section class="lab">
    <h2>⚡ 响应式系统精要：1000 行大表 + 防抖搜索</h2>

    <div class="search">
      <input v-model="keyword" placeholder="连续输入：阿、阿尔、阿尔卑…试试防抖" />
      <span class="kw">用于过滤的关键词：「{{ keyword || '（空）' }}」</span>
    </div>

    <p class="meta">
      共 {{ rows.length }} 行 · 命中 {{ filtered.length }} 行（表格只渲染前 20 行）
    </p>

    <div class="actions">
      <button @click="addRow">push 一行（看视图更不更新）</button>
      <button @click="replaceRows">整表替换 1000 行</button>
      <button @click="stopStats">停止 Console 统计</button>
    </div>

    <p class="meta">最近统计：{{ statLog.length ? statLog[statLog.length - 1] : '暂无' }}</p>

    <table>
      <thead>
        <tr><th>#</th><th>名称</th><th>分数</th></tr>
      </thead>
      <tbody>
        <tr v-for="row in visibleRows" :key="row.id">
          <td>{{ row.id }}</td><td>{{ row.name }}</td><td>{{ row.score }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.lab {
  max-width: 460px;
  margin: 24px auto;
  padding: 20px;
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  display: grid;
  gap: 12px;
  font-family: sans-serif;
}
.lab h2 {
  margin: 0;
  font-size: 17px;
}
.search {
  display: grid;
  gap: 6px;
}
.search input {
  padding: 6px 10px;
  border: 1px solid #d8e0e5;
  border-radius: 6px;
}
.kw {
  color: #33a06f;
  font-size: 12px;
}
.meta {
  margin: 0;
  color: #8fa0ab;
  font-size: 12px;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.actions button {
  padding: 5px 10px;
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
table {
  border-collapse: collapse;
  font-size: 13px;
}
th,
td {
  border-bottom: 1px solid #eef2f4;
  padding: 4px 10px;
  text-align: left;
}
th {
  color: #61707a;
}
</style>
`,c=`<script setup lang="ts">
/**
 * 参考答案：响应式系统精要 —— 1000 行大表 + 防抖搜索
 *
 * 相比练习版补充了：
 * 1. shallowRef + triggerRef 完整实现（注释里对比了两种触发方式）
 * 2. customRef 实现的 useDebouncedRef（防抖灵魂：先 clearTimeout 再 setTimeout）
 * 3. effectScope 统计作用域：stop 是终态，重启 = 新建 scope 重新收集
 * 4. 加分演示：markRaw 阻止「假图表实例」被代理（isReactive 前后对比）
 *
 * 为什么这么写：
 * - addRow 用 triggerRef 而不是展开拷贝：1000 行数组每次 push 都展开是
 *   O(n) 拷贝；triggerRef 复用原数组引用，O(1) 就把更新喊出去；
 * - 防抖的 timer 放在 customRef 闭包里而不是组件顶层：每个防抖 ref
 *   独立持有定时器，多个实例互不干扰；
 * - scope 用 let 声明：stop 不可逆，重启时整个换新，闭包里始终读到最新的那个；
 * - onUnmounted 里 stop：组件销毁时把作用域内所有副作用一并了断（好习惯）。
 */
import { computed, customRef, effectScope, isReactive, markRaw, onUnmounted, reactive, ref, shallowRef, triggerRef, watch } from "vue";

/* ───────── 1) shallowRef + triggerRef ───────── */
const POOL = ["阿尔卑斯", "贝加尔", "加利福尼亚", "多瑙河", "爱琴海"];
function genRows(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: \`\${POOL[i % POOL.length]}-\${i + 1}\`,
    score: (i * 37) % 100,
  }));
}

// shallowRef：只追踪 .value 的整体替换，内部 1000 个对象全部保持「素人」
const rows = shallowRef(genRows(1000));

function addRow() {
  // 直接 push 改的是内部属性，浅层的 shallowRef 感知不到 —— 需要 triggerRef
  rows.value.push(genRows(1)[0]);
  // triggerRef：手动喊一嗓子「内部变了，视图该更新了」，
  // 相比 [...rows.value, newRow] 省掉整个数组的拷贝
  triggerRef(rows);
}

function replaceRows() {
  rows.value = genRows(1000);
}

/* ───────── 2) customRef 防抖 ───────── */
function useDebouncedRef(initial: string, delay = 300) {
  let value = initial;
  // timer 放闭包里：这个 ref 的定时器归它自己管，多实例互不干扰
  let timer: ReturnType<typeof setTimeout> | undefined;
  return customRef((track, trigger) => ({
    get() {
      track(); // 依赖收集：谁读了我，我变了就要通知谁
      return value;
    },
    set(nv: string) {
      clearTimeout(timer); // 防抖灵魂：新输入进来，先取消上一次还没兑现的更新
      timer = setTimeout(() => {
        value = nv;
        trigger(); // 停顿满 delay 才真正发布新值
      }, delay);
    },
  }));
}
const keyword = useDebouncedRef("", 300);

const filtered = computed(() => {
  const kw = keyword.value.trim();
  return rows.value.filter((r) => !kw || r.name.includes(kw));
});
const visibleRows = computed(() => filtered.value.slice(0, 20));

/* ───────── 3) effectScope 统计作用域 ───────── */
const statLog = ref<string[]>([]);
const statsOn = ref(true);

// scope 用 let：stop 是终态，重启时整个换新
let scope = effectScope();
function startStatsWatch() {
  // 作用域会自动收编 run() 里创建的所有 computed / watch / watchEffect
  scope.run(() => {
    watch(filtered, (list) => {
      statLog.value.push(\`命中 \${list.length} 行\`);
      if (statLog.value.length > 30) statLog.value.shift();
      console.log(\`[统计] 当前命中 \${list.length} 行\`);
    });
  });
}
startStatsWatch();

function stopStats() {
  scope.stop(); // 一次性停止作用域内所有副作用
  statsOn.value = false;
  console.log("[统计] 作用域已停止，继续输入 —— Console 不会再打日志");
}

function restartStats() {
  scope.stop(); // 对已停止的 scope 再 stop 一次是安全的（幂等）
  scope = effectScope();
  startStatsWatch();
  statsOn.value = true;
  console.log("[统计] 新作用域已启动");
}

// 组件卸载时统一了断（沙箱里热重载会反复卸载/重挂，这个习惯尤其重要）
onUnmounted(() => scope.stop());

/* ───────── 4) 加分演示：markRaw ───────── */
// 假装这是一个昂贵的第三方图表实例：有自己的内部状态和渲染逻辑，
// 被代理后不仅性能受损、行为还可能异常（ECharts / 地图库的真实坑），
// markRaw 一劳永逸地把它标记为「永不代理」
const fakeChart = markRaw({ type: "canvas", version: "1.0", render: () => "painting…" });
const bonusState = reactive({ chart: fakeChart, plain: { type: "canvas" } });
const chartIsReactive = computed(() => isReactive(bonusState.chart)); // false：markRaw 生效
const plainIsReactive = computed(() => isReactive(bonusState.plain)); // true：普通对象被深层代理
<\/script>

<template>
  <section class="lab">
    <h2>⚡ 响应式系统精要：1000 行大表 + 防抖搜索</h2>

    <div class="search">
      <input v-model="keyword" placeholder="连续输入：阿、阿尔、阿尔卑…试试防抖" />
      <span class="kw">用于过滤的关键词：「{{ keyword || '（空）' }}」</span>
    </div>

    <p class="meta">
      共 {{ rows.length }} 行 · 命中 {{ filtered.length }} 行（表格只渲染前 20 行）
    </p>

    <div class="actions">
      <button @click="addRow">push 一行（triggerRef 已修复）</button>
      <button @click="replaceRows">整表替换 1000 行</button>
      <button @click="stopStats">停止 Console 统计</button>
      <button v-if="!statsOn" @click="restartStats">重启 Console 统计</button>
    </div>

    <p class="meta">最近统计：{{ statLog.length ? statLog[statLog.length - 1] : '暂无' }}</p>

    <fieldset class="bonus">
      <legend>加分演示：markRaw</legend>
      <p>
        markRaw 包裹的「图表实例」是响应式的吗？
        <strong>{{ chartIsReactive ? '是' : '否（markRaw 生效）' }}</strong>
      </p>
      <p>
        一起放进来的普通对象是响应式的吗？
        <strong>{{ plainIsReactive ? '是（被深层代理）' : '否' }}</strong>
      </p>
    </fieldset>

    <table>
      <thead>
        <tr><th>#</th><th>名称</th><th>分数</th></tr>
      </thead>
      <tbody>
        <tr v-for="row in visibleRows" :key="row.id">
          <td>{{ row.id }}</td><td>{{ row.name }}</td><td>{{ row.score }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.lab {
  max-width: 460px;
  margin: 24px auto;
  padding: 20px;
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  display: grid;
  gap: 12px;
  font-family: sans-serif;
}
.lab h2 {
  margin: 0;
  font-size: 17px;
}
.search {
  display: grid;
  gap: 6px;
}
.search input {
  padding: 6px 10px;
  border: 1px solid #d8e0e5;
  border-radius: 6px;
}
.kw {
  color: #33a06f;
  font-size: 12px;
}
.meta {
  margin: 0;
  color: #8fa0ab;
  font-size: 12px;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.actions button {
  padding: 5px 10px;
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
.bonus {
  border: 1px dashed #d9c48a;
  border-radius: 8px;
  padding: 10px 14px;
  display: grid;
  gap: 4px;
  font-size: 13px;
}
.bonus legend {
  color: #a07d1c;
  font-size: 12px;
  padding: 0 6px;
}
.bonus p {
  margin: 0;
}
table {
  border-collapse: collapse;
  font-size: 13px;
}
th,
td {
  border-bottom: 1px solid #eef2f4;
  padding: 4px 10px;
  text-align: left;
}
th {
  color: #61707a;
}
</style>
`,E=JSON.parse('{"title":"02 响应式系统精要","description":"用 shallowRef + triggerRef 撑住 1000 行大表，用 customRef 做防抖搜索，再用 effectScope 一键停掉所有副作用。","frontmatter":{"title":"02 响应式系统精要","description":"用 shallowRef + triggerRef 撑住 1000 行大表，用 customRef 做防抖搜索，再用 effectScope 一键停掉所有副作用。","tags":["shallowRef","customRef","effectScope","toRefs"]},"headers":[],"relativePath":"features/02-reactivity.md","filePath":"features/02-reactivity.md","lastUpdated":1792665939000}'),k={name:"features/02-reactivity.md"},y=Object.assign(k,{setup(g){const e={"App.vue":d},i={"App.vue":c};return(f,s)=>{const a=l("Playground");return o(),r("div",null,[s[0]||(s[0]=n("h1",{id:"响应式系统精要",tabindex:"-1"},[t("响应式系统精要 "),n("a",{class:"header-anchor",href:"#响应式系统精要","aria-label":'Permalink to "响应式系统精要"'},"​")],-1)),s[1]||(s[1]=n("blockquote",null,[n("p",null,[n("strong",null,"Reactivity System · shallowRef / customRef / effectScope"),t(" · 难度：进阶 · 引入版本：Vue 3.0")])],-1)),s[2]||(s[2]=n("div",{class:"feature-summary"},"用 shallowRef + triggerRef 撑住 1000 行大表，用 customRef 做防抖搜索，再用 effectScope 一键停掉所有副作用。",-1)),p(a,{starter:e,solution:i}),s[3]||(s[3]=h("",23))])}}});export{E as __pageData,y as default};
