function changeTab(getToActivate) {
  browser.tabs.query(
    {
      currentWindow: true,
      hidden: false,
    },
    function (tabs) {
      const actives = tabs.filter(function (t) {
        return t.active;
      });
      if (actives.length !== 1) return;
      const active = actives[0];
      const toActivate = getToActivate(tabs, active);
      browser.tabs.update(toActivate, { active: true });
    }
  );
}

function closeTab() {
  changeTab((_, active) => {
    browser.tabs.remove(active.id);
  });
}

function moveTab(command) {
  if (command == "previous-tab") {
    changeTab(function (tabs, active) {
      const index = tabs.findIndex((t) => t.index === active.index);
      if (index == 0) {
        return tabs[tabs.length - 1].id;
      } else {
        return tabs[index - 1].id;
      }
    });
  } else if (command == "next-tab") {
    changeTab(function (tabs, active) {
      const index = tabs.findIndex((t) => t.index === active.index);
      if (index == tabs.length - 1) {
        return tabs[0].id;
      } else {
        return tabs[index + 1].id;
      }
    });
  }
}

function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

browser.commands.onCommand.addListener(moveTab);
browser.menus.create({
  id: "previous-tab",
  title: "到之前的标签页去",
});

browser.menus.create({
  id: "next-tab",
  title: "到下一个标签页去",
});

browser.menus.create({
  id: "close-tab",
  title: "关闭当前标签页",
});

browser.menus.onClicked.addListener((info, tab) => {
  switch(info.menuItemId) {
    case "previous-tab":
    case "next-tab":
      moveTab(info.menuItemId);
      break;
    case "close-tab":
      closeTab();
      break;
  }
});
