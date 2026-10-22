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
`,E=JSON.parse('{"title":"05 计算属性与侦听器","description":"computed 管派生、watch 管副作用、watchEffect 管自动追踪，再用 onWatcherCleanup 取消上一次搜索联想","frontmatter":{"title":"05 计算属性与侦听器","description":"computed 管派生、watch 管副作用、watchEffect 管自动追踪，再用 onWatcherCleanup 取消上一次搜索联想","tags":["computed","watch","watchEffect","onWatcherCleanup"]},"headers":[],"relativePath":"features/05-computed-watchers.md","filePath":"features/05-computed-watchers.md","lastUpdated":1792665939000}'),k={name:"features/05-computed-watchers.md"},m=Object.assign(k,{setup(u){const s={"App.vue":d},a={"App.vue":h};return(g,n)=>{const i=l("Playground");return p(),o("div",null,[n[0]||(n[0]=e("h1",{id:"计算属性与侦听器",tabindex:"-1"},[t("计算属性与侦听器 "),e("a",{class:"header-anchor",href:"#计算属性与侦听器","aria-label":'Permalink to "计算属性与侦听器"'},"​")],-1)),n[1]||(n[1]=e("blockquote",null,[e("p",null,[e("strong",null,"computed / watch / watchEffect / onWatcherCleanup"),t(" · 难度：进阶 · 引入版本：Vue 3.0 / 3.5 增强")])],-1)),n[2]||(n[2]=e("div",{class:"feature-summary"},"computed 管派生、watch 管副作用、watchEffect 管自动追踪，再用 onWatcherCleanup 取消上一次搜索联想",-1)),r(i,{starter:s,solution:a}),n[3]||(n[3]=c(`<hr><h1 id="计算属性与侦听器-computed-watch-watcheffect" tabindex="-1">计算属性与侦听器（computed / watch / watchEffect） <a class="header-anchor" href="#计算属性与侦听器-computed-watch-watcheffect" aria-label="Permalink to &quot;计算属性与侦听器（computed / watch / watchEffect）&quot;">​</a></h1><h2 id="这是什么" tabindex="-1">这是什么 <a class="header-anchor" href="#这是什么" aria-label="Permalink to &quot;这是什么&quot;">​</a></h2><p>三者都能「响应变化」，但分工完全不同：</p><ul><li><strong>computed</strong>：派生状态。依赖不变就走缓存，模板里当普通变量用。<strong>只做计算，不做副作用</strong>。</li><li><strong>watch</strong>：副作用的家。数据变了要「做事」时用它——写日志、发请求、操作 DOM、持久化。</li><li><strong>watchEffect</strong>：自动追踪的副作用。回调里<strong>读到谁就追踪谁</strong>，立即执行一次；适合「依赖会动态变化」的场景。</li><li><strong>onWatcherCleanup</strong>（Vue 3.5 新增）：在 watchEffect / watch 回调里<strong>同步注册</strong>清理函数——上一轮副作用被新一轮顶替时自动执行，是防竞态的官方正解。</li></ul><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setup</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> lang</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ts&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { computed, watch, watchEffect, onWatcherCleanup } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><h2 id="核心-api-速览" tabindex="-1">核心 API 速览 <a class="header-anchor" href="#核心-api-速览" aria-label="Permalink to &quot;核心 API 速览&quot;">​</a></h2><table tabindex="0"><thead><tr><th>API / 选项</th><th>用途</th><th>关键点</th></tr></thead><tbody><tr><td><code>computed(fn)</code></td><td>派生状态 + 缓存</td><td>里头别发请求、别改别的 ref</td></tr><tr><td><code>watch(src, cb, opts)</code></td><td>显式依赖的副作用</td><td>回调拿到 <code>(newVal, oldVal, onCleanup)</code></td></tr><tr><td><code>watchEffect(cb)</code></td><td>自动追踪的立即副作用</td><td>读到谁追谁；依赖写进分支里要小心</td></tr><tr><td><code>onWatcherCleanup(fn)</code></td><td>注册本轮清理函数（3.5）</td><td>必须<strong>同步</strong>调用；重跑 / 停止前先执行</td></tr><tr><td><code>immediate: true</code></td><td>创建时立即跑一次回调</td><td>首轮 <code>oldVal</code> 是 <code>undefined</code></td></tr><tr><td><code>deep: true</code></td><td>深入追踪对象内部</td><td>大对象上开销大；watch reactive 对象本身则隐式 deep</td></tr><tr><td><code>once: true</code></td><td>触发一次后自动停止</td><td>与 <code>immediate</code> 同用时立即执行完就停</td></tr></tbody></table><h2 id="动手试" tabindex="-1">动手试 <a class="header-anchor" href="#动手试" aria-label="Permalink to &quot;动手试&quot;">​</a></h2><p>右侧起始代码有三块演示，按 TODO 补全：</p><ol><li>TODO(1)：给价格日志的 watch 加 <code>{ immediate: true }</code>，让初始值也被记录</li><li>TODO(2)：修好「改城市没反应」的侦听（ref 包对象时 watch 默认浅层）</li><li>TODO(3)：给「首单立减」的 watch 加 <code>{ once: true }</code>，只生效一次</li><li>TODO(4)：搜索联想里用 <code>onWatcherCleanup</code> 取消上一次未返回的&quot;请求&quot;（800ms setTimeout 模拟），观察「已被取消」计数从 0 变成正常</li><li>参考答案还演示了：Vue 3.5 watcher 实例的 <code>pause() / resume()</code></li></ol><h2 id="watch-vs-watcheffect-一张表选型" tabindex="-1">watch vs watchEffect：一张表选型 <a class="header-anchor" href="#watch-vs-watcheffect-一张表选型" aria-label="Permalink to &quot;watch vs watchEffect：一张表选型&quot;">​</a></h2><table tabindex="0"><thead><tr><th>维度</th><th><code>watch</code></th><th><code>watchEffect</code></th></tr></thead><tbody><tr><td>依赖</td><td>显式声明（听谁的写谁）</td><td>隐式收集（读到谁追谁）</td></tr><tr><td>首次执行</td><td>默认不执行（要 <code>immediate</code>）</td><td>立即执行一次</td></tr><tr><td>新旧值</td><td>回调拿到 <code>(nv, ov)</code></td><td>拿不到旧值</td></tr><tr><td>适合</td><td>表单联动、按字段发请求</td><td>一堆响应式灌进同一段逻辑</td></tr></tbody></table><p>选型口诀：<strong>知道听谁的就 watch，说不清听谁的就 watchEffect</strong>。但依赖藏在条件分支里时慎用 watchEffect——分支没走到的那次运行不会追踪对应依赖，容易漏。</p><h2 id="一个典型竞态的三代解法" tabindex="-1">一个典型竞态的三代解法 <a class="header-anchor" href="#一个典型竞态的三代解法" aria-label="Permalink to &quot;一个典型竞态的三代解法&quot;">​</a></h2><p>搜索联想的竞态：输入「vue」后马上改成「vue3」，两个 800ms 的&quot;请求&quot;都在路上，<strong>旧请求后返回就会覆盖新结果</strong>。三代解法对比：</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ① 手动记 token（3.0 起就可行）</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> latest </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">watchEffect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> id</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> ++</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">latest</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  fakeSearch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(keyword.value, (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">list</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (id </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">===</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> latest) suggestions.value </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> list </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 过期请求直接丢弃</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  })</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ② onCleanup 回调参数（3.0 官方写法）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">watchEffect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">((</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">onCleanup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> timer</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setTimeout</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(fetch, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">800</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  onCleanup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> clearTimeout</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(timer))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ③ onWatcherCleanup（3.5 新增，语义更直白）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">watchEffect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> timer</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> setTimeout</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(fetch, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">800</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  onWatcherCleanup</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> clearTimeout</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(timer))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><p>本章演示用的是 ③。共同思想：<strong>新一轮副作用启动前，先把上一轮的「未竟之事」料理干净</strong>。</p><h2 id="常见坑-真实踩坑记录" tabindex="-1">常见坑（真实踩坑记录） <a class="header-anchor" href="#常见坑-真实踩坑记录" aria-label="Permalink to &quot;常见坑（真实踩坑记录）&quot;">​</a></h2><ul><li><strong>watch 一个普通属性</strong>：<code>watch(profile.address.city, ...)</code> 传进去的是个字符串，永远不触发；要用 getter：<code>() =&gt; profile.address.city</code>。</li><li><strong>ref 包对象默认浅</strong>：<code>watch(objRef, cb)</code> 只在 <code>.value</code> 整体替换时触发，改内部属性没反应；要么加 <code>{ deep: true }</code>，要么 watch getter（watch reactive 对象本身反而是隐式 deep 的，别记混）。</li><li><strong>新旧值是同一个引用</strong>：watch 一个对象（或数组）时，push 之后 <code>newVal === oldVal</code>——拿到的是同一个代理，想 diff 得自己留快照。</li><li><strong>onWatcherCleanup 注册晚了</strong>：它必须在回调执行期间同步调用；放进 <code>setTimeout</code> 里再注册，清理函数永远不会被挂上。</li><li><strong>computed 里做副作用</strong>：在 computed 里发请求 / 改别的 ref，缓存机制会让它「有时候不执行」，行为诡异——副作用请去 watch / watchEffect。</li><li><strong>忘了 watchEffect 立即执行</strong>：它创建时就跑一次（不像 watch 默认等变化），首次跑时依赖还不全（比如还没挂载的 DOM）就会出错。</li></ul><hr><h2 id="源码参考" tabindex="-1">源码参考 <a class="header-anchor" href="#源码参考" aria-label="Permalink to &quot;源码参考&quot;">​</a></h2><ul><li>特性目录：<a href="https://github.com/YZhiJie/vue3-features-lab/tree/main/src/features/05-computed-watchers" target="_blank" rel="noreferrer"><code>src/features/05-computed-watchers/</code></a></li></ul>`,23))])}}});export{E as __pageData,m as default};
