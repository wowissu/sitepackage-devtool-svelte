import * as vscode from 'vscode';
import * as jp from 'jsonpath';
import { CommonTreeItem } from './common.item';
import { TextEncoder } from 'util';

const fs = vscode.workspace.fs

export default class PropertyItem<P = any> extends CommonTreeItem<P> {
  public target!: vscode.Uri;
  public jpath!: string;

  write(phase: object, target = this.target, jpath = this.jpath) {
    return fs.readFile(target)
      .then((buf) => {
        const str = new TextDecoder("utf-8").decode(buf);
        const json = JSON.parse(str);
        jp.value(json, jpath, phase);

        const reBuf = new TextEncoder().encode(JSON.stringify(json, null, 2));

        return fs.writeFile(target, reBuf)
      })
  }
}