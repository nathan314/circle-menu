/**
 * =========================================================================
 * CIRCULAR MENU UI — HEADER & MOBILE DOCK COMPONENT ENGINE (v.4.5)
 * Dedicated Standalone Module for Floating Capsule Header & Mobile Bottom Dock
 * Designed & Engineered by Natã da Silva Targina (NStar Concepts)
 * License: MIT
 * =========================================================================
 */

(function (global, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(global);
    } else {
        global.HeaderCircleMenuEngine = factory(global);
    }
})(typeof window !== 'undefined' ? window : this, function (window) {
    'use strict';

    class HeaderCircleMenuEngine {
        constructor(options) {
            this.options = options || {};
            this.stage = document.getElementById(options.stageId);
            this.wheel = document.getElementById(options.wheelId);
            this.wheelWrapper = options.wheelWrapperId ? document.getElementById(options.wheelWrapperId) : null;
            this.outerRing = options.outerRingId ? document.getElementById(options.outerRingId) : null;
            this.label = options.labelId ? document.getElementById(options.labelId) : null;
            this.fixedTopLabel = options.fixedTopLabelId ? document.getElementById(options.fixedTopLabelId) : null;
            this.flashEffect = options.flashEffectId ? document.getElementById(options.flashEffectId) : null;
            this.centerHub = options.centerHubId ? document.getElementById(options.centerHubId) : null;
            this.centerHubScaler = options.centerHubScalerId ? document.getElementById(options.centerHubScalerId) : null;
            this.triggerArea = options.triggerAreaId ? document.getElementById(options.triggerAreaId) : this.stage;

            this.isCompact = !!options.isCompact;
            this.isMobileDock = !!options.isMobileDock;
            this.onSelect = options.onSelect || null;
            this.beamImgSrc = options.beamImgSrc || 'https://nstarconcepts.com/wp-content/themes/nstar-fullbychild-v4/img/light-beam_lightMode.svg';

            this.items = options.data || [];
            this.itemCount = this.items.length;
            this.wheelItems = [];

            this.baseWheelSvg = null;
            this.activeArcSvg = null;

            this.currentAngle = 0;
            this.targetAngle = 0;
            this.lastInputAngle = 0;
            this.isTouching = false;
            this.isRevealed = false;
            this.activeHoverIdx = -1;
            this.activeApexIdx = -1;
            this.isApexLocked = false;
            this.hoverLeaveTimer = null;
            this.lerpFactor = options.lerpFactor || 0.22;

            if (this.stage && this.wheel) {
                this.init();
            }
        }

        // =========================================================================
        // ⚙️ CUSTOMIZABLE GEOMETRY & HIT-TESTING PARAMETERS (HEADER & MOBILE DOCK)
        // =========================================================================
        getDimensions() {
            const stageRect = this.stage.getBoundingClientRect();
            const stageW = stageRect.width || (this.isCompact ? 176 : 176);

            // 1. Desktop Floating Capsule Header Mode (isCompact)
            if (this.isCompact) {
                return {
                    stageW,
                    radius: this.options.radius || 52,
                    beamRadialOffset: this.options.beamRadialOffset !== undefined ? this.options.beamRadialOffset : 2,
                    dashWidth: this.options.dashWidth || 36,
                    beamSVGWidth: this.options.beamSVGWidth || 96,
                    beamHeight: this.options.beamHeight || 90,
                    hitDistance: this.options.hitDistance || 130
                };
            }

            // 2. Mobile Bottom Docked Thumb Navigation Mode (isMobileDock)
            return {
                stageW,
                radius: this.options.radius || 78,
                beamRadialOffset: this.options.beamRadialOffset !== undefined ? this.options.beamRadialOffset : 3,
                dashWidth: this.options.dashWidth || 50,
                beamSVGWidth: this.options.beamSVGWidth || 110,
                beamHeight: this.options.beamHeight || 140,
                hitDistance: this.options.hitDistance || 160
            };
        }

        build() {
            const dims = this.getDimensions();
            const { radius, beamSVGWidth, beamHeight, beamRadialOffset } = dims;
            this.dimensions = dims;

            this.wheel.innerHTML = '';
            this.wheelItems.length = 0;

            const baseCircleSymbol = '#circle-items-mobile';
            const activeArcSymbol = '#circle-item-mobile';
            const viewBox = '0 0 360 360';

            // 1. Single Unified Base Wheel Ring (All dashes rendered in 1 lightweight vector)
            this.baseWheelSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            this.baseWheelSvg.setAttribute('viewBox', viewBox);
            this.baseWheelSvg.setAttribute('class', 'base-wheel-svg w-full h-full absolute inset-0 pointer-events-none text-blue-emphasis drop-shadow-[0_0_8px_rgba(0,162,255,0.8)]');

            const baseWheelUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            baseWheelUse.setAttribute('href', baseCircleSymbol);
            this.baseWheelSvg.appendChild(baseWheelUse);
            this.wheel.appendChild(this.baseWheelSvg);

            // 2. Active Arc Highlight (Rotates smoothly to active sector angle)
            this.activeArcSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            this.activeArcSvg.setAttribute('viewBox', viewBox);
            this.activeArcSvg.setAttribute('class', 'active-arc-svg w-full h-full absolute inset-0 pointer-events-none opacity-0 text-ns-orange drop-shadow-[0_0_12px_rgba(255,162,31,0.95)] will-change-transform');

            const activeArcUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            activeArcUse.setAttribute('href', activeArcSymbol);
            this.activeArcSvg.appendChild(activeArcUse);
            this.wheel.appendChild(this.activeArcSvg);

            // 3. Tangent Light Beams (Aligned tangentially to sector dashes)
            const sectorAngle = 360 / this.itemCount;

            this.items.forEach((item, index) => {
                const angleDeg = index * sectorAngle;

                const sectorDiv = document.createElement('div');
                sectorDiv.className = 'beam-item-sector absolute pointer-events-none';
                sectorDiv.style.left = '50%';
                sectorDiv.style.top = '50%';
                sectorDiv.style.width = '0px';
                sectorDiv.style.height = '0px';
                sectorDiv.style.transform = `rotate(${angleDeg}deg)`;

                const anchor = document.createElement('div');
                anchor.className = 'dash-beam-anchor absolute pointer-events-none';
                anchor.style.left = '0px';
                anchor.style.top = `-${radius}px`;
                anchor.style.width = '0px';
                anchor.style.height = '0px';

                const beamBox = document.createElement('div');
                beamBox.className = 'beam-box absolute pointer-events-none z-10';
                beamBox.style.left = `-${beamSVGWidth / 2}px`;
                beamBox.style.top = `-${beamHeight + (beamRadialOffset || 0)}px`;
                beamBox.style.width = `${beamSVGWidth}px`;
                beamBox.style.height = `${beamHeight}px`;

                const beamImg = document.createElement('img');
                beamImg.src = this.beamImgSrc;
                beamImg.alt = item.label;
                beamImg.className = 'w-full h-full object-fill opacity-0 drop-shadow-[0_0_35px_rgba(255,247,183,1)] pointer-events-none';

                beamBox.appendChild(beamImg);
                anchor.appendChild(beamBox);
                sectorDiv.appendChild(anchor);
                this.wheel.appendChild(sectorDiv);

                const itemObj = {
                    index,
                    item,
                    baseAngle: angleDeg,
                    beamBox,
                    beamImg
                };
                this.wheelItems.push(itemObj);

                const onEnter = () => {
                    if (window.innerWidth < 1024) return;
                    if (!this.isRevealed) this.reveal();
                    if (this.hoverLeaveTimer) {
                        clearTimeout(this.hoverLeaveTimer);
                        this.hoverLeaveTimer = null;
                    }
                    if (this.activeHoverIdx !== index) {
                        this.activeHoverIdx = index;
                        this.setActiveItem(index);
                    }
                };

                const onLeave = () => {
                    if (window.innerWidth < 1024) return;
                    if (this.hoverLeaveTimer) clearTimeout(this.hoverLeaveTimer);
                    this.hoverLeaveTimer = setTimeout(() => {
                        if (this.activeHoverIdx === index) {
                            this.activeHoverIdx = -1;
                            this.setActiveItem(-1);
                            this.hoverLeaveTimer = null;
                        }
                    }, 100);
                };

                const onClick = (e) => {
                    e.stopPropagation();
                    if (this.flashEffect && typeof gsap !== 'undefined') {
                        gsap.fromTo(this.flashEffect, { opacity: 1, scale: 0.8 }, { opacity: 0, scale: 1.3, duration: 0.4 });
                    }
                    this.activeHoverIdx = index;
                    this.setActiveItem(index);
                    if (typeof this.onSelect === 'function') {
                        this.onSelect(item, index);
                    }
                    if (item && item.url) {
                        window.open(item.url, '_blank', 'noopener,noreferrer');
                    }
                };

                beamBox.addEventListener('mouseenter', onEnter);
                beamBox.addEventListener('mouseleave', onLeave);
                beamBox.addEventListener('click', onClick);
            });

            // Start clean with zero pre-selection
            this.setActiveItem(-1);
        }

        setActiveItem(targetIndex) {
            const isMobile = window.innerWidth < 1024;

            if (targetIndex === -1) {
                if (this.activeArcSvg) {
                    this.activeArcSvg.style.opacity = '0';
                }
                this.wheelItems.forEach((obj) => {
                    if (obj.beamImg && typeof gsap !== 'undefined') {
                        gsap.to(obj.beamImg, { opacity: 0, duration: 0.18, ease: 'power2.out', overwrite: 'all' });
                    }
                    if (obj.beamBox) obj.beamBox.style.pointerEvents = 'none';
                });
                if (this.label && this.isRevealed && typeof gsap !== 'undefined') {
                    gsap.to(this.label, { opacity: 0, y: -4, duration: 0.18, ease: 'power2.in', overwrite: 'all' });
                }
                return;
            }

            if (targetIndex < 0 || targetIndex >= this.itemCount) return;
            const wi = this.wheelItems[targetIndex];
            if (!wi) return;
            const activeItem = wi.item;

            // 1. Position and display Active Arc Highlight
            if (this.activeArcSvg) {
                this.activeArcSvg.style.transform = `rotate(${wi.baseAngle}deg)`;
                this.activeArcSvg.style.opacity = '1';
            }

            // 2. Light up only the active sector's Light Beam
            this.wheelItems.forEach((obj, idx) => {
                if (idx === targetIndex) {
                    if (obj.beamBox) obj.beamBox.style.pointerEvents = 'auto';
                    if (obj.beamImg && typeof gsap !== 'undefined') {
                        gsap.to(obj.beamImg, { opacity: 1, duration: 0.2, ease: 'power2.out', overwrite: 'all' });
                    }
                } else {
                    if (obj.beamBox) obj.beamBox.style.pointerEvents = 'none';
                    if (obj.beamImg && typeof gsap !== 'undefined') {
                        gsap.to(obj.beamImg, { opacity: 0, duration: 0.18, ease: 'power2.out', overwrite: 'all' });
                    }
                }
            });

            // 3. Update dedicated label
            if (this.label) {
                this.label.textContent = activeItem.label;
                if (this.isRevealed && typeof gsap !== 'undefined') {
                    gsap.to(this.label, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', overwrite: 'all' });
                }
            }

            // 4. Update Fixed Top Label for Mobile
            if (this.fixedTopLabel && isMobile) {
                this.fixedTopLabel.textContent = activeItem.label;
                if (this.isRevealed && typeof gsap !== 'undefined') {
                    gsap.to(this.fixedTopLabel, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', overwrite: 'all' });
                } else if (typeof gsap !== 'undefined') {
                    gsap.set(this.fixedTopLabel, { opacity: 0, y: -6 });
                }
            }
        }

        reveal() {
            if (this.isRevealed) return;
            this.isRevealed = true;

            if (this.outerRing && typeof gsap !== 'undefined') {
                gsap.to(this.outerRing, { opacity: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
            }
            if (this.wheelWrapper) {
                this.wheelWrapper.style.pointerEvents = 'auto';
                if (typeof gsap !== 'undefined') {
                    gsap.to(this.wheelWrapper, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
                }
            }
            if (this.centerHubScaler && typeof gsap !== 'undefined') {
                const targetScale = this.isCompact ? 0.46 : 0.58;
                gsap.to(this.centerHubScaler, { scale: targetScale, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
            }
            if (this.label && this.activeHoverIdx >= 0) {
                const activeItem = this.items[this.activeHoverIdx];
                if (activeItem) this.label.textContent = activeItem.label;
                if (typeof gsap !== 'undefined') {
                    gsap.to(this.label, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
                }
            }
            if (this.fixedTopLabel && window.innerWidth < 1024 && this.activeApexIdx >= 0) {
                const activeItem = this.items[this.activeApexIdx];
                if (activeItem) this.fixedTopLabel.textContent = activeItem.label;
                if (typeof gsap !== 'undefined') {
                    gsap.to(this.fixedTopLabel, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
                }
            }
        }

        hide() {
            if (!this.isRevealed) return;
            this.isRevealed = false;
            this.activeHoverIdx = -1;
            this.setActiveItem(-1);

            if (this.outerRing && typeof gsap !== 'undefined') {
                gsap.to(this.outerRing, { opacity: 0, duration: 0.35, ease: 'power2.in', overwrite: 'auto' });
            }
            if (this.wheelWrapper) {
                this.wheelWrapper.style.pointerEvents = 'none';
                if (typeof gsap !== 'undefined') {
                    gsap.to(this.wheelWrapper, { opacity: 0, scale: 1.05, duration: 0.35, ease: 'power2.in', overwrite: 'auto' });
                }
            }
            if (this.centerHubScaler && typeof gsap !== 'undefined') {
                const idleScale = this.isMobileDock ? 1.25 : 1.0;
                gsap.to(this.centerHubScaler, { scale: idleScale, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
            }
            if (this.label && typeof gsap !== 'undefined') {
                gsap.to(this.label, {
                    opacity: 0, y: -6, duration: 0.2, ease: 'power2.in', overwrite: 'all', onComplete: () => {
                        if (!this.isRevealed) this.label.innerHTML = '&nbsp;';
                    }
                });
            }
            if (this.fixedTopLabel && window.innerWidth < 1024 && typeof gsap !== 'undefined') {
                gsap.to(this.fixedTopLabel, { opacity: 0, y: -8, duration: 0.2, ease: 'power2.in', overwrite: 'all' });
            }
        }

        getCenter() {
            const rect = this.stage.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
        }

        checkApexAlignment() {
            if (!this.isRevealed) return;

            let closestIdx = -1;
            let closestDist = Infinity;
            const sectorStep = 360 / this.itemCount;

            this.wheelItems.forEach((wi, idx) => {
                let diffAngle = (wi.baseAngle + (2 * this.currentAngle)) % 360;
                let normAngle = ((diffAngle + 540) % 360) - 180;
                let dist = Math.abs(normAngle);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestIdx = idx;
                }
            });

            const apexThreshold = this.isApexLocked ? (sectorStep / 2 + 0.5) : 17.5;

            if (closestDist <= apexThreshold && closestIdx >= 0) {
                if (this.activeApexIdx !== closestIdx) {
                    this.activeApexIdx = closestIdx;
                    this.setActiveItem(closestIdx);
                    if (typeof this.onSelect === 'function') {
                        this.onSelect(this.items[closestIdx], closestIdx);
                    }
                }
            } else if (!this.isApexLocked) {
                if (this.activeApexIdx !== -1) {
                    this.activeApexIdx = -1;
                    this.setActiveItem(-1);
                }
            }
        }

        init() {
            this.build();

            if (this.label && typeof gsap !== 'undefined') {
                gsap.set(this.label, { opacity: 0 });
                this.label.style.pointerEvents = 'auto';
                this.label.style.cursor = 'pointer';
                this.label.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const targetIdx = this.activeHoverIdx >= 0 ? this.activeHoverIdx : this.activeApexIdx;
                    if (targetIdx >= 0 && this.items[targetIdx] && this.items[targetIdx].url) {
                        window.open(this.items[targetIdx].url, '_blank', 'noopener,noreferrer');
                    }
                });
            }

            if (this.fixedTopLabel && typeof gsap !== 'undefined') {
                gsap.set(this.fixedTopLabel, { opacity: 0 });
                this.fixedTopLabel.style.pointerEvents = 'auto';
                this.fixedTopLabel.style.cursor = 'pointer';
                this.fixedTopLabel.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const targetIdx = this.activeHoverIdx >= 0 ? this.activeHoverIdx : this.activeApexIdx;
                    if (targetIdx >= 0 && this.items[targetIdx] && this.items[targetIdx].url) {
                        window.open(this.items[targetIdx].url, '_blank', 'noopener,noreferrer');
                    }
                });
            }

            if (this.centerHubScaler && this.isMobileDock && typeof gsap !== 'undefined') {
                gsap.set(this.centerHubScaler, { scale: 1.25 });
            }

            // Desktop Trigger Zone Listeners
            if (this.triggerArea) {
                this.triggerArea.addEventListener('mouseenter', () => {
                    if (window.innerWidth >= 1024) this.reveal();
                });
                this.triggerArea.addEventListener('mouseleave', () => {
                    if (window.innerWidth >= 1024) this.hide();
                });
            }

            // Desktop Mouse Tracking & Precise Dash Hit Testing
            window.addEventListener('mousemove', (e) => {
                if (window.innerWidth < 1024) return;
                const center = this.getCenter();
                const distX = center.x - e.clientX;
                const distY = center.y - e.clientY;
                const dist = Math.hypot(distX, distY);

                // Proximity Activation & Inertia Rotation
                if (dist < this.dimensions.hitDistance) {
                    if (!this.isRevealed) this.reveal();
                    const radians = Math.atan2(distX, distY);
                    let degrees = (radians * 180) / Math.PI;
                    let delta = degrees - this.lastInputAngle;
                    if (delta > 180) delta -= 360;
                    if (delta < -180) delta += 360;
                    this.targetAngle += delta * 1.0;
                    this.lastInputAngle = degrees;
                } else if (this.isRevealed && !this.isMobileDock) {
                    this.hide();
                }

                // Exact Dash Ring Hit-Testing on Desktop
                if (this.isRevealed) {
                    const ringMin = this.dimensions.radius - 28;
                    const ringMax = this.dimensions.radius + 40;
                    const isOverDashRing = (dist >= ringMin && dist <= ringMax);

                    if (isOverDashRing) {
                        const mouseAngleDeg = (Math.atan2(e.clientX - center.x, center.y - e.clientY) * 180 / Math.PI + 360) % 360;
                        let localAngle = (mouseAngleDeg - this.currentAngle) % 360;
                        if (localAngle < 0) localAngle += 360;

                        let hitIdx = -1;
                        this.wheelItems.forEach((wi, idx) => {
                            let diff = Math.abs(((localAngle - wi.baseAngle + 540) % 360) - 180);
                            if (diff <= 22) {
                                hitIdx = idx;
                            }
                        });

                        if (hitIdx >= 0) {
                            if (this.stage) this.stage.style.cursor = 'pointer';
                            if (this.hoverLeaveTimer) {
                                clearTimeout(this.hoverLeaveTimer);
                                this.hoverLeaveTimer = null;
                            }
                            if (this.activeHoverIdx !== hitIdx) {
                                this.activeHoverIdx = hitIdx;
                                this.setActiveItem(hitIdx);
                            }
                        } else {
                            if (this.stage) this.stage.style.cursor = 'default';
                            if (this.activeHoverIdx !== -1 && !this.hoverLeaveTimer) {
                                this.hoverLeaveTimer = setTimeout(() => {
                                    this.activeHoverIdx = -1;
                                    this.setActiveItem(-1);
                                    this.hoverLeaveTimer = null;
                                }, 80);
                            }
                        }
                    } else {
                        if (this.activeHoverIdx !== -1 && !this.hoverLeaveTimer) {
                            this.hoverLeaveTimer = setTimeout(() => {
                                this.activeHoverIdx = -1;
                                this.setActiveItem(-1);
                                this.hoverLeaveTimer = null;
                            }, 100);
                        }
                    }
                }
            });

            // Stage click sector navigation for desktop
            if (this.triggerArea) {
                this.triggerArea.addEventListener('click', (e) => {
                    if (window.innerWidth < 1024) return;
                    const center = this.getCenter();
                    const distX = center.x - e.clientX;
                    const distY = center.y - e.clientY;
                    const dist = Math.hypot(distX, distY);
                    const ringMin = this.dimensions.radius - 28;
                    const ringMax = this.dimensions.radius + 40;

                    if (dist >= ringMin && dist <= ringMax && this.activeHoverIdx >= 0 && this.wheelItems[this.activeHoverIdx]) {
                        e.stopPropagation();
                        const idx = this.activeHoverIdx;
                        const item = this.items[idx];
                        if (this.flashEffect && typeof gsap !== 'undefined') {
                            gsap.fromTo(this.flashEffect, { opacity: 1, scale: 0.8 }, { opacity: 0, scale: 1.3, duration: 0.4 });
                        }
                        this.setActiveItem(idx);
                        if (typeof this.onSelect === 'function') {
                            this.onSelect(item, idx);
                        }
                        if (item && item.url) {
                            window.open(item.url, '_blank', 'noopener,noreferrer');
                        }
                    }
                });
            }

            // Mobile Touch Drag Interaction
            if (this.triggerArea) {
                this.triggerArea.addEventListener('touchstart', (e) => {
                    if (e.touches.length === 1) {
                        if (!this.isRevealed) {
                            this.reveal();
                        }
                        const touch = e.touches[0];
                        const center = this.getCenter();
                        const dx = touch.clientX - center.x;
                        const dy = touch.clientY - center.y;
                        this.isTouching = true;
                        this.lastInputAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
                    }
                }, { passive: true });

                window.addEventListener('touchmove', (e) => {
                    if (!this.isTouching || e.touches.length !== 1) return;
                    const touch = e.touches[0];
                    const center = this.getCenter();
                    const dx = touch.clientX - center.x;
                    const dy = touch.clientY - center.y;

                    if (e.cancelable) e.preventDefault();
                    let currentTouchAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
                    let delta = currentTouchAngle - this.lastInputAngle;
                    if (delta > 180) delta -= 360;
                    if (delta < -180) delta += 360;

                    this.targetAngle += delta;
                    this.currentAngle = this.targetAngle;

                    this.wheel.style.transform = `rotate(${this.currentAngle}deg)`;
                    if (this.outerRing) {
                        this.outerRing.style.transform = `translate(-50%, -50%) rotate(${-this.currentAngle}deg)`;
                    }

                    this.lastInputAngle = currentTouchAngle;
                    this.checkApexAlignment();
                }, { passive: false });

                window.addEventListener('touchend', () => {
                    if (this.isTouching) {
                        this.isTouching = false;
                        if (this.activeApexIdx >= 0 && this.wheelItems[this.activeApexIdx]) {
                            this.isApexLocked = true;
                            const snapTarget = -this.wheelItems[this.activeApexIdx].baseAngle;
                            const turns = Math.round((this.targetAngle - snapTarget) / 360);
                            this.targetAngle = snapTarget + 360 * turns;
                        }
                    }
                }, { passive: true });
            }

            // Center Hub Button Click/Tap Toggle
            if (this.centerHub) {
                this.centerHub.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (this.flashEffect && typeof gsap !== 'undefined') {
                        gsap.fromTo(this.flashEffect, { opacity: 1, scale: 0.8 }, { opacity: 0, scale: 1.3, duration: 0.4 });
                    }
                    if (!this.isRevealed) this.reveal();
                    else this.hide();
                });
            }

            // Animation Ticker Render Loop (GSAP Ticker or requestAnimationFrame fallback)
            const tick = () => {
                if (window.innerWidth >= 1024) {
                    this.currentAngle += (this.targetAngle - this.currentAngle) * this.lerpFactor;
                    this.wheel.style.transform = `rotate(${this.currentAngle}deg)`;
                } else {
                    if (!this.isTouching && this.isRevealed) {
                        this.currentAngle += (this.targetAngle - this.currentAngle) * this.lerpFactor;
                        this.wheel.style.transform = `rotate(${this.currentAngle}deg)`;
                        if (this.outerRing) {
                            this.outerRing.style.transform = `translate(-50%, -50%) rotate(${-this.currentAngle}deg)`;
                        }
                        this.checkApexAlignment();
                    }
                }
            };

            if (typeof gsap !== 'undefined' && gsap.ticker) {
                gsap.ticker.add(tick);
            } else {
                const loop = () => {
                    tick();
                    requestAnimationFrame(loop);
                };
                requestAnimationFrame(loop);
            }

            // Resize Handler
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => this.build(), 150);
            });
        }
    }

    return HeaderCircleMenuEngine;
});
