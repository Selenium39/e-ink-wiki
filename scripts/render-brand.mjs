/**
 * 把品牌标渲染成 favicon、PWA 图标和 OG 图。
 * 字体只用系统里的 Noto Sans；产物提交进 public/，构建不再依赖本脚本。
 *
 *   pnpm render-brand
 */
import { Resvg } from "@resvg/resvg-js";
import pngToIco from "png-to-ico";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public");

const fonts = {
  fontFiles: [
    "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf",
    "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf",
  ],
  loadSystemFonts: false,
  defaultFontFamily: "Noto Sans",
};

const paper = "#f4f1ea";
const ink = "#1a1a1a";
const card = "#fffcf8";

/** 方形标：电纸书轮廓 + 三行字。favicon / PWA / apple touch 共用。 */
export const iconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="${paper}"/>
  <rect x="146" y="72" width="220" height="368" rx="32" fill="${card}" stroke="${ink}" stroke-width="16"/>
  <path d="M190 156h132M190 212h132M190 268h132M190 324h84" fill="none" stroke="${ink}" stroke-width="14" stroke-linecap="round"/>
</svg>
`;

/** 分享卡片。社交平台裁切时字仍在右侧安全区。 */
const ogSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${paper}"/>
  <rect x="28" y="28" width="1144" height="574" rx="28" fill="none" stroke="#e3ddd2" stroke-width="2"/>
  <g transform="translate(92 78) scale(0.92)">
    <rect width="512" height="512" rx="96" fill="${paper}"/>
    <rect x="146" y="72" width="220" height="368" rx="32" fill="${card}" stroke="${ink}" stroke-width="16"/>
    <path d="M190 156h132M190 212h132M190 268h132M190 324h84" fill="none" stroke="${ink}" stroke-width="14" stroke-linecap="round"/>
  </g>
  <path d="M560 150v330" stroke="#e3ddd2" stroke-width="2"/>
  <text x="608" y="230" fill="#6f6a64" font-family="Noto Sans" font-size="22" font-weight="700" letter-spacing="5">E-BOOK WIKI</text>
  <text x="608" y="318" fill="${ink}" font-family="Noto Sans" font-size="78" font-weight="700">E-ink Wiki</text>
  <text x="608" y="378" fill="#3c3834" font-family="Noto Sans" font-size="28">Kindle, Kobo, and BOOX</text>
  <text x="608" y="422" fill="#3c3834" font-family="Noto Sans" font-size="28">Formats, dictionaries, reading software</text>
  <text x="608" y="500" fill="#8a847c" font-family="Noto Sans" font-size="22">wiki.e-ink.me</text>
</svg>
`;

function png(svg, width) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font: fonts,
  });
  return resvg.render().asPng();
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "icon.svg"), iconSvg);

const sizes = [32, 180, 192, 512];
const pngs = {};
for (const size of sizes) {
  pngs[size] = png(iconSvg, size);
}

fs.writeFileSync(path.join(outDir, "icon-32.png"), pngs[32]);
fs.writeFileSync(path.join(outDir, "apple-touch-icon.png"), pngs[180]);
fs.writeFileSync(path.join(outDir, "icon-192.png"), pngs[192]);
fs.writeFileSync(path.join(outDir, "icon-512.png"), pngs[512]);
fs.writeFileSync(path.join(outDir, "og.png"), png(ogSvg, 1200));

const ico = await pngToIco([png(iconSvg, 16), pngs[32], png(iconSvg, 48)]);
fs.writeFileSync(path.join(outDir, "favicon.ico"), ico);

console.log("wrote public/icon.svg, favicon.ico, icon-*.png, apple-touch-icon.png, og.png");
