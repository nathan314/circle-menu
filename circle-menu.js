/**
 * =========================================================================
 * CIRCULAR MENU UI ENGINE v.4.5
 * Interactive Radial Navigation Engine with Physics Inertia & Tangent Light Beams
 * Designed & Engineered by Natã da Silva Targina (NStar Concepts)
 * License: MIT
 * =========================================================================
 */

(function (global, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(global);
    } else {
        global.CircularMenuEngine = factory(global);
    }
})(typeof window !== 'undefined' ? window : this, function (window) {
    'use strict';

    class CircularMenuEngine {
        static instances = [];

        static register(instance) {
            if (!CircularMenuEngine.instances.includes(instance)) {
                CircularMenuEngine.instances.push(instance);
            }
        }

        static hideOtherInstances(currentInstance) {
            CircularMenuEngine.instances.forEach((inst) => {
                if (inst !== currentInstance && inst.isRevealed) {
                    inst.hide();
                }
            });
        }

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

            this.isHero = !!options.isHero;
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
            this.activeApexIdx = -1; // Starts clean with NO pre-selection
            this.isApexLocked = false;
            this.hoverLeaveTimer = null;
            this.lerpFactor = options.lerpFactor || 0.22;

            CircularMenuEngine.register(this);

            if (this.stage && this.wheel) {
                this.init();
            }
        }

        // =========================================================================
        // ⚙️ CUSTOMIZABLE GEOMETRY, LIGHT BEAMS & HIT-TESTING PARAMETERS
        // =========================================================================
        getDimensions() {
            const w = window.innerWidth;
            const isDesktop = w >= 1024;
            const stageRect = this.stage.getBoundingClientRect();
            const stageW = stageRect.width || (this.isCompact ? 176 : (this.isMobileDock ? 176 : (w >= 1536 ? 737 : (w >= 1024 ? 600 : (w >= 640 ? 480 : 340)))));

            if (this.isCompact) {
                return {
                    stageW,
                    radius: this.options.radius || 52,
                    beamRadialOffset: this.options.beamRadialOffset !== undefined ? this.options.beamRadialOffset : 2,
                    dashWidth: this.options.dashWidth || 36,
                    beamSVGWidth: this.options.beamSVGWidth || 96, // Wider base to match the full curved dash length
                    beamHeight: this.options.beamHeight || 90,     // Increased reach and projection length
                    hitDistance: this.options.hitDistance || 130
                };
            }

            if (this.isMobileDock) {
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

            // Main Hero Dial
            const radiusRatio = isDesktop ? (359.07 / 737) : (174.99 / 360);
            const radius = Math.round(stageW * radiusRatio);

            let beamRadialOffset = 3;
            let beamHeight = 620;
            let hitDistance = 580; // ~60-80% hero interaction zone

            if (w >= 1536) {
                beamRadialOffset = 4;
                beamHeight = 620;
                hitDistance = 580;
            } else if (w >= 1024) {
                beamRadialOffset = 3;
                beamHeight = Math.min(Math.round(stageW * 0.95), 560);
                hitDistance = Math.min(Math.round(stageW * 0.85), 520);
            } else if (w >= 640) {
                beamRadialOffset = 4;
                beamHeight = 380;
                hitDistance = 420;
            } else {
                beamRadialOffset = 3;
                beamHeight = 270;
                hitDistance = 300;
            }

            const dashRatio = isDesktop ? (208.41 / 737) : (132.47 / 360);
            const dashWidth = Math.round(stageW * dashRatio);
            const beamSVGWidth = Math.round(dashWidth * 3.86856);

            return {
                stageW,
                radius,
                beamRadialOffset,
                dashWidth,
                beamSVGWidth,
                beamHeight,
                hitDistance
            };
        }

        build() {
            const dims = this.getDimensions();
            const { radius, beamSVGWidth, beamHeight, beamRadialOffset } = dims;
            this.dimensions = dims;

            this.wheel.innerHTML = '';
            this.wheelItems.length = 0;

            const isDesktop = window.innerWidth >= 1024;
            const baseCircleSymbol = (isDesktop && !this.isCompact && !this.isMobileDock) ? '#circle-items-desktop' : '#circle-items-mobile';
            const activeArcSymbol = (isDesktop && !this.isCompact && !this.isMobileDock) ? '#circle-item-desktop' : '#circle-item-mobile';
            const viewBox = (isDesktop && !this.isCompact && !this.isMobileDock) ? '0 0 737 737' : '0 0 360 360';

            // 1. Single Unified Base Wheel Ring (All 7 dashes rendered in 1 single SVG vector)
            this.baseWheelSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            this.baseWheelSvg.setAttribute('viewBox', viewBox);
            this.baseWheelSvg.setAttribute('class', (this.isCompact || this.isMobileDock)
                ? 'base-wheel-svg w-full h-full absolute inset-0 pointer-events-none text-blue-emphasis drop-shadow-[0_0_8px_rgba(0,162,255,0.8)]'
                : 'base-wheel-svg w-full h-full absolute inset-0 pointer-events-none text-blue-emphasis drop-shadow-[0_0_12px_rgba(0,162,255,0.8)]');

            const baseWheelUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            baseWheelUse.setAttribute('href', baseCircleSymbol);
            this.baseWheelSvg.appendChild(baseWheelUse);
            this.wheel.appendChild(this.baseWheelSvg);

            // 2. Single Active Arc Highlight (Rotates smoothly to active sector angle)
            this.activeArcSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            this.activeArcSvg.setAttribute('viewBox', viewBox);
            const activeArcClass = (this.isCompact || this.isMobileDock)
                ? 'active-arc-svg w-full h-full absolute inset-0 pointer-events-none opacity-0 text-ns-orange drop-shadow-[0_0_12px_rgba(255,162,31,0.95)] will-change-transform'
                : 'active-arc-svg w-full h-full absolute inset-0 pointer-events-none opacity-0 text-yellow-emphasis drop-shadow-[0_0_25px_rgba(255,234,71,1)] will-change-transform';

            this.activeArcSvg.setAttribute('class', activeArcClass);

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

            // Start clean with no pre-selected item
            this.setActiveItem(-1);
        }

        setActiveItem(targetIndex) {
            const isMobile = window.innerWidth < 1024;
            const hasGsap = typeof gsap !== 'undefined';

            if (targetIndex === -1) {
                if (this.activeArcSvg) {
                    if (this.isCompact || this.isMobileDock) {
                        this.activeArcSvg.style.opacity = '0';
                    } else if (hasGsap) {
                        gsap.to(this.activeArcSvg, { opacity: 0, duration: 0.18, overwrite: 'all' });
                    } else {
                        this.activeArcSvg.style.opacity = '0';
                    }
                }
                this.wheelItems.forEach((obj) => {
                    if (obj.beamImg) {
                        if (hasGsap) gsap.to(obj.beamImg, { opacity: 0, duration: 0.18, ease: 'power2.out', overwrite: 'all' });
                        else obj.beamImg.style.opacity = '0';
                    }
                    if (obj.beamBox) obj.beamBox.style.pointerEvents = 'none';
                });
                if (this.label && this.isRevealed) {
                    if (hasGsap) gsap.to(this.label, { opacity: 0, y: isMobile ? -4 : -8, duration: 0.18, ease: 'power2.in', overwrite: 'all' });
                    else this.label.style.opacity = '0';
                }
                return;
            }

            if (targetIndex < 0 || targetIndex >= this.itemCount) return;
            const wi = this.wheelItems[targetIndex];
            if (!wi) return;
            const activeItem = wi.item;

            // 1. Position and display the Single Active Arc Highlight SVG exactly over active sector
            if (this.activeArcSvg) {
                this.activeArcSvg.style.transform = `rotate(${wi.baseAngle}deg)`;
                if (this.isCompact || this.isMobileDock) {
                    this.activeArcSvg.style.opacity = '1';
                } else if (hasGsap) {
                    gsap.to(this.activeArcSvg, { opacity: 1, duration: 0.2, overwrite: 'all' });
                } else {
                    this.activeArcSvg.style.opacity = '1';
                }
            }

            // 2. Light up only the active sector's Light Beam & enable pointer hit
            this.wheelItems.forEach((obj, idx) => {
                if (idx === targetIndex) {
                    if (obj.beamBox) {
                        obj.beamBox.style.pointerEvents = 'auto';
                        obj.beamBox.style.cursor = 'pointer';
                    }
                    if (obj.beamImg) {
                        if (hasGsap) gsap.to(obj.beamImg, { opacity: 1, duration: 0.2, ease: 'power2.out', overwrite: 'all' });
                        else obj.beamImg.style.opacity = '1';
                    }
                } else {
                    if (obj.beamBox) {
                        obj.beamBox.style.pointerEvents = 'none';
                    }
                    if (obj.beamImg) {
                        if (hasGsap) gsap.to(obj.beamImg, { opacity: 0, duration: 0.18, ease: 'power2.out', overwrite: 'all' });
                        else obj.beamImg.style.opacity = '0';
                    }
                }
            });

            // 3. Update dedicated label
            if (this.label) {
                this.label.textContent = activeItem.label;
                if (this.isRevealed) {
                    if (hasGsap) gsap.fromTo(this.label, { y: isMobile ? 4 : 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22, ease: 'power2.out', overwrite: 'all' });
                    else this.label.style.opacity = '1';
                } else {
                    if (hasGsap) gsap.set(this.label, { opacity: 0 });
                    else this.label.style.opacity = '0';
                }
            }

            // 4. Update Fixed Top Label for Mobile
            if (this.fixedTopLabel && isMobile) {
                this.fixedTopLabel.textContent = activeItem.label;
                if (this.isRevealed) {
                    if (hasGsap) gsap.to(this.fixedTopLabel, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', overwrite: 'all' });
                    else this.fixedTopLabel.style.opacity = '1';
                } else {
                    if (hasGsap) gsap.set(this.fixedTopLabel, { opacity: 0, y: -6 });
                    else this.fixedTopLabel.style.opacity = '0';
                }
            }

            // 5. Notify external listener (Live Interaction & Output Preview Card)
            if (typeof this.onSelect === 'function') {
                this.onSelect(activeItem, targetIndex);
            }
        }

        reveal() {
            if (this.isRevealed) return;
            CircularMenuEngine.hideOtherInstances(this);
            this.isRevealed = true;
            const hasGsap = typeof gsap !== 'undefined';

            if (this.outerRing) {
                if (hasGsap) gsap.to(this.outerRing, { opacity: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
                else this.outerRing.style.opacity = '1';
            }
            if (this.wheelWrapper) {
                this.wheelWrapper.style.pointerEvents = 'auto';
                if (hasGsap) gsap.to(this.wheelWrapper, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
                else {
                    this.wheelWrapper.style.opacity = '1';
                    this.wheelWrapper.style.transform = 'scale(1)';
                }
            }
            if (this.centerHubScaler) {
                const targetScale = this.isHero ? 0.82 : (this.isCompact ? 0.46 : 0.58);
                if (hasGsap) gsap.to(this.centerHubScaler, { scale: targetScale, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
                else this.centerHubScaler.style.transform = `scale(${targetScale})`;
            }
            if (this.label && this.activeHoverIdx >= 0) {
                const activeItem = this.items[this.activeHoverIdx];
                if (activeItem) this.label.textContent = activeItem.label;
                if (hasGsap) gsap.to(this.label, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
                else this.label.style.opacity = '1';
            }
            if (this.fixedTopLabel && window.innerWidth < 1024 && this.activeApexIdx >= 0) {
                const activeItem = this.items[this.activeApexIdx];
                if (activeItem) this.fixedTopLabel.textContent = activeItem.label;
                if (hasGsap) gsap.to(this.fixedTopLabel, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
                else this.fixedTopLabel.style.opacity = '1';
            }
        }

        hide() {
            if (!this.isRevealed) return;
            this.isRevealed = false;
            this.activeHoverIdx = -1;
            this.setActiveItem(-1);
            const hasGsap = typeof gsap !== 'undefined';

            if (this.outerRing) {
                if (hasGsap) gsap.to(this.outerRing, { opacity: 0, duration: 0.35, ease: 'power2.in', overwrite: 'auto' });
                else this.outerRing.style.opacity = '0';
            }
            if (this.wheelWrapper) {
                this.wheelWrapper.style.pointerEvents = 'none';
                if (hasGsap) gsap.to(this.wheelWrapper, { opacity: 0, scale: 1.05, duration: 0.35, ease: 'power2.in', overwrite: 'auto' });
                else {
                    this.wheelWrapper.style.opacity = '0';
                    this.wheelWrapper.style.transform = 'scale(1.05)';
                }
            }
            if (this.centerHubScaler) {
                const idleScale = this.isMobileDock ? 1.25 : 1.0;
                if (hasGsap) gsap.to(this.centerHubScaler, { scale: idleScale, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
                else this.centerHubScaler.style.transform = `scale(${idleScale})`;
            }
            if (this.label) {
                if (hasGsap) {
                    gsap.to(this.label, {
                        opacity: 0, y: -6, duration: 0.2, ease: 'power2.in', overwrite: 'all', onComplete: () => {
                            if (!this.isRevealed) this.label.innerHTML = '&nbsp;';
                        }
                    });
                } else {
                    this.label.style.opacity = '0';
                }
            }
            if (this.fixedTopLabel && window.innerWidth < 1024) {
                if (hasGsap) gsap.to(this.fixedTopLabel, { opacity: 0, y: -8, duration: 0.2, ease: 'power2.in', overwrite: 'all' });
                else this.fixedTopLabel.style.opacity = '0';
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

            if (this.label) {
                if (typeof gsap !== 'undefined') gsap.set(this.label, { opacity: 0 });
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
            if (this.fixedTopLabel) {
                if (typeof gsap !== 'undefined') gsap.set(this.fixedTopLabel, { opacity: 0 });
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
                    if (window.innerWidth >= 1024) {
                        if (this.isHero) {
                            const anotherRevealed = CircularMenuEngine.instances.some(inst => inst !== this && inst.isRevealed);
                            if (anotherRevealed) return;
                        }
                        this.reveal();
                    }
                });
                this.triggerArea.addEventListener('mouseleave', () => {
                    if (window.innerWidth >= 1024) this.hide();
                });
            }

            // Desktop Mouse Tracking & Precise Hit Testing (Dashes + Light Beams)
            window.addEventListener('mousemove', (e) => {
                if (window.innerWidth < 1024) return;

                const target = e.target;
                const isOverHeader = !!(target && target.closest && target.closest('header, #header-capsule, #header-dial-container'));

                // 1. ISOLATION RULE: If Hero menu is tracking, but mouse is over header or another instance is active
                if (this.isHero) {
                    const headerEl = document.querySelector('header') || document.getElementById('header-capsule');
                    const headerBottom = headerEl ? headerEl.getBoundingClientRect().bottom + 12 : 85;

                    const anotherRevealed = CircularMenuEngine.instances.some(inst => inst !== this && inst.isRevealed);
                    if (isOverHeader || e.clientY <= headerBottom || anotherRevealed) {
                        if (this.isRevealed) this.hide();
                        return;
                    }

                    // Check if mouse is physically inside the hero interaction zone bounding box
                    const triggerRect = this.triggerArea ? this.triggerArea.getBoundingClientRect() : null;
                    if (triggerRect) {
                        const inHeroBounds = (
                            e.clientX >= (triggerRect.left - 40) &&
                            e.clientX <= (triggerRect.right + 40) &&
                            e.clientY >= (triggerRect.top - 20) &&
                            e.clientY <= (triggerRect.bottom + 40)
                        );
                        if (!inHeroBounds) {
                            if (this.isRevealed) this.hide();
                            return;
                        }
                    }
                }

                // 2. ISOLATION RULE FOR COMPACT HEADER:
                if (this.isCompact) {
                    const center = this.getCenter();
                    const dist = Math.hypot(center.x - e.clientX, center.y - e.clientY);
                    if (dist > this.dimensions.hitDistance) {
                        if (this.isRevealed) this.hide();
                        return;
                    }
                }

                const center = this.getCenter();
                const distX = center.x - e.clientX;
                const distY = center.y - e.clientY;
                const dist = Math.hypot(distX, distY);

                // 1. Proximity Activation & Inertia Rotation
                if (dist < this.dimensions.hitDistance) {
                    if (!this.isRevealed) this.reveal();
                    const radians = Math.atan2(distX, distY);
                    let degrees = (radians * 180) / Math.PI;
                    let delta = degrees - this.lastInputAngle;
                    if (delta > 180) delta -= 360;
                    if (delta < -180) delta += 360;
                    this.targetAngle += delta * (this.isCompact ? 1.0 : 1.35);
                    this.lastInputAngle = degrees;
                } else if (this.isRevealed && !this.isMobileDock) {
                    this.hide();
                }

                // 2. Exact Dash Ring & Light Beam Projection Hit-Testing on Desktop
                if (this.isRevealed) {
                    const ringMin = this.dimensions.radius - (this.isCompact ? 28 : 40);
                    const beamMax = this.dimensions.radius + (this.isCompact ? 50 : this.dimensions.beamHeight + 30);
                    const isOverInteractiveSector = (dist >= ringMin && dist <= beamMax);

                    if (isOverInteractiveSector) {
                        const mouseAngleDeg = (Math.atan2(e.clientX - center.x, center.y - e.clientY) * 180 / Math.PI + 360) % 360;
                        let localAngle = (mouseAngleDeg - this.currentAngle) % 360;
                        if (localAngle < 0) localAngle += 360;

                        let hitIdx = -1;
                        this.wheelItems.forEach((wi, idx) => {
                            let diff = Math.abs(((localAngle - wi.baseAngle + 540) % 360) - 180);
                            if (diff <= (this.isCompact ? 22 : 22)) {
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

            // Stage & Light Beam click navigation for desktop
            if (this.triggerArea) {
                this.triggerArea.addEventListener('click', (e) => {
                    if (window.innerWidth < 1024) return;
                    const center = this.getCenter();
                    const distX = center.x - e.clientX;
                    const distY = center.y - e.clientY;
                    const dist = Math.hypot(distX, distY);
                    const ringMin = this.dimensions.radius - (this.isCompact ? 28 : 40);
                    const beamMax = this.dimensions.radius + (this.isCompact ? 50 : this.dimensions.beamHeight + 30);

                    if (dist >= ringMin && dist <= beamMax && this.activeHoverIdx >= 0 && this.wheelItems[this.activeHoverIdx]) {
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

            // GSAP Animation Ticker Render Loop
            if (typeof gsap !== 'undefined') {
                gsap.ticker.add(() => {
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
                });
            }

            // Resize Handler
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => this.build(), 150);
            });
        }
    }

    return CircularMenuEngine;
});
