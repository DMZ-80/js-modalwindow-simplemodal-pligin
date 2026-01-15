import './style.scss';



/**
 * SimpleModal クラス
 */
class SimpleModal {
  /**
   * コンストラクタ
   * @param {string} overlaySelector - モーダルのオーバーレイ要素のセレクタ
   * @param {object} options - ユーザー定義の設定
   */
  constructor(overlaySelector, options = {}) {
    this.overlay = document.querySelector(overlaySelector);
    if (!this.overlay) return;
    
    // 主要なDOM要素の取得
    this.background = this.overlay.querySelector('.simpleModal-background');
    this.wrapper = this.overlay.querySelector('.simpleModal-wrapper');
    this.content = this.overlay.querySelector('.simpleModal-content');
    this.body = this.overlay.querySelector('.simpleModal-body');
    this.modalImage = document.getElementById('modalImage');
    this.imageContainer = document.getElementById('imageContainer');
    this.inlineContainer = document.getElementById('inlineContainer');
    this.spinner = document.getElementById('modalSpinner');
    this.floatingClose = document.querySelector('.simpleModal-floating-close');
    this.prevBtn = document.querySelector('.simpleModal-prev-btn');
    this.nextBtn = document.querySelector('.simpleModal-next-btn');
    this.floatingPagination = document.querySelector('.simpleModal-floating-pagination');
    this.inlinePagination = document.querySelector('.simpleModal-inline-pagination');
    
    this.isAnimating = false; // アニメーション実行中フラグ
    this.groupList = [];      // ギャラリー表示用の要素リスト
    this.currentIndex = -1;   // 現在表示中のグループ内インデックス
    this.currentMode = '';    // 'inline' または 'image'
    this.lastWrapperSize = { w: 0, h: 0 }; // リサイズアニメーション用の前回サイズ

    this.touchStartX = 0;
    this.touchMinDistance = 50;

    // デフォルトの設定
    const defaults = {
      swipe: true, // スワイプ設定
      animation: { // アニメーション設定をオブジェクトに集約
        background: {
          open: { 
            opacity: { opacity: [0, 1], duration: 0.6, delay: 0, ease: 'ease-out' },
            translateX: { translateX: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            translateY: { translateY: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            translateZ: { translateZ: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateX: { rotateX: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateY: { rotateY: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateZ: { rotateZ: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            scale: { scale: [1, 1], duration: 0, delay: 0, ease: 'ease-out' }
          },
          close: { 
            opacity: { opacity: [1, 0], duration: 0.6, delay: 0.4, ease: 'ease-out' },
            translateX: { translateX: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            translateY: { translateY: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            translateZ: { translateZ: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateX: { rotateX: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateY: { rotateY: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateZ: { rotateZ: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            scale: { scale: [1, 1], duration: 0, delay: 0, ease: 'ease-out' }
          }
        },
        wrapper: {
          open: { 
            opacity: { opacity: [0, 1], duration: 0.6, delay: 0.4, ease: 'ease-out' },
            scale: { scale: [1, 1], duration: 0, delay: 0, ease: 'ease-out' },
            translateX: { translateX: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            translateY: { translateY: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            translateZ: { translateZ: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateX: { rotateX: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateY: { rotateY: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateZ: { rotateZ: [0, 0], duration: 0, delay: 0, ease: 'ease-out' }
          },
          close: { 
            opacity: { opacity: [1, 0], duration: 0.6, delay: 0.4, ease: 'ease-out' },
            scale: { scale: [1, 1], duration: 0, delay: 0, ease: 'ease-out' },
            translateX: { translateX: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            translateY: { translateY: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            translateZ: { translateZ: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateX: { rotateX: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateY: { rotateY: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateZ: { rotateZ: [0, 0], duration: 0, delay: 0, ease: 'ease-out' }
          }
        },
        content: {
          open: { 
            opacity: { opacity: [0, 1], duration: 0.6, delay: 0.4, ease: 'ease-out' },
            scale: { scale: [1, 1], duration: 0, delay: 0, ease: 'ease-out' },
            rotateX: { rotateX: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateY: { rotateY: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateZ: { rotateZ: [0, 0], duration: 0, delay: 0, ease: 'ease-out' }
          },
          close: { 
            opacity: { opacity: [1, 0], duration: 0.6, delay: 0, ease: 'ease-out' },
            scale: { scale: [1, 1], duration: 0, delay: 0, ease: 'ease-out' },
            rotateX: { rotateX: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateY: { rotateY: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateZ: { rotateZ: [0, 0], duration: 0, delay: 0, ease: 'ease-out' }
          }
        },
        button: {
          open: { 
            opacity: { opacity: [0, 1], duration: 0.6, delay: 0, ease: 'ease-out' },
            scale: { scale: [1, 1], duration: 0, delay: 0, ease: 'ease-out' },
            rotateX: { rotateX: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateY: { rotateY: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateZ: { rotateZ: [0, 0], duration: 0, delay: 0, ease: 'ease-out' }
          },
          close: { 
            opacity: { opacity: [1, 0], duration: 0.6, delay: 0, ease: 'ease-out' },
            scale: { scale: [1, 1], duration: 0, delay: 0, ease: 'ease-out' },
            rotateX: { rotateX: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateY: { rotateY: [0, 0], duration: 0, delay: 0, ease: 'ease-out' },
            rotateZ: { rotateZ: [0, 0], duration: 0, delay: 0, ease: 'ease-out' }
          }
        }
      }
    };

    const mergeSettings = (def, opt) => {
      const result = {};
      for (const phase in def) {
        result[phase] = {};
        for (const prop in def[phase]) {
          result[phase][prop] = { ...def[phase][prop], ...(opt?.[phase]?.[prop] || {}) };
        }
      }
      return result;
    };

    this.config = {
      swipe: options.swipe !== undefined ? options.swipe : defaults.swipe,
      animation: {
        background: mergeSettings(defaults.animation.background, options.animation?.background || {}),
        wrapper: mergeSettings(defaults.animation.wrapper, options.animation?.wrapper || {}),
        content: mergeSettings(defaults.animation.content, options.animation?.content || {}),
        button: mergeSettings(defaults.animation.button, options.animation?.button || {})
      }
    };

    this.swipeEnabled = this.config.swipe;
    this.initEvents();
  }

  /**
   * イベントリスナーの初期化
   */
  initEvents() {
    const closeElements = ['.simpleModal-close-btn-icon', '.simpleModal-close-btn', '.simpleModal-floating-close'];
    closeElements.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.addEventListener('click', () => this.close()));
    });

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay || e.target === this.background) this.close();
    });

    this.wrapper.addEventListener('click', (e) => { if (e.target === this.wrapper) this.close(); });

    document.addEventListener('keydown', (e) => {
      if (this.overlay.classList.contains('simpleModal-hidden')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    this.prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.prev(); });
    this.nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.next(); });

    // スワイプ操作用
    this.overlay.addEventListener('touchstart', (e) => {
      if (!this.swipeEnabled || this.currentMode !== 'image') return;
      this.touchStartX = e.touches[0].clientX;
    }, { passive: true });

    this.overlay.addEventListener('touchend', (e) => {
      if (!this.swipeEnabled || this.currentMode !== 'image' || this.isAnimating) return;
      const touchEndX = e.changedTouches[0].clientX;
      const diff = this.touchStartX - touchEndX;

      if (Math.abs(diff) > this.touchMinDistance) {
        if (diff > 0) this.next();
        else this.prev();
      }
    }, { passive: true });

    this.modalImage.onload = () => {
      if (this.spinner) this.spinner.classList.add('simpleModal-hidden');

      if (this.modalImage.naturalWidth && this.modalImage.naturalHeight) {
        const ratio = `${this.modalImage.naturalWidth} / ${this.modalImage.naturalHeight}`;
        this.modalImage.style.aspectRatio = ratio;
      }

      if (this.currentMode === 'image' && this.isAnimating) {
        if (this.wrapper.style.opacity === '1' || parseFloat(this.wrapper.style.opacity) > 0) {
          // 切り替え時はリサイズアニメの後にフェードイン。全体の開きアニメは走らせない。
          this.animateResize(this.wrapper).then(() => this.showContent(true, false));
        } else {
          // 初回表示時
          this.showWrapper();
        }
      }
    };
  }

  async animateResize(targetEl) {
    if (!this.lastWrapperSize.w || !this.lastWrapperSize.h) return Promise.resolve();
    const startWidth = this.lastWrapperSize.w;
    const startHeight = this.lastWrapperSize.h;
    
    targetEl.style.width = 'auto'; targetEl.style.height = 'auto';
    const targetWidth = targetEl.offsetWidth;
    const targetHeight = targetEl.offsetHeight;

    const animation = targetEl.animate([
      { width: `${startWidth}px`, height: `${startHeight}px` },
      { width: `${targetWidth}px`, height: `${targetHeight}px` }
    ], { duration: 350, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both' });

    return animation.finished.then(() => {
      targetEl.style.width = 'auto'; targetEl.style.height = 'auto';
      animation.cancel();
    });
  }

  applyInitialState(el, configKey, phase) {
    const phaseConfig = this.config.animation[configKey]?.[phase];
    if (!el || !phaseConfig) return;

    const toUnit = (v) => (typeof v === 'number' ? `${v}px` : v);
    const state = { opacity: '', scale: '', t: { x: '0px', y: '0px', z: '0px' }, r: { x: 0, y: 0, z: 0 } };

    Object.entries(phaseConfig).forEach(([propKey, settings]) => {
      const valArray = settings[propKey];
      if (!Array.isArray(valArray)) return;
      const v = valArray[0];
      if (propKey === 'opacity') state.opacity = v;
      else if (propKey === 'scale') state.scale = v;
      else if (propKey === 'translateX') state.t.x = toUnit(v);
      else if (propKey === 'translateY') state.t.y = toUnit(v);
      else if (propKey === 'translateZ') state.t.z = toUnit(v);
      else if (propKey === 'rotateX') state.r.x = v;
      else if (propKey === 'rotateY') state.r.y = v;
      else if (propKey === 'rotateZ') state.r.z = v;
    });

    if (state.opacity !== '') el.style.opacity = state.opacity;
    if (state.scale !== '') el.style.scale = state.scale;
    el.style.translate = `${state.t.x} ${state.t.y} ${state.t.z}`;
    el.style.transform = `rotateX(${state.r.x}deg) rotateY(${state.r.y}deg) rotateZ(${state.r.z}deg)`;
    void el.offsetWidth;
  }

  async runAnimation(el, configKey, phase) {
    const phaseConfig = this.config.animation[configKey]?.[phase];
    if (!el || !phaseConfig || Object.keys(phaseConfig).length === 0) return Promise.resolve();

    this.applyInitialState(el, configKey, phase);

    const groups = {};
    Object.entries(phaseConfig).forEach(([key, settings]) => {
      let base = key;
      if (key.startsWith('translate')) base = 'translate';
      if (key.startsWith('rotate')) base = 'rotate';
      if (!groups[base]) groups[base] = [];
      groups[base].push({ key, settings });
    });

    const animationPromises = Object.entries(groups).map(([base, entries]) => {
      const keyframes = [{}, {}];
      const toUnit = (v) => (typeof v === 'number' ? `${v}px` : v);
      let maxDuration = 0, maxDelay = 0, bestEase = 'ease';

      entries.forEach(e => {
        const s = e.settings;
        maxDuration = Math.max(maxDuration, (s.duration || 0) * 1000);
        maxDelay = Math.max(maxDelay, (s.delay || 0) * 1000);
        if (s.ease) bestEase = s.ease;
      });

      if (base === 'opacity') {
        keyframes[0].opacity = entries[0].settings.opacity[0];
        keyframes[1].opacity = entries[0].settings.opacity[1];
      } else if (base === 'scale') {
        keyframes[0].scale = `${entries[0].settings.scale[0]}`;
        keyframes[1].scale = `${entries[0].settings.scale[1]}`;
      } else if (base === 'translate') {
        const getV = (axis, step) => {
          const found = entries.find(e => e.key === `translate${axis.toUpperCase()}`);
          return found ? toUnit(found.settings[found.key][step]) : '0px';
        };
        keyframes[0].translate = `${getV('x', 0)} ${getV('y', 0)} ${getV('z', 0)}`;
        keyframes[1].translate = `${getV('x', 1)} ${getV('y', 1)} ${getV('z', 1)}`;
      } else if (base === 'rotate') {
        const getR = (axis, step) => {
          const found = entries.find(e => e.key === `rotate${axis.toUpperCase()}`);
          return found ? found.settings[found.key][step] : 0;
        };
        keyframes[0].transform = `perspective(800px) rotateX(${getR('x', 0)}deg) rotateY(${getR('y', 0)}deg) rotateZ(${getR('z', 0)}deg)`;
        keyframes[1].transform = `perspective(800px) rotateX(${getR('x', 1)}deg) rotateY(${getR('y', 1)}deg) rotateZ(${getR('z', 1)}deg)`;
      }

      const animation = el.animate(keyframes, { duration: maxDuration, delay: maxDelay, easing: bestEase, fill: 'both' });
      return animation.finished.then(() => {
        if (keyframes[1].opacity !== undefined) el.style.opacity = keyframes[1].opacity;
        if (keyframes[1].scale !== undefined) el.style.scale = keyframes[1].scale;
        if (keyframes[1].translate !== undefined) el.style.translate = keyframes[1].translate;
        if (keyframes[1].transform !== undefined) el.style.transform = keyframes[1].transform;
        animation.cancel();
      });
    });

    return Promise.all(animationPromises);
  }

  /**
   * トリガー要素の属性に基づいてモーダルを開く
   * @param {HTMLElement} el - トリガーとなった要素
   */
  openTrigger(el) {
    if (el.tagName === 'A' && el.classList.contains('simpleModal-trigger')) {
      const href = el.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        // アンカーリンク（ID指定）の場合はインラインモードで開く
        const targetId = href.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          this.open('inline', { title: el.textContent, content: targetEl.innerHTML });
        }
      } else {
        // それ以外（画像URLなど）は画像モードで開く
        this.open('image', { src: href });
      }
    } else if (el.dataset.target) {
      // data-target属性がある場合はインラインモードで開く
      const targetEl = document.getElementById(el.dataset.target);
      if (targetEl) {
        this.open('inline', { title: el.textContent, content: targetEl.innerHTML });
      }
    }
  }

  async open(mode, options = {}) {
    if (this.isAnimating) return;
    this.isAnimating = true; 
    this.currentMode = mode;
    this.wrapper.style.aspectRatio = '';
    
    [this.background, this.wrapper, this.content, this.floatingClose, this.prevBtn, this.nextBtn].forEach(el => {
      el.getAnimations().forEach(anim => anim.cancel());
    });

    this.applyInitialState(this.background, 'background', 'open');
    this.applyInitialState(this.wrapper, 'wrapper', 'open');
    this.applyInitialState(this.content, 'content', 'open');
    this.applyInitialState(this.floatingClose, 'button', 'open');
    this.applyInitialState(this.prevBtn, 'button', 'open');
    this.applyInitialState(this.nextBtn, 'button', 'open');

    this.overlay.classList.remove('simpleModal-inlineMode', 'simpleModal-imageMode', 'simpleModal-hidden');
    this.floatingClose.classList.remove('simpleModal-visible');
    this.floatingPagination.classList.remove('simpleModal-visible');
    this.prevBtn.style.display = 'none';
    this.nextBtn.style.display = 'none';
    this.imageContainer.classList.add('simpleModal-hidden');
    this.inlineContainer.classList.add('simpleModal-hidden');
    
    if (this.groupList.length > 1) this.updatePagination();

    if (mode === 'inline') {
      this.overlay.classList.add('simpleModal-inlineMode');
      this.inlineContainer.innerHTML = options.content;
      this.inlineContainer.classList.remove('simpleModal-hidden');
      document.getElementById('modalTitle').textContent = options.title || '詳細';
      this.showWrapper();
    } else if (mode === 'image') {
      this.overlay.classList.add('simpleModal-imageMode');
      this.imageContainer.classList.remove('simpleModal-hidden');
      this.modalImage.src = options.src;
    }
  }

  async showWrapper() {
    // 初回オープン時は全体の開きアニメーションを実行する
    await Promise.all([
      this.runAnimation(this.background, 'background', 'open'),
      this.runAnimation(this.wrapper, 'wrapper', 'open'),
      this.showContent(true, true)
    ]);

    if (this.currentMode === 'image') {
      this.floatingClose.classList.add('simpleModal-visible');
      this.runAnimation(this.floatingClose, 'button', 'open');
    }
    
    if (this.groupList.length > 1) {
      this.prevBtn.style.display = 'flex';
      this.nextBtn.style.display = 'flex';
      this.runAnimation(this.prevBtn, 'button', 'open');
      this.runAnimation(this.nextBtn, 'button', 'open');
    }
    this.isAnimating = false;
  }

  async close() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    
    const promises = [
      this.runAnimation(this.background, 'background', 'close'),
      this.runAnimation(this.wrapper, 'wrapper', 'close'),
      this.runAnimation(this.content, 'content', 'close') 
    ];

    // フローティング閉じるボタンのアニメーション
    if (this.floatingClose.classList.contains('simpleModal-visible')) {
      promises.push(this.runAnimation(this.floatingClose, 'button', 'close'));
    }
    
    // ナビゲーションボタンのアニメーションを追加
    if (this.prevBtn.style.display === 'flex') {
      promises.push(this.runAnimation(this.prevBtn, 'button', 'close'));
      promises.push(this.runAnimation(this.nextBtn, 'button', 'close'));
    }
    
    await Promise.all(promises);
    
    this.overlay.classList.add('simpleModal-hidden');
    this.modalImage.src = "";
    this.wrapper.style.aspectRatio = '';
    this.modalImage.style.aspectRatio = '';
    this.floatingPagination.classList.remove('simpleModal-visible');
    this.isAnimating = false;
    this.groupList = [];
    this.currentIndex = -1;
  }

  updatePagination() {
    const text = `${this.currentIndex + 1} / ${this.groupList.length}`;
    if (this.currentMode === 'image' && this.groupList.length > 1) {
      this.floatingPagination.textContent = text;
      this.floatingPagination.classList.add('simpleModal-visible');
    } else {
      this.floatingPagination.classList.remove('simpleModal-visible');
      this.inlinePagination.textContent = text;
    }
  }

  async switchContent(index) {
    if (index < 0 || index >= this.groupList.length || this.isAnimating) return;
    this.isAnimating = true;
    
    this.lastWrapperSize = { w: this.wrapper.offsetWidth, h: this.wrapper.offsetHeight };
    
    // 現在のコンテンツをフェードアウト
    const target = this.currentMode === 'image' ? this.modalImage : this.inlineContainer;
    await target.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, easing: 'ease-out', fill: 'both' }).finished;

    this.currentIndex = index;
    const el = this.groupList[index];
    this.updatePagination();

    if (this.currentMode === 'image') {
      this.modalImage.src = el.getAttribute('href');
    } else {
      const targetId = el.getAttribute('href')?.startsWith('#') ? el.getAttribute('href').substring(1) : el.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        this.inlineContainer.innerHTML = targetEl.innerHTML;
        document.getElementById('modalTitle').textContent = el.textContent;
        await this.animateResize(this.wrapper);
        this.showContent(true, false);
      }
    }
  }

  /**
   * コンテンツを表示
   * @param {boolean} useAnimation - 個別フェードを使用するか
   * @param {boolean} isInitial - モーダル自体の開きアニメを走らせるか
   */
  async showContent(useAnimation = true, isInitial = false) {
    const target = this.currentMode === 'image' ? this.modalImage : this.inlineContainer;
    const promises = [];

    if (useAnimation) {
      promises.push(target.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: 'ease-out', fill: 'both' }).finished);
    } else {
      target.style.opacity = '1';
    }

    if (isInitial) {
      // 初回のみモーダル全体の開きアニメーションを並行実行
      promises.push(this.runAnimation(this.content, 'content', 'open'));
    }

    await Promise.all(promises);
    target.style.opacity = '1';
    this.isAnimating = false;
  }

  prev() { this.switchContent(this.currentIndex - 1 < 0 ? this.groupList.length - 1 : this.currentIndex - 1); }
  next() { this.switchContent(this.currentIndex + 1 >= this.groupList.length ? 0 : this.currentIndex + 1); }
}

[Element, NodeList, HTMLCollection].forEach((constructor) => {
  constructor.prototype.simpleModal = function (options = {}) {
    if (!window._simpleModalInstance) {
      const overlaySelector = options.overlay || '.simpleModal-overlay';
      window._simpleModalInstance = new SimpleModal(overlaySelector, options);
    }
    const modal = window._simpleModalInstance;
    const init = (el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const groupName = el.dataset.group;
        if (groupName) {
          modal.groupList = Array.from(document.querySelectorAll(`[data-group="${groupName}"]`));
          modal.currentIndex = modal.groupList.indexOf(el);
        } else {
          modal.groupList = [];
          modal.currentIndex = -1;
        }
        modal.openTrigger(el);
      });
      return modal;
    };
    if (this instanceof Element) return init(this);
    else return Array.from(this).map(el => init(el));
  };
});

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.simpleModal-trigger').simpleModal({
    swipe: true, // スワイプ機能を有効化
    animation: { // 新しい階層構造に合わせてオプションを指定
      background: {
        open: { 
          opacity: { opacity: [1, 1], duration: 0.6, delay: 0, ease: 'ease-out' },
          translateY: { translateY: ['100%', 0], duration: 0.4, delay: 0, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }
        },
        close: { 
          opacity: { opacity: [1, 0], duration: 0.6, delay: 0.4, ease: 'ease-out' },
          translateY: { translateY: [0, '-100%'], duration: 0.4, delay: 0.4, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }
        }
      },
      wrapper: {
        open: { 
          opacity: { opacity: [0, 1], duration: 0.6, delay: 0.4, ease: 'ease-out' },
          translateY: { translateY: [20, 0], duration: 0.6, delay: 0.4, ease: 'ease-out' }
        },
        close: { 
          opacity: { opacity: [1, 0], duration: 0.6, delay: 0.4, ease: 'ease-out' },
          translateY: { translateY: [0, -20], duration: 0.6, delay: 0, ease: 'ease-out' }
        }
      }
    }
  });
});