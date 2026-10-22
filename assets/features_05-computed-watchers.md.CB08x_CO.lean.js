import{C as l,o as p,c as o,j as e,a as t,E as r,a2 as c}from"./chunks/framework.CE7vFz40.js";const d=`<script setup lang="ts">
/**
 * 练习：计算属性与侦听器
 *
 * 三个任务：
 *   TODO(1) watch + immediate：把「初始价格」也记进日志
 *   TODO(2) watch + deep：修好「改城市没反应」的侦听
 *   TODO(3) watch + once：让「首单立减」只生效一次
 *   TODO(4) watchEffect + onWatcherCleanup：取消上一次未完成的"请求"
 *
 * 设计决策：
 * - total 用 computed 而不是 watch：派生状态永远是 computed 的主场，
 *   watch 只负责「副作用」（写日志、发请求）；
 * - 搜索联想的"请求"用 800ms 的 setTimeout 模拟——足够慢，肉眼能看到
 *   竞态：连续输入时旧请求晚于新请求完成，把结果覆盖坏；
 * - 三块演示共用一个界面，starter 保证初始渲染零报错、控制台无红字。
 *
 * 坑点提醒：
 * - onWatcherCleanup 必须在 watchEffect 回调里「同步」调用，
 *   塞进 setTimeout 里注册是无效的；
 * - watch 一个 reactive 对象是隐式 deep 的，但 watch「ref 包的对象」
 *   默认只盯 .value 整体替换——这正是 TODO(2) 的病灶。
 */
import { computed, onWatcherCleanup, reactive, ref, watch, watchEffect } from 'vue'

/* ───────── 1) computed vs watch ───────── */
const price = ref(10)
const count = ref(2)
// 派生状态 → computed（有缓存、无副作用）
const total = computed(() => price.value * count.value)

// 副作用（记日志）→ watch
const priceLog = ref<string[]>([])
// TODO(1): 加第三个参数 { immediate: true }，让初始值 10 也被记录一次
//   （注意：immediate 的第一轮回调里 oldValue 是 undefined，参考答案里做了处理）
watch(price, (nv, ov) => {
  priceLog.value.push(\`价格 \${ov} → \${nv}\`)
})

/* ───────── 2) watch 的 deep / once 选项 ───────── */
// ref 包对象：watch 默认只盯 .value 的整体替换
const profile = ref({ name: '小明', address: { city: '北京' } })

const deepLog = ref<string[]>([])
// TODO(2): 改城市后这条 watch 没反应！加上 { deep: true } 让它深入追踪内部属性
watch(profile, () => {
  deepLog.value.push(\`城市变为 \${profile.value.address.city}\`)
})

// 「首单立减」：只在价格第一次变化时生效一次
const couponLog = ref<string[]>([])
// TODO(3): 给 watch 加 { once: true }，让它触发一次后自动停止
watch(price, () => {
  couponLog.value.push('首单立减已使用（这个 watcher 应该自动停止了）')
})

/* ───────── 3) watchEffect + onWatcherCleanup 搜索联想 ───────── */
const keyword = ref('')
const suggestions = ref<string[]>([])
const stats = reactive({ requested: 0, delivered: 0, cancelled: 0 })
const SUGGEST_POOL = [
  '前端性能优化',
  '前端工程化',
  'Vue3 教程',
  'TypeScript 入门',
  'Vite 配置',
  '响应式原理',
]

watchEffect(() => {
  const kw = keyword.value.trim()
  stats.requested++ // 每次依赖变化 = 发起一次"请求"
  if (!kw) {
    suggestions.value = []
    return
  }
  // 模拟网络请求：800ms 后才返回结果
  const timer = setTimeout(() => {
    stats.delivered++
    suggestions.value = SUGGEST_POOL.filter((s) => s.includes(kw))
  }, 800)
  // TODO(4): 注册清理函数 onWatcherCleanup(() => { ... })：
  //   关键词再变时取消上一次还没返回的请求（clearTimeout + stats.cancelled++）
})
<\/script>

<template>
  <section class="cw">
    <h2>🔭 计算属性与侦听器</h2>

    <div class="block">
      <h3>① computed vs watch</h3>
      <label>单价 <input v-model.number="price" type="number" min="0" /></label>
      <label>数量 <input v-model.number="count" type="number" min="0" /></label>
      <p>
        总价（computed，自动缓存）：<strong>{{ total }}</strong>
      </p>
      <p class="log">
        价格日志（watch 副作用）：
        {{ priceLog.length ? priceLog.join(' | ') : '（还没有记录）' }}
      </p>
    </div>

    <div class="block">
      <h3>② deep / once 选项</h3>
      <label>城市 <input v-model="profile.address.city" /></label>
      <p class="log">
        deep 侦听日志：
        {{ deepLog.length ? deepLog.join(' | ') : '（改上面的城市试试——现在是不是没反应？）' }}
      </p>
      <p class="log">优惠券：{{ couponLog.length ? couponLog[0] : '（改一次价格触发）' }}</p>
    </div>

    <div class="block">
      <h3>③ watchEffect 搜索联想 + 竞态取消</h3>
      <input v-model="keyword" placeholder="试试快速输入：Vue、TypeScript…" />
      <p class="meta">
        已发起 {{ stats.requested }} · 已返回 {{ stats.delivered }} · 已被取消 {{ stats.cancelled }}
      </p>
      <ul v-if="suggestions.length">
        <li v-for="s in suggestions" :key="s">{{ s }}</li>
      </ul>
      <p v-else class="empty">暂无联想结果（等待 800ms 的"请求"返回…）</p>
    </div>
  </section>
</template>

<style scoped>
.cw {
  max-width: 420px;
  margin: 24px auto;
  padding: 20px;
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  display: grid;
  gap: 16px;
  font-family: sans-serif;
}
.cw h2 {
  margin: 0;
  font-size: 17px;
}
.block {
  border: 1px solid #eef2f4;
  border-radius: 8px;
  padding: 12px 14px;
  display: grid;
  gap: 8px;
}
.block h3 {
  margin: 0;
  font-size: 14px;
  color: #61707a;
}
.block label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.block input {
  width: 160px;
  padding: 5px 8px;
  border: 1px solid #d8e0e5;
  border-radius: 6px;
}
.block p {
  margin: 0;
  font-size: 13px;
}
.log {
  color: #4a5a64;
  font-size: 12px;
  word-break: break-all;
}
.meta {
  color: #8fa0ab;
  font-size: 12px;
}
.empty {
  color: #8fa0ab;
  font-size: 12px;
}
.block ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 4px;
}
.block li {
  padding: 5px 10px;
  background: #f5f7f8;
  border-radius: 6px;
  font-size: 13px;
}
</style>
`,h=`<script setup lang="ts">
/**
 * 参考答案：计算属性与侦听器
 *
 * 相比练习版补充了：
 * 1. immediate: true —— 并处理「首轮 oldValue 是 undefined」的真实坑
 * 2. deep: true —— 修好 ref 包对象时 watch 默认浅层的问题
 * 3. once: true —— 首单立减只生效一次
 * 4. onWatcherCleanup —— 取消上一次未返回的"请求"，杜绝竞态
 * 5. 加分演示：Vue 3.5 watcher 实例的 pause() / resume()
 *
 * 为什么这么写：
 * - 清理函数在 watchEffect 回调体里同步注册：本轮被新一轮顶替时，
 *   Vue 会先执行上一轮的 onWatcherCleanup 再跑新回调——顺序有保证；
 * - timer 是每轮回调的局部变量：闭包天然持有「自己那一轮」的定时器，
 *   清理函数清的永远是上一轮的，不会误伤当前轮；
 * - 深层 watch 回调里 newValue === oldValue（同一个代理），所以日志
 *   直接读 profile.value.address.city 的最新值，不做新旧对比。
 */
import { computed, onWatcherCleanup, reactive, ref, watch, watchEffect } from "vue";

/* ───────── 1) computed vs watch ───────── */
const price = ref(10);
const count = ref(2);
// 派生状态 → computed：依赖不变走缓存，模板当普通变量用
const total = computed(() => price.value * count.value);

const priceLog = ref<string[]>([]);

// immediate：创建时立即跑一次；第一轮的 oldValue 是 undefined —— 真实踩坑点
watch(
  price,
  (nv, ov) => {
    priceLog.value.push(ov === undefined ? \`初始价格 \${nv}\` : \`价格 \${ov} → \${nv}\`);
  },
  { immediate: true },
);

/* ───────── 2) deep / once 选项 ───────── */
const profile = ref({ name: "小明", address: { city: "北京" } });
const deepLog = ref<string[]>([]);

// deep: true：深入追踪 ref 包的对象内部属性
// （注意：watch reactive 对象本身是隐式 deep 的，watch ref 包对象默认浅层）
watch(
  profile,
  () => {
    deepLog.value.push(\`城市变为 \${profile.value.address.city}\`);
  },
  { deep: true },
);

const couponLog = ref<string[]>([]);

// once: true：触发一次后自动停止，连手动 stop 都省了
watch(
  price,
  () => {
    couponLog.value.push("首单立减已使用（此 watcher 已自动停止）");
  },
  { once: true },
);

/* ───────── 3) watchEffect 搜索联想 + 竞态取消 ───────── */
const keyword = ref("");
const suggestions = ref<string[]>([]);
const stats = reactive({ requested: 0, delivered: 0, cancelled: 0 });
const SUGGEST_POOL = [
  "前端性能优化",
  "前端工程化",
  "Vue3 教程",
  "TypeScript 入门",
  "Vite 配置",
  "响应式原理",
];

watchEffect(() => {
  const kw = keyword.value.trim();
  stats.requested++;
  if (!kw) {
    suggestions.value = [];
    return;
  }
  // 模拟网络请求：800ms 后才返回结果
  const timer = setTimeout(() => {
    stats.delivered++;
    suggestions.value = SUGGEST_POOL.filter((s) => s.includes(kw));
  }, 800);

  // Vue 3.5 的 onWatcherCleanup：本轮副作用被重新运行 / 停止时，先执行这里。
  // 必须在回调体里同步注册 —— 塞进 setTimeout 内部就挂不上了。
  // （3.5 之前的老写法：watchEffect((onCleanup) => ...) 回调参数，作用相同）
  onWatcherCleanup(() => {
    clearTimeout(timer);
    stats.cancelled++;
    console.log(\`[联想] 取消了关于「\${kw}」的请求\`);
  });
});

/* ───────── 4) 加分演示：watcher 实例的 pause / resume（Vue 3.5） ───────── */
const ticker = ref(0);
const tickerLog = ref<string[]>([]);
// 3.5 起 watch 返回的句柄上多了 pause / resume（stop 依旧）
const tickerWatcher = watch(ticker, (nv) => {
  tickerLog.value.push(\`→ \${nv}\`);
  if (tickerLog.value.length > 10) tickerLog.value.shift();
});

function tick() {
  ticker.value++;
}
function pauseTicker() {
  tickerWatcher.pause(); // 暂停：数据继续变，但回调不执行
  console.log("[加分] 计数日志已暂停");
}
function resumeTicker() {
  tickerWatcher.resume(); // 恢复：之后的变更重新触发回调（暂停期间的不会补发）
  console.log("[加分] 计数日志已恢复");
}
<\/script>

<template>
  <section class="cw">
    <h2>🔭 计算属性与侦听器</h2>

    <div class="block">
      <h3>① computed vs watch</h3>
      <label>单价 <input v-model.number="price" type="number" min="0" /></label>
      <label>数量 <input v-model.number="count" type="number" min="0" /></label>
      <p>
        总价（computed，自动缓存）：<strong>{{ total }}</strong>
      </p>
      <p class="log">
        价格日志（immediate 首条也记了）：
        {{ priceLog.length ? priceLog.join(' | ') : '（还没有记录）' }}
      </p>
    </div>

    <div class="block">
      <h3>② deep / once 选项</h3>
      <label>城市 <input v-model="profile.address.city" /></label>
      <p class="log">
        deep 侦听日志：{{ deepLog.length ? deepLog.join(' | ') : '（改上面的城市试试）' }}
      </p>
      <p class="log">优惠券：{{ couponLog.length ? couponLog[0] : '（改一次价格触发，只此一次）' }}</p>
    </div>

    <div class="block">
      <h3>③ watchEffect 搜索联想 + 竞态取消</h3>
      <input v-model="keyword" placeholder="试试快速输入：Vue、TypeScript…" />
      <p class="meta">
        已发起 {{ stats.requested }} · 已返回 {{ stats.delivered }} · 已被取消 {{ stats.cancelled }}
      </p>
      <ul v-if="suggestions.length">
        <li v-for="s in suggestions" :key="s">{{ s }}</li>
      </ul>
      <p v-else class="empty">暂无联想结果（清空输入或等待"请求"返回…）</p>
    </div>

    <div class="block">
      <h3>④ 加分：watcher 实例的 pause / resume（Vue 3.5）</h3>
      <div class="row">
        <button @click="tick">计数 +1（{{ ticker }}）</button>
        <button @click="pauseTicker">暂停日志</button>
        <button @click="resumeTicker">恢复日志</button>
      </div>
      <p class="log">计数日志：{{ tickerLog.length ? tickerLog.join(' ') : '（暂无）' }}</p>
      <p class="meta">暂停期间计数照常变化，但回调不执行——适合「弹窗打开时先别刷日志」这类场景。</p>
    </div>
  </section>
</template>

<style scoped>
.cw {
  max-width: 420px;
  margin: 24px auto;
  padding: 20px;
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  display: grid;
  gap: 16px;
  font-family: sans-serif;
}
.cw h2 {
  margin: 0;
  font-size: 17px;
}
.block {
  border: 1px solid #eef2f4;
  border-radius: 8px;
  padding: 12px 14px;
  display: grid;
  gap: 8px;
}
.block h3 {
  margin: 0;
  font-size: 14px;
  color: #61707a;
}
.block label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.block input {
  width: 160px;
  padding: 5px 8px;
  border: 1px solid #d8e0e5;
  border-radius: 6px;
}
.block p {
  margin: 0;
  font-size: 13px;
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
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.log {
  color: #4a5a64;
  font-size: 12px;
  word-break: break-all;
}
.meta {
  color: #8fa0ab;
  font-size: 12px;
}
.empty {
  color: #8fa0ab;
  font-size: 12px;
}
.block ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 4px;
}
.block li {
  padding: 5px 10px;
  background: #f5f7f8;
  border-radius: 6px;
  font-size: 13px;
}
</style>
`,E=JSON.parse('{"title":"05 计算属性与侦听器","description":"computed 管派生、watch 管副作用、watchEffect 管自动追踪，再用 onWatcherCleanup 取消上一次搜索联想","frontmatter":{"title":"05 计算属性与侦听器","description":"computed 管派生、watch 管副作用、watchEffect 管自动追踪，再用 onWatcherCleanup 取消上一次搜索联想","tags":["computed","watch","watchEffect","onWatcherCleanup"]},"headers":[],"relativePath":"features/05-computed-watchers.md","filePath":"features/05-computed-watchers.md","lastUpdated":1792665939000}'),k={name:"features/05-computed-watchers.md"},m=Object.assign(k,{setup(u){const s={"App.vue":d},a={"App.vue":h};return(g,n)=>{const i=l("Playground");return p(),o("div",null,[n[0]||(n[0]=e("h1",{id:"计算属性与侦听器",tabindex:"-1"},[t("计算属性与侦听器 "),e("a",{class:"header-anchor",href:"#计算属性与侦听器","aria-label":'Permalink to "计算属性与侦听器"'},"​")],-1)),n[1]||(n[1]=e("blockquote",null,[e("p",null,[e("strong",null,"computed / watch / watchEffect / onWatcherCleanup"),t(" · 难度：进阶 · 引入版本：Vue 3.0 / 3.5 增强")])],-1)),n[2]||(n[2]=e("div",{class:"feature-summary"},"computed 管派生、watch 管副作用、watchEffect 管自动追踪，再用 onWatcherCleanup 取消上一次搜索联想",-1)),r(i,{starter:s,solution:a}),n[3]||(n[3]=c("",23))])}}});export{E as __pageData,m as default};
