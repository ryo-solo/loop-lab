---
name: japanese_notifications
description: Telegram 通知は日本語固定。site content は bilingual を維持。
type: feedback
---

# Telegram 通知は日本語

会長指示（2026-05-17、phase 0 直後）：「テレグラムの報告は日本語がいいな」。

**Why**: 通知 channel の audience は会長 1 人。会長 native 言語で読みやすさ最大化。
site 本体は global audience（HN/Reddit）向けに英語 default + JA alternate を維持。

**How to apply**:
- `scripts/notify.sh` で送る全メッセージは日本語で書く
- HTML tag は使って良い（`<b>`、改行）
- 数値や英単語（KPI 名、commit hash、URL）は英語のまま混在 OK
- site の copy / commit message は英語のまま（global audience）

これは feedback / preference の境界。site content と通知 channel は別 audience。
