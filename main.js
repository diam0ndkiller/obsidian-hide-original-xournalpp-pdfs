// main.js
module.exports = class HideOriginalPDFs extends require("obsidian").Plugin {
  onload() {
    this.registerEvent(
      this.app.workspace.on("layout-ready", () => this.hideFiles())
    );
    this.registerEvent(
      this.app.vault.on("modify", () => this.hideFiles())
    );
  }

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

    // Hide the files from the file explorer
    const fileExplorer = this.app.workspace.getLeavesOfType("file-explorer")[0];
    if (fileExplorer) {
      const root = fileExplorer.view.fileItems;
      Object.keys(root).forEach(path => {
        console.log(root[path]);
        const item = root[path];
        if (hiddenPaths.has(path)) {
          item.selfEl.style.display = "none"; // Hide from view
        }
      });
    }
  }
};
