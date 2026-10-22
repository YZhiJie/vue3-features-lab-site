import{C as i,o as s,c as a,j as e,a as t,E as l,a2 as m}from"./chunks/framework.CE7vFz40.js";const c=`<script setup lang="ts">
/**
 * 练习：现代 API 与最佳实践
 *
 * 本页三个演示：
 * 1. useId 做 label/input 无障碍关联（TODO(2)）
 * 2. 类型安全的 provide/inject（provideTheme + ThemedCard，已能跑；
 *    重点看 composables.ts 里 InjectionKey 的用法 —— ThemedCard 的
 *    边框/底色就是注入进来的主题）
 * 3. 组合式函数复用与卸载清理（TODO(1) 在 composables.ts，TODO(3)(4) 在本文件）
 */
import { ref } from 'vue'
import { provideTheme, ThemedCard, TimerCard } from './composables'

/* 祖先 provide：主题经 InjectionKey 注入 ThemedCard（类型安全） */
provideTheme({ accent: '#42b883', bg: '#f2fbf6' })

/* ── 演示 1：useId ── */
// TODO(2): 用 useId() 替换下面两个硬编码 id（每个字段各调一次，
//          并把 useId 加进 import { ... } from 'vue'）。
//          手写 id 容易重复，SSR 下还会两端不一致 —— useId 一次解决。
const nameId = 'field-name'
const emailId = 'field-email'
const name = ref('小明')
const email = ref('ming@example.com')

/* ── 演示 3：组合式函数复用（载体是 composables.ts 里的 TimerCard）── */
// 卡片 A 已经用上了 —— TODO(3): 给卡片 B 也来一份

// TODO(4): 这个开关控制卡片 B 的 v-if —— 反复切换，去 Console 验证
//          TODO(1) 的清理日志（计时开始 / 清理完成 应当成对出现）
const showCardB = ref(true)
<\/script>

<template>
  <section class="modern-lab">
    <h2>🧭 现代 API 与最佳实践</h2>

    <!-- 演示 1：label 与 input 通过 id 关联（点 label 能聚焦输入框） -->
    <form class="a11y-form" @submit.prevent>
      <div class="field">
        <label :for="nameId">姓名（点击我聚焦输入框）</label>
        <input :id="nameId" v-model="name" />
      </div>
      <div class="field">
        <label :for="emailId">邮箱</label>
        <input :id="emailId" v-model="email" type="email" />
      </div>
    </form>

    <!-- 演示 2+3：ThemedCard 注入主题；TimerCard 内部复用 useTimer -->
    <ThemedCard title="卡片 A · useTimer 复用实例 1">
      <TimerCard label="卡片 A" />
    </ThemedCard>

    <!-- TODO(3)(4): 给这个 ThemedCard 加 v-if="showCardB"，里面放 <TimerCard label="卡片 B" /> -->
    <ThemedCard title="卡片 B · useTimer 复用实例 2（TODO(3)）">
      <p class="placeholder">完成 TODO(3) 后这里会出现独立计时的第二份状态</p>
    </ThemedCard>

    <button class="toggle" @click="showCardB = !showCardB">
      {{ showCardB ? '隐藏卡片 B（测试清理）' : '显示卡片 B' }}
    </button>

    <p class="tip">打开预览区下方 Console：计时开始 / 清理完成 / 非法调用警告都会打在这里。</p>
  </section>
</template>

<style scoped>
.modern-lab {
  max-width: 520px;
  margin: 24px auto;
  padding: 20px;
  display: grid;
  gap: 14px;
  font-family: sans-serif;
}
.modern-lab h2 {
  margin: 0;
}
.a11y-form {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 14px;
  display: grid;
  gap: 10px;
}
.field {
  display: grid;
  gap: 4px;
  font-size: 13px;
  color: #55636d;
}
.field input {
  padding: 6px 10px;
  border: 1px solid #dde5ea;
  border-radius: 6px;
  font: inherit;
}
.placeholder {
  margin: 0;
  font-size: 12px;
  color: #b0bcc4;
}
.toggle {
  justify-self: start;
  padding: 6px 14px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
}
.toggle:hover {
  border-color: #42b883;
  color: #33a06f;
}
.tip {
  margin: 0;
  font-size: 12px;
  color: #8fa0ab;
}
</style>
`,p=`/**
 * composables.ts —— 组合式函数与类型安全 provide/inject 的示范模块
 *
 * 设计决策：
 * - 独立成 .ts 文件而不是塞进组件：组合式函数的价值就在于跨组件复用；
 * - ThemedCard / TimerCard 用渲染函数 h() 定义而不是单独的 .vue 文件：
 *   本特性限定 App.vue + composables.ts 两个文件，用 defineComponent + h
 *   最省文件（沙箱 vue 运行时是 runtime-only 构建，不能用 template 字符串）；
 * - TimerCard 内部调用 useTimer：组合式函数「组件化」之后，
 *   v-if 卸载组件实例时其内部的 onUnmounted 才会触发 —— 清理演示才成立。
 *
 * 坑点：
 * - 生命周期钩子（onMounted/onUnmounted）必须在 setup 同步流程中注册；
 *   组合式函数被误用在事件回调里时钩子会静默失效 —— 所以用
 *   hasInjectionContext() 提前拦截（Vue 3.5+）。
 */
import {
  defineComponent,
  h,
  hasInjectionContext,
  inject,
  onMounted,
  provide,
  ref,
} from "vue";
import type { InjectionKey } from "vue";

/* ───────────────────────────────────────────────
 * 一、类型安全的 provide / inject
 * ─────────────────────────────────────────────── */

/** 主题上下文的形状：inject(themeKey) 会自动推导出这个类型 */
export interface ThemeContext {
  /** 卡片描边色 */
  accent: string;
  /** 卡片底色 */
  bg: string;
}

/**
 * InjectionKey<T> = 带类型的 Symbol：
 * - 全局唯一，杜绝字符串 key 撞名；
 * - inject(themeKey) 返回 ThemeContext | undefined，无需手动断言。
 */
export const themeKey: InjectionKey<ThemeContext> = Symbol("theme");

/** 祖先组件在 setup 里调用一次，向所有后代提供主题（必须同步调用） */
export function provideTheme(context: ThemeContext): void {
  provide(themeKey, context);
}

/** 子组件（渲染函数版）：从最近祖先注入主题，没有就给默认灰 */
export const ThemedCard = defineComponent({
  name: "ThemedCard",
  props: {
    title: { type: String, required: true },
  },
  setup(props, { slots }) {
    // 类型自动推导：theme: ThemeContext | undefined（字符串 key 只能拿到 unknown）
    const theme = inject(themeKey);
    return () =>
      h(
        "section",
        {
          class: "themed-card",
          style: {
            border: \`2px solid \${theme?.accent ?? "#c6d2d8"}\`,
            background: theme?.bg ?? "#f7f9fa",
          },
        },
        [
          h(
            "h3",
            { style: { margin: "0 0 8px", fontSize: "14px" } },
            props.title,
          ),
          h("div", null, slots.default?.()),
        ],
      );
  },
});

/* ───────────────────────────────────────────────
 * 二、可复用 + 自清理的组合式函数
 * ─────────────────────────────────────────────── */

/**
 * 计时器组合式函数：每次调用 = 一份独立状态 + 一份独立副作用。
 * 通过 TimerCard 组件复用多次（也可以在组件 setup 里直接调用）。
 *
 * @param label 日志前缀，方便在 Console 里区分多个实例
 */
export function useTimer(label: string) {
  // Vue 3.5：判断是否处于可注入上下文（setup 或 setup 中调用的组合式函数）。
  // 不在的话，onMounted/onUnmounted 会静默注册失败 —— 这里显式警告并返回空实现
  if (!hasInjectionContext()) {
    console.warn(
      \`[useTimer] "\${label}" 不在 setup 上下文中调用，已返回空实现（不注册任何副作用）\`,
    );
    return { seconds: ref(0), reset: () => {} };
  }

  const seconds = ref(0);

  onMounted(() => {
    // 注意：这里没有保存 setInterval 的返回值 —— 所以定时器永远清不掉（练习的起点）
    window.setInterval(() => {
      seconds.value += 1;
    }, 1000);
    console.log(\`[useTimer:\${label}] 计时开始\`);
  });

  // TODO(1): 组件卸载时清理定时器（组合式函数约定：谁注册，谁清理）——
  //   1. 在 seconds 声明下方加一句 \`let handle: number | undefined\`
  //   2. onMounted 里把 setInterval 的返回值存进 handle
  //   3. 把 onUnmounted 加进上面的 import { ... } from 'vue'，并注册：
  //      onUnmounted(() => { if (handle !== undefined) window.clearInterval(handle); console.log(\`[useTimer:\${label}] 已卸载，定时器清理完成\`) })
  //   验证方法：完成 App 的 TODO(3)(4) 后反复「隐藏/显示卡片 B」，
  //   Console 里「计时开始」与「清理完成」应当成对出现。

  function reset() {
    seconds.value = 0;
  }

  return { seconds, reset };
}

/**
 * TimerCard：内部调用 useTimer 的「组合式函数载体」组件。
 * 每个实例独立调用一次 useTimer —— v-if 卸载本组件时，其内部
 * onUnmounted 触发，完成清理（这就是为什么不能把 timer 状态放在父组件）。
 */
export const TimerCard = defineComponent({
  name: "TimerCard",
  props: {
    label: { type: String, required: true },
  },
  setup(props) {
    // 每个 TimerCard 实例一份独立状态与副作用 —— 组合式函数的复用
    const { seconds, reset } = useTimer(props.label);
    return () =>
      h("div", { class: "timer-card" }, [
        h("span", null, \`\${props.label} 已计时 \${seconds.value}s\`),
        h(
          "button",
          {
            style: { cursor: "pointer" },
            onClick: () => reset(),
          },
          "归零",
        ),
      ]);
  },
});
`,u=`<script setup lang="ts">
/**
 * 参考答案：现代 API 与最佳实践
 *
 * 相比练习版补充：
 * 1. useId 替换硬编码 id（每个字段各调一次）—— label 点击即聚焦，
 *    SSR 下服务端/客户端 id 一致；
 * 2. 卡片 B 也用上 TimerCard —— 同一组合式函数的第二份独立状态；
 * 3. 页面级直接复用一次 useTimer（组合式函数两种用法：组件载体 / setup 直调）；
 * 4. 加分演示：在事件处理器里（setup 上下文之外）调用 useTimer，
 *    hasInjectionContext() 兜底给出警告而不是静默失效。
 */
import { ref, useId } from 'vue'
import { provideTheme, ThemedCard, TimerCard, useTimer } from './composables'

/* 祖先 provide：主题经 InjectionKey 注入 ThemedCard（类型安全） */
provideTheme({ accent: '#42b883', bg: '#f2fbf6' })

/* ── 演示 1：useId —— 一个字段一个 id，别复用 ── */
const nameId = useId()
const emailId = useId()
const name = ref('小明')
const email = ref('ming@example.com')

/* ── 演示 3：直接在组件 setup 里复用一次（页面级计时）──
   卡片里的复用走 TimerCard：v-if 卸载卡片时其内部 onUnmounted 触发清理 */
const pageTimer = useTimer('页面')

// TODO(4) 的验证开关：隐藏卡片 B = 卸载 TimerCard 实例 → 触发清理
const showCardB = ref(true)

/* 加分演示：事件处理器里没有 setup 上下文 ——
   Console 会出现 useTimer 的警告（hasInjectionContext 兜底），
   而不是「钩子注册失败」的静默失效 */
function illegalCall() {
  useTimer('非法调用')
}
<\/script>

<template>
  <section class="modern-lab">
    <h2>🧭 现代 API 与最佳实践</h2>

    <!-- 演示 1：label 与 input 通过 useId 关联（点 label 能聚焦输入框） -->
    <form class="a11y-form" @submit.prevent>
      <div class="field">
        <label :for="nameId">姓名（点击我聚焦输入框）</label>
        <input :id="nameId" v-model="name" />
      </div>
      <div class="field">
        <label :for="emailId">邮箱</label>
        <input :id="emailId" v-model="email" type="email" />
      </div>
    </form>

    <!-- 页面级 useTimer 复用（App 卸载时才会清理 —— 它与页面同生共死） -->
    <p class="page-timer">
      页面已计时 <strong>{{ pageTimer.seconds }}s</strong>
      <button @click="pageTimer.reset()">归零</button>
    </p>

    <!-- 演示 2+3：ThemedCard 注入主题；TimerCard 内部复用 useTimer -->
    <ThemedCard title="卡片 A · useTimer 复用实例 1">
      <TimerCard label="卡片 A" />
    </ThemedCard>

    <!-- v-if 卸载整个 ThemedCard 子树 → 里面的 TimerCard 触发 onUnmounted 清理 -->
    <ThemedCard v-if="showCardB" title="卡片 B · useTimer 复用实例 2">
      <TimerCard label="卡片 B" />
    </ThemedCard>

    <div class="controls">
      <button class="toggle" @click="showCardB = !showCardB">
        {{ showCardB ? '隐藏卡片 B（测试清理）' : '显示卡片 B' }}
      </button>
      <button class="toggle warn" @click="illegalCall">在事件回调里调用 useTimer（看警告）</button>
    </div>

    <p class="tip">
      打开预览区下方 Console：计时开始 / 清理完成 / 非法调用警告都会打在这里，
      「计时开始」与「清理完成」应随挂载/卸载成对出现。
    </p>
  </section>
</template>

<style scoped>
.modern-lab {
  max-width: 520px;
  margin: 24px auto;
  padding: 20px;
  display: grid;
  gap: 14px;
  font-family: sans-serif;
}
.modern-lab h2 {
  margin: 0;
}
.a11y-form {
  border: 1px solid #e4e9ec;
  border-radius: 10px;
  padding: 14px;
  display: grid;
  gap: 10px;
}
.field {
  display: grid;
  gap: 4px;
  font-size: 13px;
  color: #55636d;
}
.field input {
  padding: 6px 10px;
  border: 1px solid #dde5ea;
  border-radius: 6px;
  font: inherit;
}
.page-timer {
  margin: 0;
  font-size: 13px;
  color: #55636d;
  display: flex;
  gap: 8px;
  align-items: center;
}
.page-timer strong {
  font-variant-numeric: tabular-nums;
  color: #33a06f;
}
.page-timer button {
  padding: 2px 10px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
  font-size: 12px;
}
.controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.toggle {
  padding: 6px 14px;
  border: 1px solid #e4e9ec;
  border-radius: 6px;
  background: #f5f7f8;
  cursor: pointer;
  font-size: 13px;
}
.toggle:hover {
  border-color: #42b883;
  color: #33a06f;
}
.toggle.warn:hover {
  border-color: #d98b1f;
  color: #d98b1f;
}
.tip {
  margin: 0;
  font-size: 12px;
  color: #8fa0ab;
}
</style>
`,h=`/**
 * composables.ts —— 组合式函数与类型安全 provide/inject 的示范模块（参考答案）
 *
 * 设计决策：
 * - 独立成 .ts 文件而不是塞进组件：组合式函数的价值就在于跨组件复用；
 * - ThemedCard / TimerCard 用渲染函数 h() 定义而不是单独的 .vue 文件：
 *   本特性限定 App.vue + composables.ts 两个文件，用 defineComponent + h
 *   最省文件（沙箱 vue 运行时是 runtime-only 构建，不能用 template 字符串）；
 * - TimerCard 内部调用 useTimer：组合式函数「组件化」之后，
 *   v-if 卸载组件实例时其内部的 onUnmounted 才会触发 —— 清理演示才成立。
 *
 * 坑点：
 * - 生命周期钩子（onMounted/onUnmounted）必须在 setup 同步流程中注册；
 *   组合式函数被误用在事件回调里时钩子会静默失效 —— 所以用
 *   hasInjectionContext() 提前拦截（Vue 3.5+）。
 */
import {
  defineComponent,
  h,
  hasInjectionContext,
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
} from 'vue'
import type { InjectionKey } from 'vue'

/* ───────────────────────────────────────────────
 * 一、类型安全的 provide / inject
 * ─────────────────────────────────────────────── */

/** 主题上下文的形状：inject(themeKey) 会自动推导出这个类型 */
export interface ThemeContext {
  /** 卡片描边色 */
  accent: string
  /** 卡片底色 */
  bg: string
}

/**
 * InjectionKey<T> = 带类型的 Symbol：
 * - 全局唯一，杜绝字符串 key 撞名；
 * - inject(themeKey) 返回 ThemeContext | undefined，无需手动断言。
 */
export const themeKey: InjectionKey<ThemeContext> = Symbol('theme')

/** 祖先组件在 setup 里调用一次，向所有后代提供主题（必须同步调用） */
export function provideTheme(context: ThemeContext): void {
  provide(themeKey, context)
}

/** 子组件（渲染函数版）：从最近祖先注入主题，没有就给默认灰 */
export const ThemedCard = defineComponent({
  name: 'ThemedCard',
  props: {
    title: { type: String, required: true },
  },
  setup(props, { slots }) {
    // 类型自动推导：theme: ThemeContext | undefined（字符串 key 只能拿到 unknown）
    const theme = inject(themeKey)
    return () =>
      h(
        'section',
        {
          class: 'themed-card',
          style: {
            border: \`2px solid \${theme?.accent ?? '#c6d2d8'}\`,
            background: theme?.bg ?? '#f7f9fa',
          },
        },
        [
          h('h3', { style: { margin: '0 0 8px', fontSize: '14px' } }, props.title),
          h('div', null, slots.default?.()),
        ],
      )
  },
})

/* ───────────────────────────────────────────────
 * 二、可复用 + 自清理的组合式函数
 * ─────────────────────────────────────────────── */

/**
 * 计时器组合式函数：每次调用 = 一份独立状态 + 一份独立副作用。
 * 通过 TimerCard 组件复用多次（也可以在组件 setup 里直接调用）。
 *
 * @param label 日志前缀，方便在 Console 里区分多个实例
 */
export function useTimer(label: string) {
  // Vue 3.5：判断是否处于可注入上下文（setup 或 setup 中调用的组合式函数）。
  // 不在的话，onMounted/onUnmounted 会静默注册失败 —— 这里显式警告并返回空实现
  if (!hasInjectionContext()) {
    console.warn(
      \`[useTimer] "\${label}" 不在 setup 上下文中调用，已返回空实现（不注册任何副作用）\`,
    )
    return { seconds: ref(0), reset: () => {} }
  }

  const seconds = ref(0)
  // 定时器句柄：onMounted 里赋值，onUnmounted 里读取并清理
  let handle: number | undefined

  onMounted(() => {
    handle = window.setInterval(() => {
      seconds.value += 1
    }, 1000)
    console.log(\`[useTimer:\${label}] 计时开始\`)
  })

  // 组合式函数约定：谁注册的副作用，谁负责在卸载时收尾。
  // 反复挂载/卸载时，Console 里「计时开始」与「清理完成」成对出现 —— 无泄漏
  onUnmounted(() => {
    if (handle !== undefined) {
      window.clearInterval(handle)
      console.log(\`[useTimer:\${label}] 已卸载，定时器清理完成\`)
    }
  })

  function reset() {
    seconds.value = 0
  }

  return { seconds, reset }
}

/**
 * TimerCard：内部调用 useTimer 的「组合式函数载体」组件。
 * 每个实例独立调用一次 useTimer —— v-if 卸载本组件时，其内部
 * onUnmounted 触发，完成清理（这就是为什么不能把 timer 状态放在父组件）。
 */
export const TimerCard = defineComponent({
  name: 'TimerCard',
  props: {
    label: { type: String, required: true },
  },
  setup(props) {
    // 每个 TimerCard 实例一份独立状态与副作用 —— 组合式函数的复用
    const { seconds, reset } = useTimer(props.label)
    return () =>
      h('div', { class: 'timer-card' }, [
        h('span', null, \`\${props.label} 已计时 \${seconds.value}s\`),
        h(
          'button',
          {
            style: { cursor: 'pointer' },
            onClick: () => reset(),
          },
          '归零',
        ),
      ])
  },
})
`,x=JSON.parse('{"title":"12 现代 API 与最佳实践","description":"useId 无障碍关联、InjectionKey 类型安全注入、带自清理的组合式函数设计与 hasInjectionContext 防误用。","frontmatter":{"title":"12 现代 API 与最佳实践","description":"useId 无障碍关联、InjectionKey 类型安全注入、带自清理的组合式函数设计与 hasInjectionContext 防误用。","tags":["useId","provide/inject","组合式函数"]},"headers":[],"relativePath":"features/12-modern-best-practices.md","filePath":"features/12-modern-best-practices.md","lastUpdated":1792665939000}'),f={name:"features/12-modern-best-practices.md"},C=Object.assign(f,{setup(b){const o={"App.vue":c,"composables.ts":p},r={"App.vue":u,"composables.ts":h};return(g,n)=>{const d=i("Playground");return s(),a("div",null,[n[0]||(n[0]=e("h1",{id:"现代-api-与最佳实践",tabindex:"-1"},[t("现代 API 与最佳实践 "),e("a",{class:"header-anchor",href:"#现代-api-与最佳实践","aria-label":'Permalink to "现代 API 与最佳实践"'},"​")],-1)),n[1]||(n[1]=e("blockquote",null,[e("p",null,[e("strong",null,"useId / hasInjectionContext / 组合式函数设计"),t(" · 难度：进阶 · 引入版本：Vue 3.5")])],-1)),n[2]||(n[2]=e("div",{class:"feature-summary"},"useId 无障碍关联、InjectionKey 类型安全注入、带自清理的组合式函数设计与 hasInjectionContext 防误用。",-1)),l(d,{starter:o,solution:r}),n[3]||(n[3]=m("",16))])}}});export{x as __pageData,C as default};
