"use client";
import { supabase } from "@/lib/supabase";

import { useState, useEffect, useCallback, useMemo } from "react";

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes rts-modal-in {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  @keyframes rts-overlay-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes rts-card-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes rts-field-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes rts-label-in {
    from { opacity: 0; transform: translateX(-6px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes rts-success-pop {
    0%   { transform: scale(0.4);  opacity: 0; }
    60%  { transform: scale(1.12); opacity: 1; }
    80%  { transform: scale(0.95); }
    100% { transform: scale(1); }
  }
  @keyframes rts-success-text {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes rts-check-draw {
    from { stroke-dashoffset: 40; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes rts-confetti-burst {
    0%   { transform: translate(0,0) scale(1); opacity: 1; }
    100% { transform: translate(var(--tx),var(--ty)) scale(0); opacity: 0; }
  }
  @keyframes rts-shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-5px); }
    40%     { transform: translateX(5px); }
    60%     { transform: translateX(-4px); }
    80%     { transform: translateX(4px); }
  }
  @keyframes rts-shimmer {
    from { background-position: -200% center; }
    to   { background-position:  200% center; }
  }
  @keyframes rts-arrow-nudge {
    0%,100% { transform: translateX(0); }
    50%     { transform: translateX(4px); }
  }
  @keyframes rts-badge-pulse {
    0%,100% { box-shadow: 0 0 0 0   rgba(214,184,174,0.45); }
    50%     { box-shadow: 0 0 0 5px rgba(214,184,174,0); }
  }
  @keyframes rts-spin { to { transform: rotate(360deg); } }
  @keyframes rts-backdrop-in {
    from { backdrop-filter: blur(0px); }
    to   { backdrop-filter: blur(3px); }
  }
  @keyframes rts-chip-in {
    from { opacity: 0; transform: scale(0.7); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes rts-bar-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes rts-tag-in {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes rts-tick-in {
    0%   { transform: scale(0) rotate(-10deg); }
    60%  { transform: scale(1.2) rotate(4deg); }
    100% { transform: scale(1)  rotate(0deg); }
  }
  @keyframes rts-price-flip {
    0%   { opacity: 0; transform: translateY(-6px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  /* BUTTONS */
  .rts-btn-order {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 24px; border-radius: 8px;
    background: #D6B8AE; color: #333333; border: none;
    font-size: 15px; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', inherit; letter-spacing: -0.01em; white-space: nowrap;
    position: relative; overflow: hidden;
    transition: background 0.22s, transform 0.12s, box-shadow 0.22s;
  }
  .rts-btn-order::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.38) 50%, transparent 60%);
    background-size: 200% 100%; opacity: 0; transition: opacity 0.2s; pointer-events: none;
  }
  .rts-btn-order:hover { background: #c9a89c; box-shadow: 0 4px 16px rgba(214,184,174,0.45); transform: translateY(-1px); }
  .rts-btn-order:hover::after { opacity: 1; animation: rts-shimmer 0.55s ease forwards; }
  .rts-btn-order:active { transform: scale(0.97) translateY(0); }
  .rts-btn-pricing {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 24px; border-radius: 8px;
    background: transparent; color: #333333; border: 1.5px solid #D6B8AE;
    font-size: 15px; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', inherit; letter-spacing: -0.01em; white-space: nowrap;
    transition: background 0.22s, border-color 0.22s, transform 0.12s, box-shadow 0.22s;
    position: relative; overflow: hidden;
  }
  .rts-btn-pricing::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%);
    background-size: 200% 100%; opacity: 0; pointer-events: none;
  }
  .rts-btn-pricing:hover { background: #F5E6E1; border-color: #c9a89c; box-shadow: 0 4px 14px rgba(214,184,174,0.28); transform: translateY(-1px); }
  .rts-btn-pricing:hover::after { opacity: 1; animation: rts-shimmer 0.55s ease forwards; }
  .rts-btn-pricing:active { transform: scale(0.97) translateY(0); }
  .rts-cta-group { display: inline-flex; flex-wrap: wrap; gap: 12px; align-items: center; }

  /* OVERLAY */
  .rts-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(51,51,51,0.52);
    display: flex; align-items: center; justify-content: center; padding: 16px;
    opacity: 0; pointer-events: none; transition: opacity 0.28s ease;
    backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px);
  }
  .rts-overlay.rts-open {
    opacity: 1; pointer-events: all;
    animation: rts-overlay-in 0.28s ease forwards, rts-backdrop-in 0.4s ease forwards;
    backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
  }

  /* MODAL */
  .rts-modal {
    background: #ffffff; border-radius: 16px;
    box-shadow: 0 8px 48px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.06);
    width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto;
    padding: 32px; position: relative;
    opacity: 0; transform: translateY(24px) scale(0.97);
    transition: opacity 0.05s, transform 0.05s;
    scrollbar-width: thin; scrollbar-color: #e8ddd9 transparent;
  }
  .rts-modal::-webkit-scrollbar { width: 4px; }
  .rts-modal::-webkit-scrollbar-thumb { background: #e8ddd9; border-radius: 4px; }
  .rts-overlay.rts-open .rts-modal {
    animation: rts-modal-in 0.32s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  .rts-modal--pricing { max-width: 660px; padding-bottom: 0; }
  .rts-modal-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
  .rts-modal-title { font-size: 20px; font-weight: 600; color: #333333; margin: 0; font-family: 'DM Serif Display', Georgia, serif; }
  .rts-modal-sub { font-size: 13px; color: #888888; margin: 4px 0 0; font-family: 'DM Sans', inherit; }
  .rts-close-btn {
    background: #F5E6E1; border: none; border-radius: 50%;
    width: 32px; height: 32px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #666666; font-size: 18px; flex-shrink: 0; line-height: 1;
    transition: background 0.18s, transform 0.18s;
  }
  .rts-close-btn:hover { background: #D6B8AE; transform: rotate(90deg) scale(1.08); }
  .rts-section-label {
    font-size: 11px; font-weight: 600; color: #D6B8AE;
    letter-spacing: 0.08em; text-transform: uppercase;
    margin: 20px 0 12px; padding-bottom: 8px; border-bottom: 1px solid #F5E6E1;
    font-family: 'DM Sans', inherit;
    opacity: 0; animation: rts-label-in 0.3s ease forwards;
  }
  .rts-section-label:first-of-type { margin-top: 0; }

  /* LOCATION SELECTOR */
  .rts-location-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    margin-bottom: 16px;
  }
  .rts-location-field { display: flex; flex-direction: column; gap: 5px; }
  .rts-location-label {
    font-size: 12px; font-weight: 600; color: #888888;
    text-transform: uppercase; letter-spacing: 0.06em; font-family: 'DM Sans', inherit;
  }
  .rts-location-select {
    width: 100%; padding: 9px 34px 9px 12px; border-radius: 8px;
    border: 1.5px solid #e8ddd9; font-size: 13px; color: #333333; background: #ffffff;
    font-family: 'DM Sans', inherit; box-sizing: border-box; outline: none; cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 10px center;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .rts-location-select:focus { border-color: #D6B8AE; box-shadow: 0 0 0 3px rgba(214,184,174,0.18); }
  .rts-location-select:disabled { opacity: 0.45; cursor: not-allowed; background-color: #fafafa; }
  .rts-location-pill {
    display: inline-flex; align-items: center; gap: 5px;
    background: #F5E6E1; color: #b08070;
    font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 20px;
    font-family: 'DM Sans', inherit; margin-bottom: 14px;
    animation: rts-chip-in 0.22s ease forwards;
  }

  /* LOCATION GATE */
  .rts-location-gate {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 36px 20px; text-align: center; gap: 10px;
    border: 1.5px dashed #e8ddd9; border-radius: 12px; margin-bottom: 16px;
    background: #FDFAF9;
    animation: rts-field-in 0.3s ease forwards;
  }
  .rts-location-gate-icon {
    width: 40px; height: 40px; border-radius: 50%;
    background: #F5E6E1; display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }
  .rts-location-gate-title {
    font-size: 14px; font-weight: 600; color: #555555;
    font-family: 'DM Sans', inherit; margin: 0;
  }
  .rts-location-gate-sub {
    font-size: 12px; color: #aaaaaa;
    font-family: 'DM Sans', inherit; margin: 0; line-height: 1.5;
  }

  /* PRICING CARDS */
  .rts-pricing-grid { display: flex; flex-direction: column; gap: 10px; margin-bottom: 0; }
  .rts-pricing-card {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 18px; border-radius: 12px;
    border: 1.5px solid #F0E4DF; background: #FDFAF9;
    gap: 12px; cursor: pointer;
    opacity: 0; animation: rts-card-in 0.3s ease forwards;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s, background 0.2s;
    user-select: none; position: relative;
  }
  .rts-pricing-card:hover { border-color: #D6B8AE; box-shadow: 0 4px 18px rgba(214,184,174,0.2); transform: translateX(3px); background: #FFF8F6; }
  .rts-pricing-card.rts-selected { border-color: #D6B8AE; background: #F5E6E1; box-shadow: 0 4px 20px rgba(214,184,174,0.28); transform: translateX(3px); }
  .rts-pricing-card.rts-selected:hover { background: #f0dcd6; border-color: #c9a89c; }
  .rts-card-check {
    position: absolute; top: 10px; right: 12px;
    width: 20px; height: 20px; border-radius: 50%;
    border: 1.5px solid #e0d0cc; background: #fff;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.18s, background 0.18s; flex-shrink: 0;
  }
  .rts-pricing-card.rts-selected .rts-card-check { border-color: #D6B8AE; background: #D6B8AE; animation: rts-chip-in 0.22s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .rts-card-check svg { display: none; }
  .rts-pricing-card.rts-selected .rts-card-check svg { display: block; animation: rts-tick-in 0.22s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .rts-pricing-card-left { display: flex; flex-direction: column; gap: 3px; padding-right: 28px; }
  .rts-pricing-card-name { font-size: 14px; font-weight: 600; color: #333333; font-family: 'DM Sans', inherit; line-height: 1.3; }
  .rts-pricing-card-desc { font-size: 12px; color: #999999; font-family: 'DM Sans', inherit; line-height: 1.4; }
  .rts-pricing-location-note { font-size: 11px; color: #b08070; font-family: 'DM Sans', inherit; margin-top: 2px; }
  .rts-pricing-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; flex-shrink: 0; }
  .rts-pricing-amount {
    font-size: 20px; font-weight: 700; color: #333333;
    font-family: 'DM Serif Display', Georgia, serif; letter-spacing: -0.02em; line-height: 1;
    transition: color 0.18s;
    animation: rts-price-flip 0.25s ease forwards;
  }
  .rts-pricing-card:hover .rts-pricing-amount, .rts-pricing-card.rts-selected .rts-pricing-amount { color: #b08070; }
  .rts-pricing-unit { font-size: 11px; color: #bbbbbb; font-family: 'DM Sans', inherit; }
  .rts-popular-badge {
    display: inline-block; background: #F5E6E1; color: #b08070;
    font-size: 10px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
    padding: 2px 7px; border-radius: 20px; margin-left: 8px; vertical-align: middle;
    font-family: 'DM Sans', inherit; animation: rts-badge-pulse 2.5s ease infinite 1s;
  }
  .rts-pricing-card.rts-selected .rts-popular-badge { background: rgba(255,255,255,0.55); }

  /* SUMMARY BAR */
  .rts-summary-bar {
    position: sticky; bottom: 0; left: 0; right: 0;
    background: #ffffff; border-top: 1px solid #F0E4DF;
    padding: 18px 32px 24px; margin: 16px -32px 0;
    border-radius: 0 0 16px 16px; animation: rts-bar-in 0.28s ease forwards;
  }
  .rts-summary-hint { text-align: center; font-size: 13px; color: #ccbbbb; font-family: 'DM Sans', inherit; padding: 4px 0 8px; }
  .rts-summary-totals { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .rts-summary-label { font-size: 12px; font-weight: 600; color: #aaaaaa; text-transform: uppercase; letter-spacing: 0.07em; font-family: 'DM Sans', inherit; }
  .rts-summary-count { display: inline-flex; align-items: center; gap: 5px; background: #F5E6E1; color: #b08070; font-size: 11px; font-weight: 600; padding: 2px 9px; border-radius: 20px; font-family: 'DM Sans', inherit; margin-left: 8px; }
  .rts-summary-price { font-size: 22px; font-weight: 700; color: #333333; font-family: 'DM Serif Display', Georgia, serif; letter-spacing: -0.02em; }
  .rts-summary-price-sub { font-size: 12px; color: #aaaaaa; font-family: 'DM Sans', inherit; }
  .rts-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
  .rts-chip { display: inline-flex; align-items: center; gap: 5px; background: #F5E6E1; color: #7a5a50; font-size: 12px; font-weight: 500; padding: 4px 10px; border-radius: 20px; font-family: 'DM Sans', inherit; animation: rts-tag-in 0.18s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .rts-chip-x { cursor: pointer; color: #b08070; font-size: 14px; line-height: 1; display: flex; align-items: center; transition: color 0.15s, transform 0.15s; }
  .rts-chip-x:hover { color: #e07060; transform: scale(1.2); }
  .rts-proceed-btn {
    width: 100%; padding: 14px; border-radius: 10px;
    background: #D6B8AE; color: #333333; border: none;
    font-size: 15px; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', inherit; letter-spacing: -0.01em;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    position: relative; overflow: hidden;
    transition: background 0.22s, transform 0.12s, box-shadow 0.22s;
  }
  .rts-proceed-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.32) 50%, transparent 65%); background-size: 250% 100%; opacity: 0; pointer-events: none; }
  .rts-proceed-btn:not(:disabled):hover { background: #c9a89c; box-shadow: 0 4px 18px rgba(214,184,174,0.5); transform: translateY(-1px); }
  .rts-proceed-btn:not(:disabled):hover::after { opacity: 1; animation: rts-shimmer 0.6s ease forwards; }
  .rts-proceed-btn:not(:disabled):hover .rts-arrow-icon { animation: rts-arrow-nudge 0.5s ease infinite; }
  .rts-proceed-btn:not(:disabled):active { transform: scale(0.985) translateY(0); }
  .rts-proceed-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .rts-pricing-footer-note { text-align: center; font-size: 12px; color: #ccbbbb; margin-top: 10px; font-family: 'DM Sans', inherit; line-height: 1.5; }

  /* ORDER FORM */
  .rts-field { margin-bottom: 14px; opacity: 0; animation: rts-field-in 0.3s ease forwards; }
  .rts-field label { display: block; font-size: 13px; font-weight: 500; color: #555555; margin-bottom: 5px; font-family: 'DM Sans', inherit; transition: color 0.15s; }
  .rts-field:focus-within label { color: #b08070; }
  .rts-field label .req { color: #D6B8AE; margin-left: 2px; }
  .rts-field input, .rts-field select, .rts-field textarea { width: 100%; padding: 10px 13px; border-radius: 8px; border: 1.5px solid #e8ddd9; font-size: 14px; color: #333333; background: #ffffff; font-family: 'DM Sans', inherit; box-sizing: border-box; outline: none; transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s, background 0.18s; }
  .rts-field input:focus, .rts-field select:focus, .rts-field textarea:focus { border-color: #D6B8AE; box-shadow: 0 0 0 3px rgba(214,184,174,0.18); transform: translateY(-1px); background: #FFFAF9; }
  .rts-field input.rts-error, .rts-field select.rts-error { border-color: #e07060; animation: rts-shake 0.38s ease; box-shadow: 0 0 0 3px rgba(224,112,96,0.14); }
  .rts-field textarea { resize: vertical; min-height: 80px; line-height: 1.5; }
  .rts-field select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; cursor: pointer; }
  .rts-row   { display: grid; grid-template-columns: 1fr 1fr;     gap: 12px; }
  .rts-row-3 { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; }
  .rts-service-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .rts-service-tag { display: inline-flex; align-items: center; gap: 4px; background: #F5E6E1; color: #7a5a50; font-size: 11px; font-weight: 500; padding: 3px 9px 3px 6px; border-radius: 20px; font-family: 'DM Sans', inherit; animation: rts-tag-in 0.18s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .rts-submit-btn { width: 100%; padding: 13px; border-radius: 10px; background: #D6B8AE; color: #333333; border: none; font-size: 15px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', inherit; margin-top: 8px; letter-spacing: -0.01em; position: relative; overflow: hidden; transition: background 0.22s, transform 0.12s, box-shadow 0.22s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .rts-submit-btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.32) 50%, transparent 65%); background-size: 250% 100%; opacity: 0; pointer-events: none; }
  .rts-submit-btn:hover { background: #c9a89c; box-shadow: 0 4px 18px rgba(214,184,174,0.5); transform: translateY(-1px); }
  .rts-submit-btn:hover::after { opacity: 1; animation: rts-shimmer 0.6s ease forwards; }
  .rts-submit-btn:active { transform: scale(0.985) translateY(0); }
  .rts-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .rts-spinner { width: 16px; height: 16px; border: 2px solid rgba(51,51,51,0.25); border-top-color: #333333; border-radius: 50%; animation: rts-spin 0.65s linear infinite; flex-shrink: 0; }

  /* SUCCESS */
  .rts-success { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; text-align: center; position: relative; overflow: hidden; }
  .rts-success-icon { width: 64px; height: 64px; border-radius: 50%; background: #F5E6E1; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; position: relative; z-index: 1; animation: rts-success-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .rts-check-svg polyline { stroke-dasharray: 40; stroke-dashoffset: 40; animation: rts-check-draw 0.42s ease 0.3s forwards; }
  .rts-success h3 { font-size: 19px; color: #333333; margin: 0 0 8px; font-weight: 600; font-family: 'DM Serif Display', Georgia, serif; opacity: 0; animation: rts-success-text 0.35s ease 0.55s forwards; }
  .rts-success p  { font-size: 14px; color: #888888; margin: 0; line-height: 1.6; font-family: 'DM Sans', inherit; opacity: 0; animation: rts-success-text 0.35s ease 0.7s forwards; }
  .rts-confetti-dot { position: absolute; width: 7px; height: 7px; border-radius: 50%; opacity: 0; animation: rts-confetti-burst 0.7s ease var(--delay) forwards; }

  /* RESPONSIVE */
  @media (max-width: 600px) {
    .rts-modal { padding: 20px; }
    .rts-modal--pricing { padding-bottom: 0; }
    .rts-summary-bar { padding: 16px 20px 20px; margin: 16px -20px 0; }
    .rts-row, .rts-row-3, .rts-location-row { grid-template-columns: 1fr; }
    .rts-pricing-amount { font-size: 17px; }
    .rts-cta-group { flex-direction: column; align-items: stretch; }
    .rts-cta-group .rts-btn-order, .rts-cta-group .rts-btn-pricing { width: 100%; justify-content: center; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`;

// ─── Dynamic Pricing Data ──────────────────────────────────────────────────────
//
// Pricing resolution order (most specific wins):
//   1. LOCATION_PRICING[state][county][serviceId]  — exact county match
//   2. LOCATION_PRICING[state]["_default"][serviceId] — state-wide default
//   3. BASE_PRICES[serviceId]                       — national fallback
//
// To add a new state/county: add its entry in LOCATION_PRICING.
// To add a new service: add to SERVICE_CATALOG and BASE_PRICES.

const BASE_PRICES = {
  "current-owner": 75,
  "two-owner":     110,
  "title-30":      185,
  "commercial":    295,
  "lien":           65,
};

const LOCATION_PRICING = {
  FL: {
    _default:      { "current-owner": 85,  "two-owner": 125, "title-30": 195, "commercial": 325, "lien": 75 },
    "Miami-Dade":  { "current-owner": 110, "two-owner": 155, "title-30": 245, "commercial": 395, "lien": 95 },
    "Broward":     { "current-owner": 100, "two-owner": 145, "title-30": 225, "commercial": 365, "lien": 85 },
    "Palm Beach":  { "current-owner": 105, "two-owner": 150, "title-30": 235, "commercial": 385, "lien": 90 },
    "Orange":      { "current-owner": 90,  "two-owner": 130, "title-30": 205, "commercial": 340, "lien": 78 },
    "Hillsborough":{ "current-owner": 88,  "two-owner": 128, "title-30": 200, "commercial": 335, "lien": 76 },
  },
  TX: {
    _default: { "current-owner": 80, "two-owner": 115, "title-30": 190, "commercial": 310, "lien": 70 },
    "Harris":  { "current-owner": 95, "two-owner": 140, "title-30": 220, "commercial": 360, "lien": 85 },
    "Dallas":  { "current-owner": 92, "two-owner": 135, "title-30": 215, "commercial": 350, "lien": 82 },
    "Tarrant": { "current-owner": 88, "two-owner": 130, "title-30": 205, "commercial": 335, "lien": 78 },
    "Travis":  { "current-owner": 90, "two-owner": 132, "title-30": 210, "commercial": 345, "lien": 80 },
    "Bexar":   { "current-owner": 82, "two-owner": 118, "title-30": 195, "commercial": 315, "lien": 72 },
  },
  NY: {
    _default:     { "current-owner": 120, "two-owner": 175, "title-30": 275, "commercial": 450, "lien": 105 },
    "New York":   { "current-owner": 175, "two-owner": 250, "title-30": 395, "commercial": 625, "lien": 145 },
    "Kings":      { "current-owner": 165, "two-owner": 235, "title-30": 370, "commercial": 595, "lien": 135 },
    "Queens":     { "current-owner": 155, "two-owner": 220, "title-30": 345, "commercial": 560, "lien": 125 },
    "Nassau":     { "current-owner": 140, "two-owner": 200, "title-30": 315, "commercial": 510, "lien": 115 },
    "Westchester":{ "current-owner": 145, "two-owner": 205, "title-30": 325, "commercial": 525, "lien": 118 },
    "Suffolk":    { "current-owner": 135, "two-owner": 192, "title-30": 305, "commercial": 495, "lien": 112 },
  },
  CA: {
    _default:         { "current-owner": 115, "two-owner": 165, "title-30": 260, "commercial": 420, "lien": 98 },
    "Los Angeles":    { "current-owner": 145, "two-owner": 205, "title-30": 325, "commercial": 525, "lien": 125 },
    "San Diego":      { "current-owner": 130, "two-owner": 185, "title-30": 295, "commercial": 475, "lien": 112 },
    "Orange":         { "current-owner": 135, "two-owner": 192, "title-30": 305, "commercial": 490, "lien": 115 },
    "Riverside":      { "current-owner": 118, "two-owner": 168, "title-30": 265, "commercial": 430, "lien": 100 },
    "San Bernardino": { "current-owner": 115, "two-owner": 164, "title-30": 258, "commercial": 418, "lien": 97 },
  },
  IL: {
    _default: { "current-owner": 78,  "two-owner": 112, "title-30": 188, "commercial": 300, "lien": 68 },
    "Cook":   { "current-owner": 105, "two-owner": 150, "title-30": 240, "commercial": 390, "lien": 90 },
    "DuPage": { "current-owner": 88,  "two-owner": 128, "title-30": 202, "commercial": 325, "lien": 74 },
    "Lake":   { "current-owner": 85,  "two-owner": 125, "title-30": 198, "commercial": 318, "lien": 72 },
    "Will":   { "current-owner": 80,  "two-owner": 115, "title-30": 190, "commercial": 305, "lien": 69 },
  },
  GA: {
    _default:  { "current-owner": 72, "two-owner": 105, "title-30": 175, "commercial": 285, "lien": 62 },
    "Fulton":  { "current-owner": 92, "two-owner": 135, "title-30": 215, "commercial": 345, "lien": 80 },
    "Gwinnett":{ "current-owner": 78, "two-owner": 112, "title-30": 185, "commercial": 298, "lien": 66 },
    "Cobb":    { "current-owner": 76, "two-owner": 110, "title-30": 182, "commercial": 293, "lien": 65 },
    "DeKalb":  { "current-owner": 82, "two-owner": 120, "title-30": 195, "commercial": 315, "lien": 70 },
  },
};

const STATES = [
  { code: "CA", name: "California" },
  { code: "FL", name: "Florida"    },
  { code: "GA", name: "Georgia"    },
  { code: "IL", name: "Illinois"   },
  { code: "NY", name: "New York"   },
  { code: "TX", name: "Texas"      },
];

// Build county lists from LOCATION_PRICING keys (strip _default)
const COUNTIES = Object.fromEntries(
  Object.entries(LOCATION_PRICING).map(([state, counties]) => [
    state,
    Object.keys(counties).filter((k) => k !== "_default").sort(),
  ])
);

// Pricing resolver — resolution order: county → state default → national base
function resolvePrice(stateCode, countyName, serviceId) {
  const statePricing = LOCATION_PRICING[stateCode];
  if (!statePricing) return BASE_PRICES[serviceId];
  if (countyName && statePricing[countyName]?.[serviceId] != null)
    return statePricing[countyName][serviceId];
  if (statePricing._default?.[serviceId] != null)
    return statePricing._default[serviceId];
  return BASE_PRICES[serviceId];
}

// ─── Service Catalog ──────────────────────────────────────────────────────────
// Prices are NOT stored here — they are resolved dynamically via resolvePrice()
const SERVICE_CATALOG = [
  { id: "current-owner", name: "Current Owner Search",   desc: "Shows current ownership details and encumbrances",        popular: false },
  { id: "two-owner",     name: "Two Owner Search",        desc: "Shows last two ownership records with full chain",         popular: true  },
  { id: "title-30",      name: "30-Year Title Search",    desc: "Full chain of title history — ideal for most closings",    popular: false },
  { id: "commercial",    name: "Commercial Title Search", desc: "For commercial properties — includes entity verification", popular: false },
  { id: "lien",          name: "Lien Search",             desc: "Shows all liens, judgments, and outstanding encumbrances", popular: false },
];

const CONFETTI = [
  { color: "#D6B8AE", tx: "-28px", ty: "-36px", delay: "0.28s" },
  { color: "#F5E6E1", tx:  "30px", ty: "-40px", delay: "0.34s" },
  { color: "#c9a89c", tx: "-38px", ty:  "-8px", delay: "0.22s" },
  { color: "#D6B8AE", tx:  "40px", ty: "-12px", delay: "0.4s"  },
  { color: "#F5E6E1", tx:  "-6px", ty: "-44px", delay: "0.3s"  },
  { color: "#b08070", tx:  "14px", ty: "-42px", delay: "0.36s" },
  { color: "#D6B8AE", tx: "-44px", ty:  "10px", delay: "0.26s" },
  { color: "#c9a89c", tx:  "46px", ty:   "6px", delay: "0.42s" },
];

const emptyForm = { name:"", email:"", phone:"", address:"", city:"", state:"", zip:"", apn:"", service:"", notes:"" };
const stagger = (i, base = 0.06) => ({ animationDelay: `${i * base}s` });
const fmt     = (n) => `$${n.toLocaleString()}`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const OrderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
  </svg>
);
const PricingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg className="rts-arrow-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const TickIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const AnimatedCheck = () => (
  <svg className="rts-check-svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#D6B8AE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const TagDot = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="#D6B8AE" aria-hidden="true"><circle cx="4" cy="4" r="3"/></svg>
);
const LocationPinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

// ─── Pricing Modal ─────────────────────────────────────────────────────────────
function PricingModal({ open, onClose, onProceedToOrder }) {
  const [selected,       setSelected]       = useState([]);
  const [selectedState,  setSelectedState]  = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");

  // Reset everything when modal closes
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setSelected([]); setSelectedState(""); setSelectedCounty("");
      }, 280);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // When state changes, reset county selection
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCounty("");
  };

  // Compute prices for all services given the current state + county
  const resolvedPrices = useMemo(() => {
    const out = {};
    SERVICE_CATALOG.forEach((svc) => {
      out[svc.id] = resolvePrice(selectedState, selectedCounty, svc.id);
    });
    return out;
  }, [selectedState, selectedCounty]);

  const availableCounties = selectedState ? (COUNTIES[selectedState] || []) : [];

  const toggleService = useCallback((id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  }, []);

  const removeService = useCallback((e, id) => {
    e.stopPropagation();
    setSelected((prev) => prev.filter((s) => s !== id));
  }, []);

  // Enrich selected items with their current resolved prices
  const selectedItems = useMemo(() =>
    SERVICE_CATALOG
      .filter((svc) => selected.includes(svc.id))
      .map((svc) => ({ ...svc, price: resolvedPrices[svc.id] })),
    [selected, resolvedPrices]
  );

  const total        = selectedItems.reduce((sum, p) => sum + p.price, 0);
  const hasSelection = selectedItems.length > 0;

  const locationLabel = useMemo(() => {
    if (!selectedState) return null;
    const stateName = STATES.find((s) => s.code === selectedState)?.name || selectedState;
    return selectedCounty ? `${selectedCounty} County, ${stateName}` : stateName;
  }, [selectedState, selectedCounty]);

  const handleProceed = () => onProceedToOrder(selectedItems);

  return (
    <div
      className={`rts-overlay${open ? " rts-open" : ""}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-label="View pricing"
    >
      <div className="rts-modal rts-modal--pricing">

        {/* Header */}
        <div className="rts-modal-header">
          <div>
            <p className="rts-modal-title">Search &amp; Title Pricing</p>
            <p className="rts-modal-sub">Select your state and county first — services and prices will appear below.</p>
          </div>
          <button className="rts-close-btn" onClick={onClose} aria-label="Close pricing">&#215;</button>
        </div>

        {/* Location Selector */}
        <p className="rts-section-label" style={stagger(0, 0.07)}>Select location</p>
        <div className="rts-location-row" style={stagger(1, 0.07)}>
          <div className="rts-location-field">
            <label className="rts-location-label" htmlFor="rts-state-select">State</label>
            <select
              id="rts-state-select"
              className="rts-location-select"
              value={selectedState}
              onChange={handleStateChange}
            >
              <option value="">— Select State —</option>
              {STATES.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="rts-location-field">
            <label className="rts-location-label" htmlFor="rts-county-select">County</label>
            <select
              id="rts-county-select"
              className="rts-location-select"
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              disabled={!selectedState}
            >
              <option value="">{selectedState ? "— All Counties —" : "— Select State First —"}</option>
              {availableCounties.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active location pill */}
        {locationLabel && (
          <div className="rts-location-pill">
            <LocationPinIcon /> Pricing for {locationLabel}
          </div>
        )}

        {/* Service Cards — only shown after both state AND county are selected */}
        {selectedState && selectedCounty ? (
          <>
            <p className="rts-section-label" style={stagger(2, 0.07)}>Available services</p>
            <div className="rts-pricing-grid">
              {SERVICE_CATALOG.map((item, i) => {
                const isSel    = selected.includes(item.id);
                const price    = resolvedPrices[item.id];
                const isCustom = price !== BASE_PRICES[item.id];
                return (
                  <div
                    key={item.id}
                    className={`rts-pricing-card${isSel ? " rts-selected" : ""}`}
                    style={stagger(i + 3, 0.07)}
                    onClick={() => toggleService(item.id)}
                    role="checkbox"
                    aria-checked={isSel}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggleService(item.id); } }}
                  >
                    <div className="rts-card-check" aria-hidden="true"><TickIcon /></div>
                    <div className="rts-pricing-card-left">
                      <span className="rts-pricing-card-name">
                        {item.name}
                        {item.popular && <span className="rts-popular-badge">Popular</span>}
                      </span>
                      <span className="rts-pricing-card-desc">{item.desc}</span>
                      {isCustom && (
                        <span className="rts-pricing-location-note">Priced for {locationLabel}</span>
                      )}
                    </div>
                    <div className="rts-pricing-card-right">
                      {/* key on price forces React to re-mount the element, re-triggering the CSS animation */}
                      <span className="rts-pricing-amount" key={`${item.id}-${price}`}>
                        {fmt(price)}
                      </span>
                      <span className="rts-pricing-unit">per search</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rts-location-gate">
            <div className="rts-location-gate-icon">
              <LocationPinIcon />
            </div>
            <p className="rts-location-gate-title">
              {!selectedState
                ? "Please select state and county to view services"
                : "Please select a county to view services"}
            </p>
            <p className="rts-location-gate-sub">
              {!selectedState
                ? "Pricing varies by location — choose your state and county above to see accurate rates."
                : "Choose a county from the dropdown above to see pricing for your area."}
            </p>
          </div>
        )}

        {/* Sticky Summary Bar */}
        <div className="rts-summary-bar">
          {hasSelection && (
            <div className="rts-chips">
              {selectedItems.map((item) => (
                <span key={item.id} className="rts-chip">
                  {item.name} · {fmt(item.price)}
                  <span className="rts-chip-x" onClick={(e) => removeService(e, item.id)} role="button" aria-label={`Remove ${item.name}`}>&#215;</span>
                </span>
              ))}
            </div>
          )}
          <div className="rts-summary-totals">
            <div>
              <span className="rts-summary-label">Total</span>
              {hasSelection && (
                <span className="rts-summary-count">{selectedItems.length} service{selectedItems.length !== 1 ? "s" : ""}</span>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              {/* key re-triggers the price flip animation whenever total changes */}
              <div className="rts-summary-price" key={total}>{hasSelection ? fmt(total) : "—"}</div>
              {hasSelection && (
                <div className="rts-summary-price-sub">
                  estimated{locationLabel ? ` · ${locationLabel}` : ""}
                </div>
              )}
            </div>
          </div>
          {!hasSelection && (
            <p className="rts-summary-hint">
              {!selectedState
                ? "Choose your state and county to see pricing"
                : !selectedCounty
                ? "Choose a county to see available services"
                : "Select a service above to see pricing"}
            </p>
          )}
          <button className="rts-proceed-btn" onClick={handleProceed} disabled={!hasSelection}>
            {hasSelection ? "Proceed to Order" : (!selectedState || !selectedCounty) ? "Select Location First" : "Select a Service First"}
            {hasSelection && <ArrowRightIcon />}
          </button>
          <p className="rts-pricing-footer-note">Turnaround typically 24–48 hours · Bulk pricing available</p>
        </div>

      </div>
    </div>
  );
}

// ─── Order Modal ───────────────────────────────────────────────────────────────
function OrderModal({ open, onClose, prefilledServices }) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form,    setForm]    = useState(emptyForm);
  const [errors,  setErrors]  = useState({});

  useEffect(() => {
    if (open && prefilledServices && prefilledServices.length > 0) {
      const serviceString = prefilledServices.map((s) => s.name).join(", ");
      setForm((f) => ({ ...f, service: serviceString }));
      setErrors((er) => ({ ...er, service: false }));
    }
  }, [open, prefilledServices]);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => { setSuccess(false); setLoading(false); setForm(emptyForm); setErrors({}); }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: false }));
  };

  const handleSubmit = async() => {
    const required = ["name", "email", "phone", "address", "service"];
    const newErrors = {};
    required.forEach((f) => { if (!form[f].trim()) newErrors[f] = true; });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
   setLoading(true);

try {
  const { error } = await supabase
    .from("orders")
    .insert([
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
        service: form.service,
        notes: form.notes,
      },
    ]);

  if (error) throw error;

  // ✅ SUCCESS UI
  setSuccess(true);

  // 📩 SEND EMAIL
  await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: form.email,
      name: form.name,
      service: form.service,
    }),
  });

  setTimeout(onClose, 2800);
} catch (err) {
  console.log("FULL ERROR OBJECT:", err);
  console.log("ERROR MESSAGE:", err?.message);
  console.log("STRINGIFIED:", JSON.stringify(err, null, 2));

  alert(err?.message || "Failed to save order");
} finally {
  setLoading(false);
}}

  const fi = (n) => stagger(n, 0.055);
  const serviceTags = prefilledServices && prefilledServices.length > 0 ? prefilledServices : [];

  return (
    <div
      className={`rts-overlay${open ? " rts-open" : ""}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-label="Place a title order"
    >
      <div className="rts-modal">
        {!success ? (
          <>
            <div className="rts-modal-header">
              <div>
                <p className="rts-modal-title">Place a Title Order</p>
                <p className="rts-modal-sub">Fields marked <span style={{ color: "#D6B8AE" }}>*</span> are required.</p>
              </div>
              <button className="rts-close-btn" onClick={onClose} aria-label="Close modal">&#215;</button>
            </div>

            <p className="rts-section-label" style={fi(0)}>Customer details</p>
            <div className="rts-field" style={fi(1)}>
              <label>Full Name <span className="req">*</span></label>
              <input type="text" value={form.name} onChange={handleChange("name")} placeholder="Jane Smith" className={errors.name ? "rts-error" : ""} />
            </div>
            <div className="rts-row">
              <div className="rts-field" style={fi(2)}>
                <label>Email Address <span className="req">*</span></label>
                <input type="email" value={form.email} onChange={handleChange("email")} placeholder="jane@titleco.com" className={errors.email ? "rts-error" : ""} />
              </div>
              <div className="rts-field" style={fi(3)}>
                <label>Phone Number <span className="req">*</span></label>
                <input type="tel" value={form.phone} onChange={handleChange("phone")} placeholder="(555) 000-0000" className={errors.phone ? "rts-error" : ""} />
              </div>
            </div>

            <p className="rts-section-label" style={fi(4)}>Property details</p>
            <div className="rts-field" style={fi(5)}>
              <label>Property Address <span className="req">*</span></label>
              <input type="text" value={form.address} onChange={handleChange("address")} placeholder="123 Main Street" className={errors.address ? "rts-error" : ""} />
            </div>
            <div className="rts-row-3">
              <div className="rts-field" style={fi(6)}><label>City</label><input type="text" value={form.city} onChange={handleChange("city")} placeholder="Springfield" /></div>
              <div className="rts-field" style={fi(7)}><label>State</label><input type="text" value={form.state} onChange={handleChange("state")} placeholder="IL" maxLength={2} /></div>
              <div className="rts-field" style={fi(8)}><label>ZIP</label><input type="text" value={form.zip} onChange={handleChange("zip")} placeholder="62701" maxLength={10} /></div>
            </div>
            <div className="rts-field" style={fi(9)}>
              <label>APN / Parcel Number <span style={{ color: "#bbbbbb", fontWeight: 400 }}>(optional)</span></label>
              <input type="text" value={form.apn} onChange={handleChange("apn")} placeholder="e.g. 12-34-567-890" />
            </div>

            <p className="rts-section-label" style={fi(10)}>Service selection</p>
            <div className="rts-field" style={fi(11)}>
              <label>Selected Services <span className="req">*</span></label>
              <input
                type="text" value={form.service} onChange={handleChange("service")}
                placeholder="e.g. 30-Year Title Search, Lien Search"
                className={errors.service ? "rts-error" : ""}
                readOnly={serviceTags.length > 0}
                style={serviceTags.length > 0 ? { background: "#FDFAF9", color: "#555" } : {}}
              />
              {serviceTags.length > 0 && (
                <div className="rts-service-tags">
                  {serviceTags.map((s) => (
                    <span key={s.id} className="rts-service-tag"><TagDot /> {s.name} — {fmt(s.price)}</span>
                  ))}
                </div>
              )}
            </div>

            <p className="rts-section-label" style={fi(12)}>Additional notes</p>
            <div className="rts-field" style={fi(13)}>
              <label>Special Instructions or Notes</label>
              <textarea value={form.notes} onChange={handleChange("notes")} placeholder="Any additional context, deadlines, or special instructions…" />
            </div>

            <div style={fi(14)}>
              <button className="rts-submit-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? <><span className="rts-spinner" /> Processing…</> : "Place Order"}
              </button>
            </div>
          </>
        ) : (
          <div className="rts-success">
            {CONFETTI.map((c, i) => (
              <span key={i} className="rts-confetti-dot" style={{ background: c.color, "--tx": c.tx, "--ty": c.ty, "--delay": c.delay, top: "50%", left: "50%" }} />
            ))}
            <div className="rts-success-icon"><AnimatedCheck /></div>
            <h3>Order submitted successfully!</h3>
            <p>We'll acknowledge your order within minutes and send a confirmation to your email.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root Component ────────────────────────────────────────────────────────────
export default function TakeUpOrderModal() {
  const [orderOpen,         setOrderOpen]         = useState(false);
  const [pricingOpen,       setPricingOpen]       = useState(false);
  const [prefilledServices, setPrefilledServices] = useState([]);

  useEffect(() => {
    const id = "rts-order-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id; tag.textContent = styles;
      document.head.appendChild(tag);
    }
  }, []);

  const handleProceedToOrder = useCallback((selectedItems) => {
    setPrefilledServices(selectedItems);
    setPricingOpen(false);
    setTimeout(() => setOrderOpen(true), 200);
  }, []);

  const openOrderDirect = useCallback(() => { setPrefilledServices([]); setOrderOpen(true); }, []);
  const closeOrder      = useCallback(() => setOrderOpen(false),   []);
  const openPricing     = useCallback(() => setPricingOpen(true),  []);
  const closePricing    = useCallback(() => setPricingOpen(false), []);

  return (
    <>
      <div className="rts-cta-group">
        <button className="rts-btn-order" onClick={openOrderDirect}><OrderIcon /> Take Up Order</button>
        <button className="rts-btn-pricing" onClick={openPricing}><PricingIcon /> View Pricing</button>
      </div>
      <PricingModal open={pricingOpen} onClose={closePricing} onProceedToOrder={handleProceedToOrder} />
      <OrderModal   open={orderOpen}   onClose={closeOrder}   prefilledServices={prefilledServices}   />
    </>
  );
}
