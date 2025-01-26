/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => MyPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var MyPlugin = class extends import_obsidian.Plugin {
  onload() {
    this.addCommand({
      id: "move-mermaidjs-variable-declarations-up",
      name: "Clean code for Mermaid.js ( [ graph | flowchart ] )",
      editorCallback: (editor, view) => {
        var _a;
        var selection_old = editor.getSelection();
        var check_graph_type = ["graph", "flowchart"];
        var top_lines = selection_old.split("\n").filter((d) => {
          if (d !== "")
            return d;
        }).slice(0, 2);
        if (top_lines[0].trim() !== "```mermaid" && !top_lines[1].trim().match(/[graph flowchart]/g))
          return;
        var selection_copy = JSON.parse(JSON.stringify(selection_old));
        console.log(selection_old, selection_copy);
        var parenthesis_pattern = /[\(\[\>]/g;
        var parenthesis_pattern_open = /[\(\[\>]/;
        var parenthesis_pattern_close = /[\)\]]/;
        var re_variables_pattern = /([\w\d\_\/]+[\(\[\>][^\)\]\<]+[\)\]]?[^&\.\n\s][\"\']?[^&\n\-]*[\)\]\<])/g;
        var re_variables = selection_old.match(re_variables_pattern);
        var re_variables_quotes = (_a = selection_old.match(re_variables_pattern)) == null ? void 0 : _a.map((d) => d.split(parenthesis_pattern_open)[0] + d[parenthesis_pattern_open.exec(d).index] + '"' + d.split(parenthesis_pattern_open).slice(1).join("")).map((d) => d.slice(0, -1) + '"' + d.slice(-1)).map((d) => d.replace('""', '"'));
        console.log(re_variables);
        var clean_variables = re_variables == null ? void 0 : re_variables.map((d, i) => {
          var short_name = d.split(parenthesis_pattern)[0];
          console.log("vars_ " + d + " _ " + short_name);
          selection_copy = selection_copy.replace(d, short_name);
          return "    " + d;
        });
        console.log("# ", selection_copy);
        var vars_formatted = re_variables_quotes == null ? void 0 : re_variables_quotes.join("\n");
        var final_code = selection_copy.split("\n").slice(0, 2).join(" \n") + "\n\n\n%%var space start" + vars_formatted + "\n%%var space end\n\n\n" + selection_copy.split("\n").slice(2).join("\n");
        if (final_code.match(/\%\%var space start/g).length > 1) {
          var temp = final_code.split("%%var space end").splice(0, 1);
          var temp2 = final_code.split("%%var space end").splice(2);
          final_code = temp + "\n%%var space end" + temp2;
        }
        var final_code_ = top_lines.join("\n") + "\n\n%%var space start\n" + final_code.split("%%var space start")[1].replace(top_lines[1], "");
        final_code_ = final_code_.replace("\n\n\n\n\n", "");
        console.log(final_code_);
        console.log(top_lines);
        editor.replaceSelection(final_code_);
      }
    });
    this.addCommand({
      id: "regex-for-mermaid-style",
      name: "Regex for Mermaid.js style ( [ style | class ] )",
      editorCallback: async (editor, view) => {
        var document = this.app.workspace.getActiveFile();
        if (!(document == null ? void 0 : document.name))
          return;
        var document_txt = await this.app.vault.read(document);
        var selection = editor.getSelection().split("\n")[0];
        var style_type = selection.split(" ").slice(0, 1);
        var style_val = selection.split(" ").slice(-1);
        var style_regex = selection.split(" ").slice(1, 2);
        console.log("document text: ", document_txt);
        console.log("selection: ", selection);
        console.log("fields: ", style_type, style_regex, style_val);
        var all_vars_raw = document_txt.match(/([\w\d\_\/]+[\(\[\>][^\)\]\<]+[\)\]]?[^&\.\n\s][\"\']?[^&\n\-]*[\)\]\<])/g);
        var parenthesis_pattern = /[\(\[\>]/g;
        var all_vars_clean = all_vars_raw == null ? void 0 : all_vars_raw.map((d) => d.split(parenthesis_pattern)[0]);
        console.log("all vars: ", all_vars_clean);
        var regex_code = String(style_regex).split(",")[0].replace("/", "").replace("/", "");
        console.log("re", regex_code);
        var custom_regex = new RegExp(String(regex_code), "g");
        var retrieved_vars = all_vars_clean == null ? void 0 : all_vars_clean.filter((d) => {
          if (d.match(custom_regex)) {
            return d;
          }
        });
        console.log("retrieved vars: ", retrieved_vars);
        if (editor.getSelection().split("\n")[0].split(" ")[0] === "style") {
          var retrieved_vars_formatted = retrieved_vars.map((re) => {
            return [style_type, re, style_val].join(" ");
          });
          editor.replaceSelection(retrieved_vars_formatted.join("\n"));
        } else if (editor.getSelection().split("\n")[0].split(" ")[0] === "class") {
          var retrieved_vars_formatted_class = [style_type, retrieved_vars == null ? void 0 : retrieved_vars.join(","), style_val].join(" ");
          editor.replaceSelection(retrieved_vars_formatted_class);
        }
      }
    });
    this.addCommand({
      id: "create-empty-files-from-list-of-titles",
      name: "Create empty files from a list of titles",
      editorCallback: (editor, view) => {
        var _a, _b;
        const basePath = this.app.vault.adapter.basePath;
        var activeFolder = (_a = this.app.workspace.getActiveFile()) == null ? void 0 : _a.parent.path;
        console.log(activeFolder, (_b = this.app.workspace.getActiveFile()) == null ? void 0 : _b.path);
        var selection = editor.getSelection();
        var file_names = selection.split("\n").filter((d) => {
          if (d !== "") {
            return d.trim();
          }
        });
        var files = this.app.vault.getFiles().map((d) => d.path);
        console.log("old_files ", files);
        file_names.map((d) => {
          if (!files.includes(activeFolder + `/${d}.md`)) {
            this.app.vault.create(activeFolder + `/${d}.md`, "");
          } else {
            console.log("file already exists");
          }
        });
      }
    });
    this.addCommand({
      id: "copy-global-colorGroups-to-local-graph",
      name: "Copy global colorGroups to local graph",
      editorCallback: (editor, view) => {
        var graph_json = this.app.vault.adapter.read("./.obsidian/graph.json").then((d) => JSON.parse(d));
        var workspace_json = this.app.vault.adapter.read("./.obsidian/workspace.json").then((d) => JSON.parse(d));
        console.log(graph_json, workspace_json);
        graph_json.then((z) => {
          var g_graph = Object(z);
          return g_graph["colorGroups"];
        }).then((y) => {
          workspace_json.then((d) => {
            Object(Object(Object(Object(Object(Object(Object(Object(Object(d)["main"])["children"])[1])["children"])[0])["state"])["state"])["options"])["colorGroups"] = y;
            console.log(d);
            this.app.vault.adapter.remove("./.obsidian/workspace.json");
            this.app.vault.create("./.obsidian/workspace.json", JSON.stringify(d));
          }).then((j) => {
            var notice = new import_obsidian.Notice("WARNING: Close and reopen Obsidian to update local graph", 1e4);
          });
        });
      }
    });
    this.addCommand({
      id: "list-to-links",
      name: "List to links",
      editorCallback: (editor, view) => {
        var selection = editor.getSelection();
        var selection_list = [];
        var selection_formatted = "";
        if (selection.includes("\n")) {
          selection_list = selection.split("\n").filter((f) => {
            return f.replace(" ", "") !== "";
          }).map((d) => d.includes(",") ? "[[" + d.replace(",", "") + "]]," : "[[" + d + "]]");
          selection_formatted = selection_list.join("\n");
        } else {
          selection_list = selection.split(",").filter((f) => {
            return f.replace(" ", "") !== "";
          }).map((d) => "[[" + d + "]]");
          selection_formatted = selection_list.join(",");
        }
        editor.replaceSelection(selection_formatted);
      }
    });
    this.addCommand({
      id: "create-files-from-list-of-sections",
      name: "Create empty files from a list of sections (H2 as section titles)",
      editorCallback: (editor, view) => {
        var _a, _b;
        const basePath = this.app.vault.adapter.basePath;
        var activeFolder = (_a = this.app.workspace.getActiveFile()) == null ? void 0 : _a.parent.path;
        console.log(activeFolder, (_b = this.app.workspace.getActiveFile()) == null ? void 0 : _b.path);
        var selection = editor.getSelection();
        var file_names = selection.split("\n").filter((d) => {
          if (d !== "" && d.startsWith("##")) {
            return d;
          }
        }).map((d) => d.replace("##", "").replace(/[\*\"\\\/\<\>\:\|\?]/g, "_"));
        console.log(file_names);
        var files_contents = selection.split("##").filter((d) => {
          return d !== "";
        }).map((d) => d.split("\n").slice(1).join("\n"));
        console.log(files_contents);
        var files = this.app.vault.getFiles().map((d) => d.path);
        console.log("old_files ", files);
        file_names.map((d, i) => {
          if (!files.includes(activeFolder + `/${d}.md`)) {
            this.app.vault.create(activeFolder + `/${d}.md`, files_contents[i]);
          } else {
            console.log("file already exists");
          }
        });
      }
    });
  }
  onunload() {
  }
};

/* nosourcemap */