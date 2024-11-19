obsidian = require("obsidian");
module.exports = class HideOriginalPDFs extends obsidian.Plugin {
  // Default settings
  async onload() {
    // Load settings
    this.settings = Object.assign({}, await this.loadData(), {
      enabled: true, // Default setting
    });

    // Add ribbon icon
    this.ribbon = this.addRibbonIcon(
      "eye-off",
      "Toggle PDF hiding",
      () => this.toggleHiding()
    );
    this.updateRibbonState();

    // Add setting tab
    this.addSettingTab(new HideOriginalPDFsSettingTab(this.app, this));

    // Register hiding functionality
    if (this.settings.enabled) {
      this.registerEvent(
        this.app.workspace.on("layout-ready", () => this.hideFiles())
      );
      this.registerEvent(
        this.app.vault.on("modify", () => this.hideFiles())
      );
    }
  }

  onunload() {
    this.ribbon.remove();
  }

  // Hiding functionality
  hideFiles() {
    const files = this.app.vault.getFiles();
    const hiddenPaths = new Set();

    files.forEach(file => {
      if (file.extension === "pdf" && !file.path.endsWith("_a.pdf")) {
        const baseName = file.path.replace(/\.pdf$/, '');
        const annotatedPath = `${baseName}_a.pdf`;

        if (files.some(f => f.path === annotatedPath)) {
          hiddenPaths.add(file.path);
        }
      }
    });

    // Hide files from the file explorer
    const fileExplorer = this.app.workspace.getLeavesOfType("file-explorer")[0];
    if (fileExplorer) {
      const root = fileExplorer.view.fileItems;
      Object.keys(root).forEach(path => {
        const item = root[path];
        if (hiddenPaths.has(path)) {
          if (this.settings.enabled) {
            item.selfEl.style.display = "none"; // Hide from view
          } else {
            item.selfEl.style.display = "flex";
          }
        }
      });
    }
  }

  // Toggle hiding functionality
  async toggleHiding() {
    this.settings.enabled = !this.settings.enabled;
    await this.saveData(this.settings);
    this.updateRibbonState();
    if (this.settings.enabled) {
      new Notice("PDF hiding enabled");
    } else {
      new Notice("PDF hiding disabled");
    }
    this.hideFiles();
  }

  // Update ribbon icon state
  updateRibbonState() {
    if (this.settings.enabled) {
      this.ribbon.icon = "eye-off"; // Enabled icon
    } else {
      this.ribbon.icon = "eye"; // Disabled icon
    }
  }
};

// Settings Tab
class HideOriginalPDFsSettingTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;

    containerEl.empty();
    containerEl.createEl("h2", { text: "Hide Original PDFs Settings" });

    new obsidian.Setting(containerEl)
      .setName("Enable PDF Hiding")
      .setDesc("Enable or disable hiding of original PDFs if annotated versions exist.")
      .addToggle(toggle => {
        toggle.setValue(this.plugin.settings.enabled).onChange(async () => await this.plugin.toggleHiding())
      });
  }
}