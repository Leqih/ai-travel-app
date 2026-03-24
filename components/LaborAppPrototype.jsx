"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  Building2,
  Camera,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  FileSpreadsheet,
  Filter,
  Home,
  IdCard,
  Phone,
  QrCode,
  ScanLine,
  Search,
  Settings2,
  ShieldAlert,
  SquareCheckBig,
  UserPlus,
  UserRound,
  WalletCards,
  Users
} from "lucide-react";

const workbenchStats = [
  { label: "到场", value: "126", delta: "+18", tone: "orange" },
  { label: "待入职", value: "8", delta: "2 急办", tone: "blue" },
  { label: "异常", value: "24", delta: "7 高风险", tone: "red" }
];

const pendingItems = [
  { title: "待面试", count: 12, note: "09:00 前处理 5 人", tone: "orange" },
  { title: "未打卡", count: 19, note: "早班缺卡预警", tone: "blue" },
  { title: "流失风险", count: 5, note: "连续缺勤 / 想离职", tone: "red" }
];

const quickActions = [
  { label: "扫码建档", icon: ScanLine, primary: true },
  { label: "快速入职", icon: UserPlus },
  { label: "批量办理", icon: ClipboardCheck },
  { label: "生成对账", icon: FileSpreadsheet }
];

const people = [
  {
    name: "张三",
    phone: "138****2311",
    channel: "众才劳务",
    status: "待入职",
    stage: "体检已过 / 待签约",
    tags: ["新到场", "优先办理"],
    action: "去入职",
    risk: false
  },
  {
    name: "李四",
    phone: "136****1078",
    channel: "华南代理",
    status: "在职第3天",
    stage: "今日未打卡",
    tags: ["考勤异常"],
    action: "去处理",
    risk: true
  },
  {
    name: "王敏",
    phone: "139****6621",
    channel: "直营招聘",
    status: "面试通过",
    stage: "工牌待发放",
    tags: ["待入职"],
    action: "继续办理",
    risk: false
  },
  {
    name: "赵航",
    phone: "137****1982",
    channel: "众才劳务",
    status: "异常离场",
    stage: "连续缺勤 2 天",
    tags: ["高风险", "需回访"],
    action: "跟进",
    risk: true
  }
];

const scanResults = [
  { name: "陈龙", result: "新建档", meta: "渠道: 众才劳务", tone: "ok" },
  { name: "黄婷", result: "历史记录", meta: "上次离职: 2026-02-14", tone: "info" },
  { name: "刘波", result: "黑名单拦截", meta: "原因: 重复套利", tone: "risk" }
];

const onboardingSteps = [
  { label: "面试结果", value: "已通过", done: true },
  { label: "体检材料", value: "已上传", done: true },
  { label: "合同签署", value: "待签署", done: false },
  { label: "工牌发放", value: "待发放", done: false }
];

const navItems = [
  { id: "workbench", label: "工作台", icon: Home },
  { id: "people", label: "人员", icon: Users },
  { id: "scan", label: "扫码", icon: QrCode, center: true },
  { id: "mine", label: "我的", icon: UserRound }
];

