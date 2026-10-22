import{C as s,o as a,c as l,j as e,a as t,E as r,a2 as c}from"./chunks/framework.CE7vFz40.js";const p=`<script setup lang="ts">
/**
 * 练习：自定义指令（Custom Directives）
 *
 * 三个 TODO 覆盖三类知识点：
 *   TODO(1) vFocus        —— mounted 钩子：元素插入后自动聚焦
 *   TODO(2) vClickOutside —— mounted 注册 / unmounted 注销（成对清理）
 *   TODO(3) vTooltip      —— binding 的 value / arg / modifiers + updated
 *
 * 约定：<script setup> 中 const vXxx = ... 即局部指令，模板里写 v-xxx。
 * 下面的空对象/空函数只是占位（让未完成的模板也能编译运行），
 * 完成一个 TODO 就替换掉对应的占位声明。
 */
import { ref } from "vue";

/* ── 生命周期日志：观察钩子触发时序，验证 mounted/unmounted 是否成对 ── */
const logs = ref<string[]>([]);
function log(msg: string) {
  logs.value.unshift(\`[\${new Date().toLocaleTimeString()}] \${msg}\`);
  if (logs.value.length > 20) logs.value.pop();
}

/* TODO(1) 自动聚焦
 *   写法：const vFocus = { mounted(el) { el.focus() } }
 *   - el 的类型是 HTMLInputElement（这里绑在 <input> 上）
 *   - 比原生 autofocus 强：v-if 动态插入元素时也会重新聚焦
 */
const vFocus = {};

/* TODO(2) 点击外部关闭
 *
 *   const vClickOutside = {
 *     mounted(el, binding) {
 *       const handler = (e: MouseEvent) => {
 *         // 点击目标不在指令元素内部 → 调用绑定的回调
 *         if (!el.contains(e.target as Node)) binding.value?.()
 *       }
 *       // 坑①：必须延后一个宏任务再注册！触发面板打开的那次 click
 *       //       还在派发，同步注册会让面板「刚打开就被自己关掉」
 *       const timer = window.setTimeout(() => {
 *         document.addEventListener('click', handler)
 *       }, 0)
 *       // 坑②：handler / timer 要存到元素上，unmounted 时才能取出来清理
 *       ;(el as any).__clickOutside = { handler, timer }
 *       log('click-outside：mounted（已安排注册）')
 *     },
 *     unmounted(el) {
 *       // TODO: clearTimeout + removeEventListener + 删除自定义属性
 *       //       并 log('click-outside：unmounted（监听已移除）')
 *     },
 *   }
 *
 * 注意：网传「mounted return 一个 cleanup 函数，3.5 会自动调用」是
 * 未落地的提案 —— 3.5.42 运行时会丢弃返回值！必须手写 unmounted。
 */
const vClickOutside = {};

/* TODO(3) 工具提示
 *   用法：<span v-tooltip:top.delay="tipText">
 *     - binding.arg        ：'top' | 'bottom'，浮层位置
 *     - binding.modifiers  ：{ delay: true } 时悬停 300ms 才出现
 *     - binding.value      ：提示文本（响应式，文本变化要更新浮层）
 *
 *   实现要点：
 *     mounted   —— 监听 mouseenter/mouseleave，enter 时按 delay 决定
 *                  setTimeout(0|300) 后创建 div 浮层（append 到 body，
 *                  用 position: fixed + getBoundingClientRect 定位）
 *     updated   —— 若浮层正显示，更新其 textContent
 *     unmounted —— clearTimeout、removeEventListener、浮层 remove()
 *
 *   先自己写一版，卡住了再对照参考答案。
 */
const vTooltip = {};

/* 函数简写（已给出）：函数本身同时作为 mounted 和 updated ——
 * 颜色一变（updated）就同步到 DOM，日志里能观察到 updated 钩子。 */
const vColor = (el: HTMLElement, binding: { value: string }) => {
  el.style.color = binding.value;
  log(\`v-color 函数简写触发（mounted 或 updated）→ \${binding.value}\`);
};

/* ── 演示数据 ── */
const showInput = ref(true); // 重挂载输入框，验证 vFocus 的 mounted
const keyword = ref("");

const dropdownOpen = ref(false);
function closeDropdown() {
  if (!dropdownOpen.value) return;
  dropdownOpen.value = false;
  log("回调执行：检测到外部点击，下拉面板关闭");
}

const color = ref("#42b883");
const tipText = ref("拖动输入框可以实时改变我（updated 钩子）");
<\/script>

<template>
  <section class="lab">
    <h2>🎯 自定义指令实验室</h2>

    <!-- ① vFocus -->
    <div class="card">
      <h3>① v-focus：mounted 钩子</h3>
      <button @click="showInput = !showInput">
        {{ showInput ? "卸载输入框" : "重新挂载输入框" }}
      </button>
      <input
        v-if="showInput"
        v-focus
        v-model="keyword"
        placeholder="挂载后我应自动获得焦点（TODO(1)）"
      />
      <p class="muted">每次重新挂载，mounted 都应重新触发一次聚焦。</p>
    </div>

    <!-- ② vClickOutside -->
    <div class="card">
      <h3>② v-click-outside：成对清理</h3>
      <button @click="dropdownOpen = !dropdownOpen">
        {{ dropdownOpen ? "关闭菜单" : "打开菜单" }}
      </button>
      <div v-if="dropdownOpen" v-click-outside="closeDropdown" class="dropdown">
        <p>下拉面板（指令元素内部）</p>
        <p class="muted">
          点击面板外部应关闭（TODO(2)）；反复开关后日志中 mounted/unmounted
          必须成对。
        </p>
      </div>
    </div>

    <!-- ③ vTooltip -->
    <div class="card">
      <h3>③ v-tooltip：arg + modifiers + value</h3>
      <p>
        把鼠标悬停在
        <span v-tooltip:top.delay="tipText" class="hot"
          >这个词（top + delay 300ms，TODO(3)）</span
        >
        上；再看
        <span v-tooltip:bottom="tipText" class="hot"
          >这个（bottom，无延迟）</span
        >。
      </p>
      <input v-model="tipText" placeholder="修改文本，观察浮层 updated" />
    </div>

    <!-- ④ 函数简写 -->
    <div class="card">
      <h3>④ 函数简写 = mounted + updated</h3>
      <input v-model="color" />
      <p v-color="color">这段文字的颜色由指令控制：{{ color }}</p>
    </div>

    <!-- 生命周期日志 -->
    <div class="card console">
      <h3>钩子日志 <button @click="logs = []">清空</button></h3>
      <ul>
        <li v-for="(l, i) in logs" :key="i">{{ l }}</li>
        <li v-if="logs.length === 0" class="muted">（暂无日志）</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.lab {
  max-width: 560px;
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
  gap: 10px;
}
.card h3 {
  margin: 0;
  font-size: 14px;
}
input {
  padding: 7px 10px;
  border: 1px solid #d5dce1;
  border-radius: 6px;
  font-size: 13px;
}
button {
  justify-self: start;
  padding: 6px 12px;
  border: 1px solid #d5dce1;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
  font-size: 13px;
}
button:hover {
  border-color: #42b883;
  color: #33a06f;
}
.dropdown {
  border: 1px solid #42b883;
  border-radius: 8px;
  padding: 12px;
  background: #f0fbf6;
}
.dropdown p {
  margin: 4px 0;
  font-size: 13px;
}
.hot {
  color: #42b883;
  font-weight: 600;
  cursor: help;
  border-bottom: 1px dashed #42b883;
}
.muted {
  margin: 0;
  font-size: 12px;
  color: #8fa0ab;
}
.console ul {
  margin: 0;
  padding-left: 18px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
  color: #55636d;
  max-height: 160px;
  overflow: auto;
}
.console h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.console h3 button {
  font-size: 12px;
  padding: 2px 8px;
}
</style>
`,u=`<script setup lang="ts">
/**
 * 参考答案：自定义指令（Custom Directives）
 *
 * 三个指令的知识点分工：
 *   vFocus        —— 最简对象式指令，只用 mounted
 *   vClickOutside —— mounted/unmounted 成对清理 + 宏任务延后注册
 *   vTooltip      —— binding.value/arg/modifiers + updated 响应值变化
 *   vColor        —— 函数简写（等价于同时实现 mounted 与 updated）
 *
 * 设计决策：
 * - 所有注册的资源（document 监听 / setTimeout / body 上浮层节点）
 *   都能在卸载钩子中反向清理 —— 右侧日志面板可验证成对出现。
 * - 跨钩子需要共享函数/定时器这类不可序列化资源，挂在元素的
 *   __clickOutside / __tooltip 属性上（官方 dataset 方案只能存字符串）。
 */
import { ref } from "vue";
import type { Directive, DirectiveBinding } from "vue";

/* ── 生命周期日志 ── */
const logs = ref<string[]>([]);
function log(msg: string) {
  logs.value.unshift(\`[\${new Date().toLocaleTimeString()}] \${msg}\`);
  if (logs.value.length > 20) logs.value.pop();
}

/* ① vFocus：mounted 后聚焦。原生 autofocus 只在页面首次加载生效，
 *    指令在 v-if 每次重新插入元素时都会重新聚焦。 */
const vFocus: Directive<HTMLInputElement> = {
  mounted(el) {
    el.focus();
    log("focus：mounted → el.focus()");
  },
  unmounted() {
    log("focus：unmounted");
  },
};

/* ② vClickOutside：点击元素外部时调用 binding.value()
 *    value 类型是一个无参回调，用第二个泛型参数声明。 */
const vClickOutside: Directive<HTMLElement, () => void> = {
  mounted(el, binding) {
    const handler = (e: MouseEvent) => {
      // contains 判断点击落点是否在指令元素（含其子节点）之外
      if (!el.contains(e.target as Node)) {
        binding.value?.();
      }
    };
    // 关键坑：延后一个宏任务再注册。触发面板 v-if 挂载的那次 click
    // 此刻还在 document 上冒泡，同步 addEventListener 会让面板
    // 「刚打开就被同一事件判定为外部点击」而立即关闭。
    const timer = window.setTimeout(() => {
      document.addEventListener("click", handler);
    }, 0);
    // 资源引用挂到元素上，unmounted 时取出来清理
    (el as any).__clickOutside = { handler, timer };
    log("click-outside：mounted（监听已安排注册）");
  },
  unmounted(el) {
    const ctx = (el as any).__clickOutside as
      | { handler: (e: MouseEvent) => void; timer: number }
      | undefined;
    if (ctx) {
      window.clearTimeout(ctx.timer); // 面板在 0ms 内就被关掉时，监听可能还没注册
      document.removeEventListener("click", ctx.handler);
      delete (el as any).__clickOutside;
    }
    log("click-outside：unmounted（监听已移除）");
  },
};

/* ③ vTooltip：演示 binding 的 arg / modifiers / value 三件套 */
interface TooltipCtx {
  tip: HTMLDivElement | null;
  timer: number;
  enter: () => void;
  leave: () => void;
}

/** 创建挂到 body 上的浮层（scoped 样式管不到 body 子节点，全部内联） */
function createTip(text: string, position: "top" | "bottom", el: HTMLElement) {
  const tip = document.createElement("div");
  // 挂到 body 上的浮层不受 scoped 样式管理，className 仅用于辨识/调试，
  // 视觉样式全部走内联 style
  tip.className = "lab-tooltip";
  tip.textContent = text;
  Object.assign(tip.style, {
    position: "fixed",
    zIndex: "9999",
    transform: "translateX(-50%)",
    padding: "4px 10px",
    borderRadius: "6px",
    background: "#2c3e50",
    color: "#fff",
    fontSize: "12px",
    lineHeight: "1.5",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(tip);
  // 定位：以触发元素水平中心为锚，垂直方向由 arg 决定
  const rect = el.getBoundingClientRect();
  tip.style.left = \`\${rect.left + rect.width / 2}px\`;
  if (position === "top") {
    tip.style.bottom = \`\${window.innerHeight - rect.top + 8}px\`;
  } else {
    tip.style.top = \`\${rect.bottom + 8}px\`;
  }
  return tip;
}

const vTooltip: Directive<HTMLElement, string> = {
  mounted(el, binding: DirectiveBinding<string>) {
    // v-tooltip:top / v-tooltip:bottom → arg；缺省按 top
    const position = binding.arg === "bottom" ? "bottom" : "top";
    // v-tooltip.delay → modifiers.delay
    const delay = binding.modifiers.delay ? 300 : 0;
    const ctx: TooltipCtx = {
      tip: null,
      timer: 0,
      enter: () => {},
      leave: () => {},
    };

    ctx.enter = () => {
      ctx.timer = window.setTimeout(() => {
        if (!ctx.tip) ctx.tip = createTip(binding.value, position, el);
      }, delay);
    };
    ctx.leave = () => {
      window.clearTimeout(ctx.timer);
      ctx.tip?.remove();
      ctx.tip = null;
    };

    el.addEventListener("mouseenter", ctx.enter);
    el.addEventListener("mouseleave", ctx.leave);
    (el as any).__tooltip = ctx;
    log(\`tooltip：mounted（位置=\${position}，延迟=\${delay}ms）\`);
  },
  updated(el, binding) {
    // value 是响应式的：输入框修改 tipText 后，若浮层正显示则热更新文本
    const ctx = (el as any).__tooltip as TooltipCtx | undefined;
    if (ctx?.tip) ctx.tip.textContent = binding.value;
  },
  unmounted(el) {
    const ctx = (el as any).__tooltip as TooltipCtx | undefined;
    if (ctx) {
      window.clearTimeout(ctx.timer);
      ctx.tip?.remove();
      el.removeEventListener("mouseenter", ctx.enter);
      el.removeEventListener("mouseleave", ctx.leave);
      delete (el as any).__tooltip;
    }
    log("tooltip：unmounted（浮层与监听已清理）");
  },
};

/* ④ 函数简写：同一个函数在 mounted 与 updated 都会调用。
 *    updated 在父组件每次更新后都会触发（即使值没变），所以用
 *    oldValue 去重日志；DOM 同步则无条件执行。 */
const vColor: Directive<HTMLElement, string> = (el, binding) => {
  el.style.color = binding.value;
  if (binding.value !== binding.oldValue) {
    log(\`v-color → \${binding.value}（oldValue=\${String(binding.oldValue)}）\`);
  }
};

/* ── 演示数据 ── */
const showInput = ref(true);
const keyword = ref("");

const dropdownOpen = ref(false);
function closeDropdown() {
  if (!dropdownOpen.value) return;
  dropdownOpen.value = false;
  log("回调执行：检测到外部点击，下拉面板关闭");
}

const color = ref("#42b883");
const tipText = ref("修改输入框可以实时改变我（updated 钩子）");
<\/script>

<template>
  <section class="lab">
    <h2>🎯 自定义指令实验室</h2>

    <!-- ① vFocus -->
    <div class="card">
      <h3>① v-focus：mounted 钩子</h3>
      <button @click="showInput = !showInput">
        {{ showInput ? "卸载输入框" : "重新挂载输入框" }}
      </button>
      <input
        v-if="showInput"
        v-focus
        v-model="keyword"
        placeholder="挂载后自动获得焦点"
      />
      <p class="muted">每次重新挂载，mounted 重新触发一次聚焦。</p>
    </div>

    <!-- ② vClickOutside -->
    <div class="card">
      <h3>② v-click-outside：成对清理</h3>
      <button @click="dropdownOpen = !dropdownOpen">
        {{ dropdownOpen ? "关闭菜单" : "打开菜单" }}
      </button>
      <div v-if="dropdownOpen" v-click-outside="closeDropdown" class="dropdown">
        <p>下拉面板（指令元素内部，点这里不关闭）</p>
        <p class="muted">
          点击面板外部关闭；反复开关观察日志 mounted/unmounted 成对。
        </p>
      </div>
    </div>

    <!-- ③ vTooltip -->
    <div class="card">
      <h3>③ v-tooltip：arg + modifiers + value</h3>
      <p>
        悬停
        <span v-tooltip:top.delay="tipText" class="hot"
          >这个词（top + delay 300ms）</span
        >
        ，再悬停
        <span v-tooltip:bottom="tipText" class="hot"
          >这个（bottom，无延迟）</span
        >。
      </p>
      <input
        v-model="tipText"
        placeholder="修改文本，浮层显示中会热更新（updated）"
      />
    </div>

    <!-- ④ 函数简写 -->
    <div class="card">
      <h3>④ 函数简写 = mounted + updated</h3>
      <input v-model="color" />
      <p v-color="color">这段文字的颜色由指令控制：{{ color }}</p>
    </div>

    <!-- 生命周期日志 -->
    <div class="card console">
      <h3>
        钩子日志
        <button @click="logs = []">清空</button>
      </h3>
      <ul>
        <li v-for="(l, i) in logs" :key="i">{{ l }}</li>
        <li v-if="logs.length === 0" class="muted">（暂无日志）</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.lab {
  max-width: 560px;
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
  gap: 10px;
}
.card h3 {
  margin: 0;
  font-size: 14px;
}
input {
  padding: 7px 10px;
  border: 1px solid #d5dce1;
  border-radius: 6px;
  font-size: 13px;
}
button {
  justify-self: start;
  padding: 6px 12px;
  border: 1px solid #d5dce1;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
  font-size: 13px;
}
button:hover {
  border-color: #42b883;
  color: #33a06f;
}
.dropdown {
  border: 1px solid #42b883;
  border-radius: 8px;
  padding: 12px;
  background: #f0fbf6;
}
.dropdown p {
  margin: 4px 0;
  font-size: 13px;
}
.hot {
  color: #42b883;
  font-weight: 600;
  cursor: help;
  border-bottom: 1px dashed #42b883;
}
.muted {
  margin: 0;
  font-size: 12px;
  color: #8fa0ab;
}
.console ul {
  margin: 0;
  padding-left: 18px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
  color: #55636d;
  max-height: 160px;
  overflow: auto;
}
.console h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.console h3 button {
  font-size: 12px;
  padding: 2px 8px;
}
</style>
`,k=JSON.parse('{"title":"13 自定义指令","description":"指令 7 个钩子、binding 的 value/arg/modifiers、函数简写与 mounted/unmounted 成对清理，附「网传 cleanup 新语法」事实核查。","frontmatter":{"title":"13 自定义指令","description":"指令 7 个钩子、binding 的 value/arg/modifiers、函数简写与 mounted/unmounted 成对清理，附「网传 cleanup 新语法」事实核查。","tags":["自定义指令","DOM 操作","指令钩子","cleanup"]},"headers":[],"relativePath":"features/13-custom-directives.md","filePath":"features/13-custom-directives.md","lastUpdated":1792665939000}'),h={name:"features/13-custom-directives.md"},b=Object.assign(h,{setup(g){const o={"App.vue":p},i={"App.vue":u};return(m,n)=>{const d=s("Playground");return a(),l("div",null,[n[0]||(n[0]=e("h1",{id:"自定义指令",tabindex:"-1"},[t("自定义指令 "),e("a",{class:"header-anchor",href:"#自定义指令","aria-label":'Permalink to "自定义指令"'},"​")],-1)),n[1]||(n[1]=e("blockquote",null,[e("p",null,[e("strong",null,"Custom Directives · v-focus / v-click-outside / v-tooltip"),t(" · 难度：进阶 · 引入版本：Vue 3.0（机制）")])],-1)),n[2]||(n[2]=e("div",{class:"feature-summary"},"指令 7 个钩子、binding 的 value/arg/modifiers、函数简写与 mounted/unmounted 成对清理，附「网传 cleanup 新语法」事实核查。",-1)),r(d,{starter:o,solution:i}),n[3]||(n[3]=c(`<hr><h1 id="自定义指令-custom-directives" tabindex="-1">自定义指令（Custom Directives） <a class="header-anchor" href="#自定义指令-custom-directives" aria-label="Permalink to &quot;自定义指令（Custom Directives）&quot;">​</a></h1><h2 id="这是什么" tabindex="-1">这是什么 <a class="header-anchor" href="#这是什么" aria-label="Permalink to &quot;这是什么&quot;">​</a></h2><p>除了内置指令（<code>v-model</code> / <code>v-show</code> / <code>v-bind</code> ……），Vue 允许你注册 「自定义指令」——它是复用<strong>涉及普通元素的底层 DOM 访问逻辑</strong>的机制。</p><p>Vue 提供了三种复用代码的手段，分工不同：</p><table tabindex="0"><thead><tr><th>手段</th><th>侧重</th><th>典型场景</th></tr></thead><tbody><tr><td>组件</td><td>构建模块（结构 + 状态 + 视图）</td><td>卡片、表单、弹窗</td></tr><tr><td>组合式函数</td><td>有状态的逻辑复用</td><td>useFetch、useTimer</td></tr><tr><td>自定义指令</td><td>普通元素上的底层 DOM 操作</td><td>聚焦、点击外部、tooltip、权限禁用</td></tr></tbody></table><p>在 <code>&lt;script setup&gt;</code> 中，任何以 <code>v</code> 开头的驼峰变量都会自动成为指令： <code>const vFocus = { ... }</code> 在模板里直接写 <code>v-focus</code>，无需注册。</p><h2 id="指令钩子" tabindex="-1">指令钩子 <a class="header-anchor" href="#指令钩子" aria-label="Permalink to &quot;指令钩子&quot;">​</a></h2><p>指令定义对象可以提供 7 个与组件生命周期相似的钩子（全部可选）：</p><table tabindex="0"><thead><tr><th>钩子</th><th>调用时机</th><th>常用操作</th></tr></thead><tbody><tr><td><code>created</code></td><td>元素 attribute / 事件监听器应用<strong>之前</strong></td><td>提前改 attribute</td></tr><tr><td><code>beforeMount</code></td><td>元素插入 DOM <strong>之前</strong></td><td>—</td></tr><tr><td><code>mounted</code></td><td>元素及子节点挂载完成</td><td>聚焦、addEventListener、创建浮层</td></tr><tr><td><code>beforeUpdate</code></td><td>元素自身更新之前（新 VNode 应用前）</td><td>读旧 DOM 状态</td></tr><tr><td><code>updated</code></td><td>元素及子节点更新完成</td><td>根据新 <code>binding.value</code> 同步 DOM</td></tr><tr><td><code>beforeUnmount</code></td><td>元素卸载之前（此时 DOM 还在）</td><td>大多数清理写这里</td></tr><tr><td><code>unmounted</code></td><td>元素卸载完成</td><td>移除只与指令自身相关的监听/节点</td></tr></tbody></table><h3 id="钩子参数" tabindex="-1">钩子参数 <a class="header-anchor" href="#钩子参数" aria-label="Permalink to &quot;钩子参数&quot;">​</a></h3><ul><li><code>el</code>：指令绑定的真实 DOM 元素。</li><li><code>binding</code>：对象，包含 <ul><li><code>value</code>：传给指令的值，如 <code>v-x=&quot;1+1&quot;</code> 里是 <code>2</code>；</li><li><code>oldValue</code>：上一次的值，<strong>仅 beforeUpdate / updated 可用</strong>（无论值是否变化都有）；</li><li><code>arg</code>：参数，<code>v-x:foo</code> 里是 <code>&quot;foo&quot;</code>，支持动态写法 <code>v-x:[arg]</code>；</li><li><code>modifiers</code>：修饰符对象，<code>v-x.foo.bar</code> 里是 <code>{ foo: true, bar: true }</code>；</li><li><code>instance</code>：使用该指令的组件实例；</li><li><code>dir</code>：指令定义对象本身。</li></ul></li><li><code>vnode</code> / <code>prevVnode</code>：绑定元素对应的底层 VNode（prev 仅更新钩子可用）。</li></ul><p>除 <code>el</code> 外参数都是<strong>只读</strong>的。需要在钩子之间共享数据，官方推荐用 <code>el.dataset</code>；要共享的是函数、定时器这类无法序列化的资源时，可以挂在 元素的自定义属性上（如 <code>el.__clickOutside</code>），<strong>但必须在卸载钩子中清掉</strong>。</p><h2 id="函数简写" tabindex="-1">函数简写 <a class="header-anchor" href="#函数简写" aria-label="Permalink to &quot;函数简写&quot;">​</a></h2><p>只需要在 <code>mounted</code> 和 <code>updated</code> 做同一件事时，直接传一个函数：</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 等价于 { mounted: fn, updated: fn }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> vColor</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Directive</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">HTMLElement</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">el</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">binding</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  el.style.color </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> binding.value</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>需要多个值时传对象字面量即可：<code>v-demo=&quot;{ color: &#39;white&#39;, text: &#39;hi&#39; }&quot;</code>， <code>binding.value.color</code> 直接可取。</p><h2 id="注册方式" tabindex="-1">注册方式 <a class="header-anchor" href="#注册方式" aria-label="Permalink to &quot;注册方式&quot;">​</a></h2><ul><li><strong>局部</strong>：<code>&lt;script setup&gt;</code> 里的 <code>vXxx</code> 变量；或非 setup 下的 <code>directives: { focus: {...} }</code> 选项。</li><li><strong>全局</strong>：<code>app.directive(&#39;focus&#39;, { ... })</code>，所有组件可用。 全局指令的类型通过扩展 vue 的 <code>GlobalDirectives</code> 接口补充。</li></ul><h2 id="typescript-类型" tabindex="-1">TypeScript 类型 <a class="header-anchor" href="#typescript-类型" aria-label="Permalink to &quot;TypeScript 类型&quot;">​</a></h2><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { Directive } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 泛型依次是：元素类型、binding.value 的类型</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> vClickOutside</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Directive</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">HTMLElement</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span></code></pre></div><h2 id="清理原则-谁注册-谁注销" tabindex="-1">清理原则：谁注册，谁注销 <a class="header-anchor" href="#清理原则-谁注册-谁注销" aria-label="Permalink to &quot;清理原则：谁注册，谁注销&quot;">​</a></h2><p>指令最常见的 bug 是泄漏：<code>mounted</code> 里 <code>addEventListener</code> / <code>setInterval</code> / 新建浮层节点，却忘了在 <code>beforeUnmount</code> 或 <code>unmounted</code> 里反向清理。组件反复挂载/卸载后，监听器不断堆积，后台逻辑越跑越多。</p><p>本练习右侧的「生命周期日志」面板就是用来验证这一点的 —— 每次 mounted 注册的资源，都要能在日志里找到对应的 unmounted 清理记录， 成对出现。</p><blockquote><p><strong>关于网传的「3.5 钩子返回 cleanup 函数」</strong>：你可能在网上看到 <code>mounted() { return () =&gt; cleanup() }</code> 这种写法，称 cleanup 会在 卸载时自动调用。<strong>Vue 3.5（含最新 3.5.42）并未实现该特性</strong>—— 运行时 <code>invokeDirectiveHook</code> 会直接丢弃钩子的返回值，写了也不会 执行。那是一个尚未落地的 RFC 提案。3.5 里请老老实实用 mounted/unmounted 成对清理（本练习的写法）。可以用沙箱验证： 给指令钩子 <code>return</code> 一个函数，卸载时日志区不会有任何动静。</p></blockquote><h2 id="动手试" tabindex="-1">动手试 <a class="header-anchor" href="#动手试" aria-label="Permalink to &quot;动手试&quot;">​</a></h2><ol><li><strong>TODO(1) vFocus</strong>：在 <code>mounted</code> 钩子里调用 <code>el.focus()</code>， 并用「重新挂载输入框」按钮验证指令在动态插入时同样生效（比原生 <code>autofocus</code> 只在页面加载时有效更强）。</li><li><strong>TODO(2) vClickOutside</strong>：<code>mounted</code> 注册 document 点击监听， 点击目标不在 <code>el</code> 内时调用 <code>binding.value()</code>；<code>unmounted</code> 移除监听。 注意两个坑：① 注册要<strong>延后一个宏任务</strong>，否则触发面板打开的那次 click 会立刻把它关掉；② 监听与定时器引用要存到元素上，卸载时一并清理。</li><li><strong>TODO(3) vTooltip</strong>：读取 <code>binding.arg</code>（top/bottom 位置）、 <code>binding.modifiers.delay</code>（悬停 300ms 延迟）、<code>binding.value</code> （提示文本），在 <code>updated</code> 中响应文本变化，卸载时移除浮层与监听。</li><li>函数简写指令 <code>v-color</code> 已给出，改颜色时观察日志中 <code>updated</code> 触发。</li></ol><h2 id="常见坑-真实踩坑记录" tabindex="-1">常见坑（真实踩坑记录） <a class="header-anchor" href="#常见坑-真实踩坑记录" aria-label="Permalink to &quot;常见坑（真实踩坑记录）&quot;">​</a></h2><ul><li><strong>只注册不注销</strong>：组件卸载后 document 上的监听还在，再次挂载又注册 一个，点一下触发 N 次。验证方法：反复开关面板/重挂载元素，看日志 是否成对、行为是否叠加。</li><li><strong>clickOutside 打开即关闭</strong>：打开面板的点击事件还在冒泡，指令在 mounted 里同步注册监听，同一事件随即命中「外部」。<code>setTimeout(0)</code> 延后注册即可（参考答案的写法）。</li><li><strong>把 updated 当 mounted 用</strong>：<code>oldValue</code> 只在更新钩子中有值； mounted 里访问是 <code>undefined</code>。</li><li><strong>在多根组件上用指令</strong>：指令会落在根节点（类似 attrs 透传）， 多根（fragment）组件无法确定落点，指令被忽略并报警告；也不能像 attrs 那样用 <code>v-bind=&quot;$attrs&quot;</code> 转给内部元素。</li><li><strong>滥用指令</strong>：需要响应式状态或模板结构时，指令是错误工具—— 优先用 <code>v-bind</code> 声明式绑定、组合式函数或组件。指令只服务于 「不做底层 DOM 操作就实现不了」的功能。</li><li><strong>SSR</strong>：自定义指令不会在服务端执行 DOM 钩子；需要在 SSR 输出上 声明 attribute 时，实现对象式指令的 <code>getSSRProps(binding, vnode)</code>。</li></ul><hr><h2 id="源码参考" tabindex="-1">源码参考 <a class="header-anchor" href="#源码参考" aria-label="Permalink to &quot;源码参考&quot;">​</a></h2><ul><li>特性目录：<a href="https://github.com/YZhiJie/vue3-features-lab/tree/main/src/features/13-custom-directives" target="_blank" rel="noreferrer"><code>src/features/13-custom-directives/</code></a></li></ul>`,32))])}}});export{k as __pageData,b as default};
