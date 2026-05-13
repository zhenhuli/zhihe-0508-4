import { MenuIcon, HeartIcon, LoadingIcon } from './animations/iconAnimations.js';
import { PathDraw, PathFollow, PathWave } from './animations/pathAnimations.js';
import { CircleSquare, StarHeart, MultiMorph } from './animations/morphAnimations.js';
import { SpinnerAnimation, PulseAnimation, ProgressAnimation, ParticleExplosion, ToggleSwitch } from './animations/extraAnimations.js';

class AnimationGallery {
    constructor() {
        this.animations = {};
        this.init();
    }

    init() {
        this.initAnimations();
        this.initEventListeners();
    }

    initAnimations() {
        this.animations.menu = new MenuIcon('menu-icon');
        this.animations.heart = new HeartIcon('heart-icon');
        this.animations.loading = new LoadingIcon('loading-icon');

        this.animations.draw = new PathDraw('path-draw');
        this.animations.follow = new PathFollow('path-follow');
        this.animations.wave = new PathWave('path-wave');

        this.animations['circle-square'] = new CircleSquare('morph-circle');
        this.animations['star-heart'] = new StarHeart('morph-star');
        this.animations.transform = new MultiMorph('morph-transform');

        this.animations.spinner = new SpinnerAnimation('spinner');
        this.animations.pulse = new PulseAnimation('pulse');
        this.animations.progress = new ProgressAnimation('progress');
        this.animations.particle = new ParticleExplosion('particle');
        this.animations.toggle = new ToggleSwitch('toggle');
    }

    initEventListeners() {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e));
        });

        document.querySelectorAll('.animation-card').forEach(card => {
            card.addEventListener('click', (e) => this.triggerAnimation(e));
        });
    }

    switchTab(e) {
        const category = e.target.dataset.category;

        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        e.target.classList.add('active');

        document.querySelectorAll('.gallery-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${category}-section`).classList.add('active');
    }

    triggerAnimation(e) {
        const card = e.currentTarget;
        const animationType = card.dataset.animation;

        if (this.animations[animationType]) {
            this.animations[animationType].toggle();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AnimationGallery();
});
