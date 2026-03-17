const modeCopy = {
  map: {
    title: "地图找房",
    meta: "Walk 5-15 min",
  },
  list: {
    title: "列表浏览",
    meta: "按预算与评分排序",
  },
  sublet: {
    title: "转租优先",
    meta: "只看近期可入住房源",
  },
};

const listingDetails = {
  "south-gate": {
    title: "South Gate Studio",
    status: "已验证",
    price: "$920 / 月",
    distance: "骑车 6 分钟",
    fit: "适合独居",
    copy: "家具齐全，骑车 6 分钟到校，适合希望独居的研究生。",
  },
  "2b1b-sublet": {
    title: "2B1B 次卧转租",
    status: "转租中",
    price: "$700 / 月",
    distance: "步行 9 分钟",
    fit: "短租友好",
    copy: "室友均为学生，接受短租，离图书馆和亚洲超市都很近。",
  },
  "north-loop": {
    title: "North Loop 3B2B",
    status: "安全认证",
    price: "$610 / 月",
    distance: "公交 10 分钟",
    fit: "适合合租",
    copy: "公交直达校区，公寓管理稳定，楼内有洗衣房和自习区。",
  },
};

const filterPills = document.querySelectorAll(".filter-pill");

filterPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    filterPills.forEach((item) => item.classList.remove("active"));
    pill.classList.add("active");
  });
});

const modeTabs = document.querySelectorAll(".mode-tab");
const modePanels = document.querySelectorAll(".mode-panel");
const modeTitle = document.getElementById("mode-title");
const modeMeta = document.getElementById("mode-meta");

modeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const mode = tab.dataset.mode;

    modeTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    modePanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === mode);
    });

    modeTitle.textContent = modeCopy[mode].title;
    modeMeta.textContent = modeCopy[mode].meta;
  });
});

const detailTitle = document.getElementById("detail-title");
const detailStatus = document.getElementById("detail-status");
const detailPrice = document.getElementById("detail-price");
const detailDistance = document.getElementById("detail-distance");
const detailFit = document.getElementById("detail-fit");
const detailCopy = document.getElementById("detail-copy");
const listingCards = document.querySelectorAll(".listing-card");

listingCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest(".save-button")) {
      return;
    }

    const detail = listingDetails[card.dataset.listing];

    listingCards.forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");

    detailTitle.textContent = detail.title;
    detailStatus.textContent = detail.status;
    detailPrice.textContent = detail.price;
    detailDistance.textContent = detail.distance;
    detailFit.textContent = detail.fit;
    detailCopy.textContent = detail.copy;
  });
});

const saveButtons = document.querySelectorAll(".save-button");

saveButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isSaved = button.getAttribute("aria-pressed") === "true";
    const nextState = !isSaved;
    button.setAttribute("aria-pressed", String(nextState));
    button.textContent = nextState ? button.dataset.activeLabel : button.dataset.defaultLabel;
  });
});

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((entry) => entry.classList.remove("active"));
    item.classList.add("active");
  });
});