function WorkbenchScreen({ setScreen }) {
  return (
    <div className="labor-v2-stack">
      <section className="labor-v2-shift-card">
        <div className="labor-v2-shift-top">
          <div>
            <p className="labor-v2-kicker">早班现场</p>
            <h2>南沙 A 厂 1 号门</h2>
          </div>
          <span className="labor-v2-badge live">07:40 进场高峰</span>
        </div>
        <div className="labor-v2-progress">
          <div className="labor-v2-progress-bar">
            <span style={{ width: "72%" }} />
          </div>
          <div className="labor-v2-progress-meta">
            <span>已到场 126 / 目标 175</span>
            <strong>72%</strong>
          </div>
        </div>
        <div className="labor-v2-stat-grid">
          {workbenchStats.map((item) => (
            <article key={item.label} className={`labor-v2-stat-card ${item.tone}`}>
              <small>{item.label}</small>
              <strong>{item.value}</strong>
              <span>{item.delta}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="labor-v2-section">
        <div className="labor-v2-section-head">
          <div>
            <p className="labor-v2-kicker">待处理</p>
            <h3>今日任务</h3>
          </div>
          <button type="button" className="labor-v2-text-btn" onClick={() => setScreen("people")}>
            查看全部 <ChevronRight size={16} />
          </button>
        </div>
        <div className="labor-v2-list">
          {pendingItems.map((item) => (
            <button
              key={item.title}
              type="button"
              className={`labor-v2-task-row ${item.tone}`}
              onClick={() => setScreen("people")}>
              <div>
                <strong>{item.title}</strong>
                <span>{item.note}</span>
              </div>
              <div className="labor-v2-task-side">
                <em>{item.count}</em>
                <ChevronRight size={16} />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="labor-v2-section">
        <div className="labor-v2-section-head">
          <div>
            <p className="labor-v2-kicker">快捷操作</p>
            <h3>现场高频</h3>
          </div>
        </div>
        <div className="labor-v2-action-grid">
          {quickActions.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                className={`labor-v2-action-card${item.primary ? " primary" : ""}`}
                onClick={() => {
                  if (item.label === "扫码建档") setScreen("scan");
                  if (item.label === "生成对账") setScreen("settlement");
                }}>
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function PeopleScreen({ setScreen, setSelectedPerson }) {
  return (
    <div className="labor-v2-stack">
      <section className="labor-v2-toolbar-card">
        <div className="labor-v2-search">
          <Search size={16} />
          <input type="text" placeholder="搜索姓名 / 手机号" />
        </div>
        <button type="button" className="labor-v2-icon-btn" aria-label="筛选">
          <Filter size={18} />
        </button>
      </section>

      <div className="labor-v2-chip-row">
        {["全部", "待入职", "在职", "异常", "批量"].map((item, index) => (
          <button key={item} type="button" className={`labor-v2-chip${index === 0 ? " active" : ""}`}>
            {item}
          </button>
        ))}
      </div>

      <section className="labor-v2-list">
        {people.map((person) => (
          <article key={person.name} className={`labor-v2-person-card${person.risk ? " risk" : ""}`}>
            <div className="labor-v2-person-top">
              <div className="labor-v2-avatar">{person.name.slice(0, 1)}</div>
              <div className="labor-v2-person-main">
                <div className="labor-v2-person-title">
                  <strong>{person.name}</strong>
                  <span className={`labor-v2-status${person.risk ? " risk" : ""}`}>{person.status}</span>
                </div>
                <div className="labor-v2-person-meta">
                  <span>{person.phone}</span>
                  <span>{person.channel}</span>
                </div>
                <p>{person.stage}</p>
              </div>
            </div>
            <div className="labor-v2-tag-row">
              {person.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="labor-v2-person-actions">
              <button
                type="button"
                className="labor-v2-mini-btn ghost"
                onClick={() => {
                  setSelectedPerson(person);
                  setScreen("person-detail");
                }}>
                详情
              </button>
              <button
                type="button"
                className="labor-v2-mini-btn primary"
                onClick={() => {
                  setSelectedPerson(person);
                  setScreen("onboarding");
                }}>
                {person.action}
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function ScanScreen({ setScreen }) {
  return (
    <div className="labor-v2-stack">
      <section className="labor-v2-scan-card">
        <div className="labor-v2-scan-tabs">
          <button type="button" className="labor-v2-tab active">
            扫码
          </button>
          <button type="button" className="labor-v2-tab">
            手动录入
          </button>
        </div>
        <div className="labor-v2-camera-stage">
          <div className="labor-v2-camera-frame">
            <div className="labor-v2-scan-line" />
            <ScanLine size={30} />
          </div>
          <div className="labor-v2-camera-tip">
            <Camera size={16} />
            请扫描渠道码或人员二维码
          </div>
        </div>
        <div className="labor-v2-manual-grid">
          <label>
            姓名
            <input type="text" placeholder="输入姓名" />
          </label>
          <label>
            手机号
            <input type="tel" placeholder="输入手机号" />
          </label>
        </div>
        <button type="button" className="labor-v2-primary-btn">
          创建临时档案
        </button>
      </section>

      <section className="labor-v2-section">
        <div className="labor-v2-section-head">
          <div>
            <p className="labor-v2-kicker">最近识别</p>
            <h3>扫描结果</h3>
          </div>
        </div>
        <div className="labor-v2-list">
          {scanResults.map((item) => (
            <button
              key={item.name}
              type="button"
              className={`labor-v2-scan-result ${item.tone}`}
              onClick={() => setScreen("scan-result")}>
              <div>
                <strong>{item.name}</strong>
                <span>{item.result}</span>
              </div>
              <p>{item.meta}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function MineScreen({ setScreen }) {
  return (
    <div className="labor-v2-stack">
      <section className="labor-v2-profile-card">
        <div className="labor-v2-profile-top">
          <div className="labor-v2-avatar large">驻</div>
          <div>
            <h3>陈晓锋</h3>
            <p>驻场管理员 · 南沙 A 厂</p>
          </div>
        </div>
        <div className="labor-v2-profile-grid">
          <div>
            <small>本月入职</small>
            <strong>184</strong>
          </div>
          <div>
            <small>闭环率</small>
            <strong>91%</strong>
          </div>
          <div>
            <small>待对账</small>
            <strong>2</strong>
          </div>
        </div>
      </section>

      <section className="labor-v2-list">
        <button type="button" className="labor-v2-menu-row" onClick={() => setScreen("settlement")}>
          <div>
            <WalletCards size={18} />
            <span>对账结算</span>
          </div>
          <ChevronRight size={16} />
        </button>
        <button type="button" className="labor-v2-menu-row">
          <div>
            <ShieldAlert size={18} />
            <span>黑名单规则</span>
          </div>
          <ChevronRight size={16} />
        </button>
        <button type="button" className="labor-v2-menu-row">
          <div>
            <IdCard size={18} />
            <span>操作日志</span>
          </div>
          <ChevronRight size={16} />
        </button>
        <button type="button" className="labor-v2-menu-row">
          <div>
            <Settings2 size={18} />
            <span>系统设置</span>
          </div>
          <ChevronRight size={16} />
        </button>
      </section>
    </div>
  );
}

function PersonDetailScreen({ person, setScreen }) {
  const currentPerson = person || people[0];

  return (
    <div className="labor-v2-stack">
      <section className="labor-v2-detail-card">
        <div className="labor-v2-person-top">
          <div className="labor-v2-avatar large">{currentPerson.name.slice(0, 1)}</div>
          <div className="labor-v2-person-main">
            <div className="labor-v2-person-title">
              <strong>{currentPerson.name}</strong>
              <span className={`labor-v2-status${currentPerson.risk ? " risk" : ""}`}>{currentPerson.status}</span>
            </div>
            <div className="labor-v2-person-meta">
              <span>{currentPerson.phone}</span>
              <span>{currentPerson.channel}</span>
            </div>
            <p>{currentPerson.stage}</p>
          </div>
        </div>
        <div className="labor-v2-detail-grid">
          <div>
            <small>来源渠道</small>
            <strong>{currentPerson.channel}</strong>
          </div>
          <div>
            <small>当前阶段</small>
            <strong>{currentPerson.status}</strong>
          </div>
          <div>
            <small>最近操作</small>
            <strong>07:28 扫码建档</strong>
          </div>
          <div>
            <small>风险标记</small>
            <strong>{currentPerson.risk ? "考勤异常" : "无"}</strong>
          </div>
        </div>
      </section>

      <section className="labor-v2-section">
        <div className="labor-v2-section-head">
          <div>
            <p className="labor-v2-kicker">办理记录</p>
            <h3>最近动作</h3>
          </div>
        </div>
        <div className="labor-v2-list">
          {["扫码建档", "面试登记", "体检上传"].map((item, index) => (
            <div key={item} className="labor-v2-history-row">
              <div>
                <strong>{item}</strong>
                <span>{index === 0 ? "07:28" : index === 1 ? "07:46" : "08:10"}</span>
              </div>
              <ChevronRight size={16} />
            </div>
          ))}
        </div>
      </section>

      <div className="labor-v2-fixed-actions">
        <button type="button" className="labor-v2-mini-btn ghost" onClick={() => setScreen("people")}>
          返回人员
        </button>
        <button type="button" className="labor-v2-mini-btn primary" onClick={() => setScreen("onboarding")}>
          继续入职
        </button>
      </div>
    </div>
  );
}

function OnboardingScreen({ person }) {
  const currentPerson = person || people[0];

  return (
    <div className="labor-v2-stack">
      <section className="labor-v2-section">
        <div className="labor-v2-section-head">
          <div>
            <p className="labor-v2-kicker">入职办理</p>
            <h3>{currentPerson.name}</h3>
          </div>
          <span className="labor-v2-badge live">待完成 2 项</span>
        </div>
        <div className="labor-v2-list">
          {onboardingSteps.map((step) => (
            <div key={step.label} className={`labor-v2-step-row${step.done ? " done" : ""}`}>
              <div className="labor-v2-step-icon">
                <SquareCheckBig size={16} />
              </div>
              <div className="labor-v2-step-main">
                <strong>{step.label}</strong>
                <span>{step.value}</span>
              </div>
              <ChevronRight size={16} />
            </div>
          ))}
        </div>
      </section>

      <section className="labor-v2-section">
        <div className="labor-v2-section-head">
          <div>
            <p className="labor-v2-kicker">办理校验</p>
            <h3>入职前检查</h3>
          </div>
        </div>
        <div className="labor-v2-check-panel">
          <div>
            <span>体检材料</span>
            <strong>通过</strong>
          </div>
          <div>
            <span>合同签署</span>
            <strong>未完成</strong>
          </div>
          <div>
            <span>工牌状态</span>
            <strong>待发放</strong>
          </div>
        </div>
        <button type="button" className="labor-v2-primary-btn">
          完成入职办理
        </button>
      </section>
    </div>
  );
}

function ScanResultScreen() {
  return (
    <div className="labor-v2-stack">
      <section className="labor-v2-result-hero risk">
        <p className="labor-v2-kicker">扫描结果</p>
        <h3>刘波</h3>
        <strong>黑名单拦截</strong>
        <span>命中规则: 重复套利 / 90 天内多次跨渠道入场</span>
      </section>

      <section className="labor-v2-section">
        <div className="labor-v2-list">
          <div className="labor-v2-history-row">
            <div>
              <strong>当前渠道</strong>
              <span>众才劳务</span>
            </div>
          </div>
          <div className="labor-v2-history-row">
            <div>
              <strong>上次入场</strong>
              <span>2026-02-12 / 华南代理</span>
            </div>
          </div>
          <div className="labor-v2-history-row">
            <div>
              <strong>处理建议</strong>
              <span>禁止建档，转主管复核</span>
            </div>
          </div>
        </div>
      </section>

      <div className="labor-v2-fixed-actions">
        <button type="button" className="labor-v2-mini-btn ghost">
          人工复核
        </button>
        <button type="button" className="labor-v2-mini-btn primary">
          拦截上报
        </button>
      </div>
    </div>
  );
}

function SettlementScreen() {
  return (
    <div className="labor-v2-stack">
      <section className="labor-v2-profile-card">
        <div className="labor-v2-section-head">
          <div>
            <p className="labor-v2-kicker">对账结算</p>
            <h3>2026 年 3 月</h3>
          </div>
          <span className="labor-v2-badge live">待导出</span>
        </div>
        <div className="labor-v2-profile-grid">
          <div>
            <small>在职人数</small>
            <strong>184</strong>
          </div>
          <div>
            <small>应结算</small>
            <strong>¥286k</strong>
          </div>
          <div>
            <small>待复核</small>
            <strong>9</strong>
          </div>
        </div>
      </section>

      <section className="labor-v2-section">
        <div className="labor-v2-list">
          {["众才劳务", "华南代理", "直营招聘"].map((item, index) => (
            <div key={item} className="labor-v2-history-row">
              <div>
                <strong>{item}</strong>
                <span>{index === 0 ? "72 人 / ¥112k" : index === 1 ? "58 人 / ¥96k" : "54 人 / ¥78k"}</span>
              </div>
              <ChevronRight size={16} />
            </div>
          ))}
        </div>
        <button type="button" className="labor-v2-primary-btn">
          导出对账单
        </button>
      </section>
    </div>
  );
}

export function LaborAppPrototype() {
  const searchParams = useSearchParams();
  const initialScreen = searchParams.get("screen") || "workbench";
  const [screen, setScreen] = useState(initialScreen);
  const [selectedPerson, setSelectedPerson] = useState(people[0]);

  const activeTab =
    screen === "person-detail" || screen === "onboarding"
      ? "people"
      : screen === "scan-result"
        ? "scan"
        : screen === "settlement"
          ? "mine"
          : screen;

  const showBack =
    screen === "person-detail" ||
    screen === "onboarding" ||
    screen === "scan-result" ||
    screen === "settlement";

  function handleBack() {
    if (screen === "person-detail" || screen === "onboarding") {
      setScreen("people");
      return;
    }
    if (screen === "scan-result") {
      setScreen("scan");
      return;
    }
    if (screen === "settlement") {
      setScreen("mine");
    }
  }

  return (
    <main className="labor-v2-page">
      <section className="labor-v2-shell">
        <header className="labor-v2-topbar">
          <div>
            <p className="labor-v2-kicker">驻场管理</p>
            <h1>{showBack ? "业务办理" : "南沙 A 厂"}</h1>
          </div>
          <div className="labor-v2-top-actions">
            <button type="button" className="labor-v2-icon-btn" aria-label="通知">
              <Bell size={18} />
            </button>
            {showBack ? (
              <button type="button" className="labor-v2-icon-btn" aria-label="返回" onClick={handleBack}>
                <ArrowLeft size={18} />
              </button>
            ) : (
              <Link href="/" className="labor-v2-icon-btn" aria-label="返回">
                <ChevronRight size={18} className="labor-v2-back-icon" />
              </Link>
            )}
          </div>
        </header>

        <section className="labor-v2-summary-strip">
          <div>
            <Clock3 size={14} />
            <span>07:40 早班</span>
          </div>
          <div>
            <CircleAlert size={14} />
            <span>7 条高优先异常</span>
          </div>
          <div>
            <Phone size={14} />
            <span>值班热线在线</span>
          </div>
        </section>

        {screen === "workbench" ? <WorkbenchScreen setScreen={setScreen} /> : null}
        {screen === "people" ? <PeopleScreen setScreen={setScreen} setSelectedPerson={setSelectedPerson} /> : null}
        {screen === "scan" ? <ScanScreen setScreen={setScreen} /> : null}
        {screen === "mine" ? <MineScreen setScreen={setScreen} /> : null}
        {screen === "person-detail" ? <PersonDetailScreen person={selectedPerson} setScreen={setScreen} /> : null}
        {screen === "onboarding" ? <OnboardingScreen person={selectedPerson} /> : null}
        {screen === "scan-result" ? <ScanResultScreen /> : null}
        {screen === "settlement" ? <SettlementScreen /> : null}

        <nav className="labor-v2-bottom-nav" aria-label="Bottom navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`labor-v2-nav-item${active ? " active" : ""}${item.center ? " center" : ""}`}
                onClick={() => setScreen(item.id)}>
                <Icon size={item.center ? 20 : 18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </section>
    </main>
  );
}
