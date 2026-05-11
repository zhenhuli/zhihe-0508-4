import './style.css'
import hljs from 'highlight.js/lib/core'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/atom-one-dark.css'

hljs.registerLanguage('css', css)
hljs.registerLanguage('xml', xml)

const weatherCodeTemplates = {
  sunny: `/* ============================================
   晴天图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon sunny">
  <div class="sun"></div>
  <div class="sun-rays"></div>
</div>

/* CSS 样式 */
.sun {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ffd700, #ffa500);
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 60px rgba(255, 165, 0, 0.6);
  animation: sunPulse 3s ease-in-out infinite;
}

.sun-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  animation: sunRotate 12s linear infinite;
}

.sun-rays::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 30px;
  background: linear-gradient(90deg, #ffd700, #ffa500);
  border-radius: 6px;
  box-shadow: 
    120px 0 #ffd700,
    -120px 0 #ffd700,
    0 120px #ffd700,
    0 -120px #ffd700,
    85px 85px #ffd700,
    -85px 85px #ffd700,
    85px -85px #ffd700,
    -85px -85px #ffd700;
}

@keyframes sunPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 60px rgba(255, 165, 0, 0.6);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 80px rgba(255, 165, 0, 0.8);
  }
}

@keyframes sunRotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}`,

  cloudy: `/* ============================================
   多云图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon cloudy">
  <div class="cloud"></div>
  <div class="cloud"></div>
</div>

/* CSS 样式 */
.cloud {
  width: 100px;
  height: 40px;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e0);
  border-radius: 20px;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  animation: cloudFloat 6s ease-in-out infinite;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.cloud::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.cloud::after {
  width: 60px;
  height: 60px;
  top: -35px;
  left: 45px;
}

/* 第二层云 */
.cloud:nth-child(2) {
  position: absolute;
  top: 30px;
  left: -20px;
  opacity: 0.7;
  transform: scale(0.7);
  animation-delay: -3s;
}

@keyframes cloudFloat {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(15px);
  }
}`,

  'partly-cloudy': `/* ============================================
   阴转晴图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon partly-cloudy">
  <div class="sun"></div>
  <div class="cloud"></div>
</div>

/* CSS 样式 */
.partly-cloudy .sun {
  position: absolute;
  top: -30px;
  right: -20px;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #ffd700, #ffa500);
  border-radius: 50%;
  box-shadow: 0 0 60px rgba(255, 165, 0, 0.6);
  animation: sunPulse 3s ease-in-out infinite;
}

.partly-cloudy .cloud {
  width: 90px;
  height: 36px;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e0);
  border-radius: 18px;
  position: relative;
  z-index: 2;
  animation: cloudFloat 5s ease-in-out infinite;
}

.partly-cloudy .cloud::before,
.partly-cloudy .cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.partly-cloudy .cloud::before {
  width: 45px;
  height: 45px;
  top: -22px;
  left: 12px;
}

.partly-cloudy .cloud::after {
  width: 54px;
  height: 54px;
  top: -32px;
  left: 40px;
}

@keyframes sunPulse {
  0%, 100% {
    box-shadow: 0 0 60px rgba(255, 165, 0, 0.6);
  }
  50% {
    box-shadow: 0 0 80px rgba(255, 165, 0, 0.8);
  }
}

@keyframes cloudFloat {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(15px);
  }
}`,

  rainy: `/* ============================================
   下雨图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon rainy">
  <div class="cloud"></div>
  <div class="rain-drops">
    <div class="rain-drop"></div>
    <div class="rain-drop"></div>
    <div class="rain-drop"></div>
    <div class="rain-drop"></div>
    <div class="rain-drop"></div>
    <div class="rain-drop"></div>
  </div>
</div>

/* CSS 样式 */
.rainy .cloud {
  width: 100px;
  height: 40px;
  background: linear-gradient(135deg, #4a5568, #718096);
  border-radius: 20px;
  position: relative;
  animation: cloudFloat 4s ease-in-out infinite;
}

.rainy .cloud::before,
.rainy .cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.rainy .cloud::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.rainy .cloud::after {
  width: 60px;
  height: 60px;
  top: -35px;
  left: 45px;
}

.rain-drops {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  height: 80px;
  overflow: hidden;
}

.rain-drop {
  position: absolute;
  width: 3px;
  height: 20px;
  background: linear-gradient(180deg, transparent, #63b3ed);
  border-radius: 1.5px;
  animation: rainFall 1s linear infinite;
}

.rain-drop:nth-child(1) {
  left: 15%;
  animation-delay: 0s;
}

.rain-drop:nth-child(2) {
  left: 35%;
  animation-delay: 0.2s;
}

.rain-drop:nth-child(3) {
  left: 55%;
  animation-delay: 0.4s;
}

.rain-drop:nth-child(4) {
  left: 75%;
  animation-delay: 0.6s;
}

.rain-drop:nth-child(5) {
  left: 25%;
  animation-delay: 0.3s;
  animation-duration: 1.2s;
}

.rain-drop:nth-child(6) {
  left: 65%;
  animation-delay: 0.7s;
  animation-duration: 1.1s;
}

@keyframes cloudFloat {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(15px);
  }
}

@keyframes rainFall {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(60px);
    opacity: 0;
  }
}`,

  thunderstorm: `/* ============================================
   雷阵雨图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon thunderstorm">
  <div class="cloud"></div>
  <div class="lightning"></div>
  <div class="rain-drops">
    <div class="rain-drop"></div>
    <div class="rain-drop"></div>
    <div class="rain-drop"></div>
    <div class="rain-drop"></div>
  </div>
</div>

/* CSS 样式 */
.thunderstorm .cloud {
  width: 100px;
  height: 40px;
  background: linear-gradient(135deg, #2d3748, #4a5568);
  border-radius: 20px;
  position: relative;
  animation: cloudFloat 3s ease-in-out infinite;
}

.thunderstorm .cloud::before,
.thunderstorm .cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.thunderstorm .cloud::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.thunderstorm .cloud::after {
  width: 60px;
  height: 60px;
  top: -35px;
  left: 45px;
}

.lightning {
  position: absolute;
  top: 20px;
  left: 60px;
  width: 30px;
  height: 40px;
  animation: lightningFlash 2s ease-in-out infinite;
}

.lightning::before,
.lightning::after {
  content: '';
  position: absolute;
  background: #ffd700;
}

.lightning::before {
  width: 8px;
  height: 25px;
  transform: skewX(-20deg);
  left: 10px;
}

.lightning::after {
  width: 8px;
  height: 20px;
  transform: skewX(-20deg);
  top: 20px;
  left: 5px;
}

.thunderstorm .rain-drops {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  height: 80px;
  overflow: hidden;
}

.thunderstorm .rain-drop {
  position: absolute;
  width: 3px;
  height: 20px;
  background: linear-gradient(180deg, transparent, #63b3ed);
  border-radius: 1.5px;
  animation: rainFall 0.8s linear infinite;
}

.thunderstorm .rain-drop:nth-child(1) {
  left: 15%;
  animation-delay: 0s;
}

.thunderstorm .rain-drop:nth-child(2) {
  left: 35%;
  animation-delay: 0.15s;
}

.thunderstorm .rain-drop:nth-child(3) {
  left: 55%;
  animation-delay: 0.3s;
}

.thunderstorm .rain-drop:nth-child(4) {
  left: 75%;
  animation-delay: 0.45s;
}

@keyframes cloudFloat {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(15px);
  }
}

@keyframes lightningFlash {
  0%, 90%, 100% {
    opacity: 0;
    filter: drop-shadow(0 0 0 transparent);
  }
  92% {
    opacity: 1;
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
  }
  94% {
    opacity: 0.5;
  }
  96% {
    opacity: 1;
    filter: drop-shadow(0 0 30px rgba(255, 215, 0, 1));
  }
}

@keyframes rainFall {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(60px);
    opacity: 0;
  }
}`,

  snowy: `/* ============================================
   下雪图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon snowy">
  <div class="cloud"></div>
  <div class="snowflakes">
    <div class="snowflake">❄</div>
    <div class="snowflake">❄</div>
    <div class="snowflake">❄</div>
    <div class="snowflake">❄</div>
    <div class="snowflake">❄</div>
    <div class="snowflake">❄</div>
  </div>
</div>

/* CSS 样式 */
.snowy .cloud {
  width: 100px;
  height: 40px;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e0);
  border-radius: 20px;
  position: relative;
  animation: cloudFloat 5s ease-in-out infinite;
}

.snowy .cloud::before,
.snowy .cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.snowy .cloud::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.snowy .cloud::after {
  width: 60px;
  height: 60px;
  top: -35px;
  left: 45px;
}

.snowflakes {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  height: 100px;
  overflow: hidden;
}

.snowflake {
  position: absolute;
  color: #fff;
  font-size: 16px;
  animation: snowFall 3s ease-in-out infinite;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

.snowflake:nth-child(1) {
  left: 10%;
  animation-delay: 0s;
}

.snowflake:nth-child(2) {
  left: 25%;
  animation-delay: 0.5s;
  animation-duration: 3.5s;
}

.snowflake:nth-child(3) {
  left: 45%;
  animation-delay: 1s;
  animation-duration: 2.8s;
}

.snowflake:nth-child(4) {
  left: 65%;
  animation-delay: 1.5s;
  animation-duration: 3.2s;
}

.snowflake:nth-child(5) {
  left: 80%;
  animation-delay: 0.8s;
  animation-duration: 3.8s;
}

.snowflake:nth-child(6) {
  left: 35%;
  animation-delay: 2s;
  animation-duration: 3s;
}

@keyframes cloudFloat {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(15px);
  }
}

@keyframes snowFall {
  0% {
    transform: translateY(-20px) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  50% {
    transform: translateY(40px) rotate(180deg);
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(80px) rotate(360deg);
    opacity: 0;
  }
}`,

  foggy: `/* ============================================
   雾天图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon foggy">
  <div class="fog">
    <div class="fog-layer"></div>
    <div class="fog-layer"></div>
    <div class="fog-layer"></div>
  </div>
</div>

/* CSS 样式 */
.fog {
  position: relative;
  width: 160px;
  height: 80px;
}

.fog-layer {
  position: absolute;
  height: 20px;
  background: linear-gradient(90deg, transparent, rgba(226, 232, 240, 0.8), transparent);
  border-radius: 10px;
  animation: fogMove 6s ease-in-out infinite;
}

.fog-layer:nth-child(1) {
  top: 0;
  left: 0;
  width: 140px;
}

.fog-layer:nth-child(2) {
  top: 30px;
  left: 20px;
  width: 120px;
  animation-delay: -2s;
  animation-direction: reverse;
}

.fog-layer:nth-child(3) {
  top: 60px;
  left: 0;
  width: 100px;
  animation-delay: -4s;
}

@keyframes fogMove {
  0%, 100% {
    transform: translateX(0);
    opacity: 0.6;
  }
  50% {
    transform: translateX(20px);
    opacity: 0.9;
  }
}`,

  windy: `/* ============================================
   大风图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon windy">
  <div class="wind-container">
    <div class="wind-line"></div>
    <div class="wind-line"></div>
    <div class="wind-line"></div>
    <div class="wind-curve"></div>
    <div class="wind-curve"></div>
    <div class="wind-curve"></div>
  </div>
</div>

/* CSS 样式 */
.wind-container {
  position: relative;
  width: 160px;
  height: 120px;
}

.wind-line {
  position: absolute;
  height: 4px;
  background: linear-gradient(90deg, transparent, #a0aec0, transparent);
  border-radius: 2px;
  animation: windBlow 2s ease-in-out infinite;
}

.wind-line:nth-child(1) {
  top: 20px;
  left: 0;
  width: 120px;
  animation-delay: 0s;
}

.wind-line:nth-child(2) {
  top: 50px;
  left: 20px;
  width: 100px;
  animation-delay: 0.3s;
}

.wind-line:nth-child(3) {
  top: 80px;
  left: 0;
  width: 140px;
  animation-delay: 0.6s;
}

.wind-curve {
  position: absolute;
  width: 40px;
  height: 20px;
  border: 4px solid transparent;
  border-top: 4px solid #a0aec0;
  border-right: 4px solid #a0aec0;
  border-radius: 0 20px 0 0;
  animation: windCurve 2s ease-in-out infinite;
}

.wind-curve:nth-child(4) {
  top: 15px;
  left: 110px;
  animation-delay: 0.2s;
}

.wind-curve:nth-child(5) {
  top: 45px;
  left: 100px;
  animation-delay: 0.5s;
}

.wind-curve:nth-child(6) {
  top: 75px;
  left: 130px;
  animation-delay: 0.8s;
}

@keyframes windBlow {
  0% {
    transform: translateX(-20px);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateX(60px);
    opacity: 0;
  }
}

@keyframes windCurve {
  0% {
    transform: translateX(-10px) scale(0.5);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translateX(40px) scale(1);
    opacity: 0;
  }
}`,

  hail: `/* ============================================
   冰雹图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon hail">
  <div class="cloud"></div>
  <div class="hail-stones">
    <div class="hail-stone"></div>
    <div class="hail-stone"></div>
    <div class="hail-stone"></div>
    <div class="hail-stone"></div>
    <div class="hail-stone"></div>
    <div class="hail-stone"></div>
  </div>
</div>

/* CSS 样式 */
.hail .cloud {
  width: 100px;
  height: 40px;
  background: linear-gradient(135deg, #4a5568, #718096);
  border-radius: 20px;
  position: relative;
  animation: cloudFloat 4s ease-in-out infinite;
}

.hail .cloud::before,
.hail .cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.hail .cloud::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.hail .cloud::after {
  width: 60px;
  height: 60px;
  top: -35px;
  left: 45px;
}

.hail-stones {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  height: 80px;
  overflow: hidden;
}

.hail-stone {
  position: absolute;
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #e2e8f0, #a0aec0);
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  animation: hailFall 1.2s ease-in-out infinite;
}

.hail-stone:nth-child(1) {
  left: 15%;
  animation-delay: 0s;
}

.hail-stone:nth-child(2) {
  left: 35%;
  animation-delay: 0.2s;
  width: 10px;
  height: 10px;
}

.hail-stone:nth-child(3) {
  left: 55%;
  animation-delay: 0.4s;
}

.hail-stone:nth-child(4) {
  left: 75%;
  animation-delay: 0.6s;
  width: 12px;
  height: 12px;
}

.hail-stone:nth-child(5) {
  left: 25%;
  animation-delay: 0.3s;
  width: 9px;
  height: 9px;
}

.hail-stone:nth-child(6) {
  left: 65%;
  animation-delay: 0.7s;
}

@keyframes cloudFloat {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(15px);
  }
}

@keyframes hailFall {
  0% {
    transform: translateY(-20px) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(60px) rotate(180deg);
    opacity: 0;
  }
}`,

  'night-clear': `/* ============================================
   晴夜图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon night-clear">
  <div class="stars">
    <div class="star">✦</div>
    <div class="star">✦</div>
    <div class="star">✦</div>
    <div class="star">✦</div>
    <div class="star">✦</div>
    <div class="star">✦</div>
  </div>
  <div class="moon"></div>
</div>

/* CSS 样式 */
.moon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f7fafc, #e2e8f0);
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.4);
  animation: moonGlow 4s ease-in-out infinite;
}

.moon::after {
  content: '';
  position: absolute;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #1a202c, #2d3748);
  border-radius: 50%;
  top: -5px;
  right: -15px;
}

.stars {
  position: absolute;
  top: -40px;
  left: -60px;
  width: 220px;
  height: 220px;
}

.star {
  position: absolute;
  color: #ffd700;
  animation: starTwinkle 2s ease-in-out infinite;
}

.star:nth-child(1) {
  top: 20px;
  left: 30px;
  font-size: 8px;
  animation-delay: 0s;
}

.star:nth-child(2) {
  top: 60px;
  left: 20px;
  font-size: 6px;
  animation-delay: 0.5s;
}

.star:nth-child(3) {
  top: 10px;
  right: 40px;
  font-size: 10px;
  animation-delay: 1s;
}

.star:nth-child(4) {
  top: 50px;
  right: 20px;
  font-size: 7px;
  animation-delay: 1.5s;
}

.star:nth-child(5) {
  bottom: 40px;
  left: 10px;
  font-size: 6px;
  animation-delay: 0.3s;
}

.star:nth-child(6) {
  bottom: 20px;
  right: 50px;
  font-size: 9px;
  animation-delay: 0.8s;
}

@keyframes moonGlow {
  0%, 100% {
    box-shadow: 0 0 40px rgba(255, 255, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 60px rgba(255, 255, 255, 0.6);
  }
}

@keyframes starTwinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}`,

  'night-cloudy': `/* ============================================
   多云夜图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon night-cloudy">
  <div class="stars">
    <div class="star">✦</div>
    <div class="star">✦</div>
  </div>
  <div class="moon"></div>
  <div class="cloud"></div>
</div>

/* CSS 样式 */
.night-cloudy .moon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f7fafc, #e2e8f0);
  border-radius: 50%;
  position: absolute;
  top: -25px;
  right: -15px;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.4);
  animation: moonGlow 4s ease-in-out infinite;
}

.night-cloudy .moon::after {
  content: '';
  position: absolute;
  width: 55px;
  height: 55px;
  background: linear-gradient(135deg, #1a202c, #2d3748);
  border-radius: 50%;
  top: -5px;
  right: -12px;
}

.night-cloudy .stars {
  position: absolute;
  top: -50px;
  left: -70px;
  width: 220px;
  height: 220px;
}

.night-cloudy .star {
  position: absolute;
  color: #ffd700;
  animation: starTwinkle 2s ease-in-out infinite;
}

.night-cloudy .star:nth-child(1) {
  top: 30px;
  left: 40px;
  font-size: 8px;
  animation-delay: 0s;
}

.night-cloudy .star:nth-child(2) {
  top: 20px;
  right: 60px;
  font-size: 6px;
  animation-delay: 0.7s;
}

.night-cloudy .cloud {
  width: 90px;
  height: 36px;
  background: linear-gradient(135deg, #4a5568, #718096);
  border-radius: 18px;
  position: relative;
  z-index: 2;
  animation: cloudFloat 5s ease-in-out infinite;
}

.night-cloudy .cloud::before,
.night-cloudy .cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.night-cloudy .cloud::before {
  width: 45px;
  height: 45px;
  top: -22px;
  left: 12px;
}

.night-cloudy .cloud::after {
  width: 54px;
  height: 54px;
  top: -32px;
  left: 40px;
}

@keyframes moonGlow {
  0%, 100% {
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 50px rgba(255, 255, 255, 0.6);
  }
}

@keyframes starTwinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes cloudFloat {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(15px);
  }
}`,

  tornado: `/* ============================================
   龙卷风图标动画
   ============================================ */

/* HTML 结构 */
<div class="weather-icon tornado">
  <div class="tornado-container">
    <div class="cloud"></div>
    <div class="twister"></div>
  </div>
</div>

/* CSS 样式 */
.tornado-container {
  position: relative;
  width: 160px;
  height: 160px;
}

.tornado .cloud {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 40px;
  background: linear-gradient(135deg, #4a5568, #718096);
  border-radius: 20px;
  animation: cloudFloat 4s ease-in-out infinite;
}

.tornado .cloud::before,
.tornado .cloud::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.tornado .cloud::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.tornado .cloud::after {
  width: 60px;
  height: 60px;
  top: -35px;
  left: 55px;
}

.twister {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 100px;
  border: 3px solid rgba(113, 128, 150, 0.6);
  border-radius: 50%;
  border-top-color: transparent;
  border-bottom-color: transparent;
  animation: tornadoSpin 1s linear infinite;
}

.twister::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 5px;
  width: 40px;
  height: 75px;
  border: 2px solid rgba(113, 128, 150, 0.4);
  border-radius: 50%;
  border-top-color: transparent;
  border-bottom-color: transparent;
  animation: tornadoSpin 1.5s linear infinite reverse;
}

.twister::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 10px;
  width: 30px;
  height: 55px;
  border: 2px solid rgba(113, 128, 150, 0.3);
  border-radius: 50%;
  border-top-color: transparent;
  border-bottom-color: transparent;
  animation: tornadoSpin 1.2s linear infinite;
}

@keyframes tornadoSpin {
  from {
    transform: translateX(-50%) rotate(0deg);
  }
  to {
    transform: translateX(-50%) rotate(360deg);
  }
}

@keyframes cloudFloat {
  0%, 100% {
    transform: translateX(-50%);
  }
  50% {
    transform: translateX(-35%);
  }
}`
}

const weatherConfigs = {
  sunny: {
    name: '晴天',
    description: '阳光明媚，适合外出',
    render: () => `
      <div class="sun"></div>
      <div class="sun-rays"></div>
    `
  },
  cloudy: {
    name: '多云',
    description: '云层较多，气温适宜',
    render: () => `
      <div class="cloud"></div>
      <div class="cloud"></div>
    `
  },
  'partly-cloudy': {
    name: '阴转晴',
    description: '部分多云，偶见阳光',
    render: () => `
      <div class="sun"></div>
      <div class="cloud"></div>
    `
  },
  rainy: {
    name: '下雨',
    description: '记得带伞，注意保暖',
    render: () => `
      <div class="cloud"></div>
      <div class="rain-drops">
        <div class="rain-drop"></div>
        <div class="rain-drop"></div>
        <div class="rain-drop"></div>
        <div class="rain-drop"></div>
        <div class="rain-drop"></div>
        <div class="rain-drop"></div>
      </div>
    `
  },
  thunderstorm: {
    name: '雷阵雨',
    description: '雷雨天气，注意安全',
    render: () => `
      <div class="cloud"></div>
      <div class="lightning"></div>
      <div class="rain-drops">
        <div class="rain-drop"></div>
        <div class="rain-drop"></div>
        <div class="rain-drop"></div>
        <div class="rain-drop"></div>
      </div>
    `
  },
  snowy: {
    name: '下雪',
    description: '银装素裹，注意保暖',
    render: () => `
      <div class="cloud"></div>
      <div class="snowflakes">
        <div class="snowflake">❄</div>
        <div class="snowflake">❄</div>
        <div class="snowflake">❄</div>
        <div class="snowflake">❄</div>
        <div class="snowflake">❄</div>
        <div class="snowflake">❄</div>
      </div>
    `
  },
  foggy: {
    name: '雾天',
    description: '能见度低，注意安全',
    render: () => `
      <div class="fog">
        <div class="fog-layer"></div>
        <div class="fog-layer"></div>
        <div class="fog-layer"></div>
      </div>
    `
  },
  windy: {
    name: '大风',
    description: '风力强劲，注意防风',
    render: () => `
      <div class="wind-container">
        <div class="wind-line"></div>
        <div class="wind-line"></div>
        <div class="wind-line"></div>
        <div class="wind-curve"></div>
        <div class="wind-curve"></div>
        <div class="wind-curve"></div>
      </div>
    `
  },
  hail: {
    name: '冰雹',
    description: '冰雹天气，注意防护',
    render: () => `
      <div class="cloud"></div>
      <div class="hail-stones">
        <div class="hail-stone"></div>
        <div class="hail-stone"></div>
        <div class="hail-stone"></div>
        <div class="hail-stone"></div>
        <div class="hail-stone"></div>
        <div class="hail-stone"></div>
      </div>
    `
  },
  'night-clear': {
    name: '晴夜',
    description: '月色皎洁，星光闪烁',
    render: () => `
      <div class="stars">
        <div class="star">✦</div>
        <div class="star">✦</div>
        <div class="star">✦</div>
        <div class="star">✦</div>
        <div class="star">✦</div>
        <div class="star">✦</div>
      </div>
      <div class="moon"></div>
    `
  },
  'night-cloudy': {
    name: '多云夜',
    description: '月色朦胧，云层较厚',
    render: () => `
      <div class="stars">
        <div class="star">✦</div>
        <div class="star">✦</div>
      </div>
      <div class="moon"></div>
      <div class="cloud"></div>
    `
  },
  tornado: {
    name: '龙卷风',
    description: '极端天气，请躲避',
    render: () => `
      <div class="tornado-container">
        <div class="cloud"></div>
        <div class="twister"></div>
      </div>
    `
  }
}

let currentWeather = 'sunny'
let currentTheme = 'light'

const weatherIconContainer = document.getElementById('weatherIconContainer')
const weatherName = document.getElementById('weatherName')
const weatherDescription = document.getElementById('weatherDescription')
const themeToggle = document.getElementById('themeToggle')
const weatherButtons = document.querySelectorAll('.weather-btn')
const quickCopyButtons = document.querySelectorAll('.quick-copy-btn')
const codeContent = document.getElementById('codeContent')
const copyCodeBtn = document.getElementById('copyCodeBtn')

function createWeatherIcon(weatherType) {
  const config = weatherConfigs[weatherType]
  const icon = document.createElement('div')
  icon.className = `weather-icon ${weatherType}`
  icon.innerHTML = config.render()
  return icon
}

function updateWeatherInfo(weatherType) {
  const config = weatherConfigs[weatherType]
  weatherName.textContent = config.name
  weatherDescription.textContent = config.description
}

function updateCodePreview(weatherType) {
  const code = weatherCodeTemplates[weatherType]
  codeContent.textContent = code
  hljs.highlightElement(codeContent)
  codeContent.scrollTop = 0
}

function switchWeather(weatherType) {
  if (weatherType === currentWeather) return

  weatherButtons.forEach(btn => {
    if (btn.dataset.weather === currentWeather) {
      btn.classList.remove('active')
    }
    if (btn.dataset.weather === weatherType) {
      btn.classList.add('active')
    }
  })

  const currentIcon = weatherIconContainer.querySelector('.weather-icon')
  
  if (currentIcon) {
    currentIcon.classList.add('exit')
    currentIcon.classList.remove('active')
    
    setTimeout(() => {
      if (currentIcon.parentNode === weatherIconContainer) {
        weatherIconContainer.removeChild(currentIcon)
      }
    }, 500)
  }

  const newIcon = createWeatherIcon(weatherType)
  weatherIconContainer.appendChild(newIcon)

  requestAnimationFrame(() => {
    newIcon.classList.add('active')
  })

  updateWeatherInfo(weatherType)
  updateCodePreview(weatherType)
  currentWeather = weatherType
}

function initWeather() {
  const initialIcon = createWeatherIcon(currentWeather)
  weatherIconContainer.appendChild(initialIcon)
  
  setTimeout(() => {
    initialIcon.classList.add('active')
  }, 100)
  
  updateWeatherInfo(currentWeather)
  updateCodePreview(currentWeather)
}

function switchTheme() {
  const html = document.documentElement
  const themeIcon = document.querySelector('.theme-icon')
  
  if (currentTheme === 'light') {
    html.setAttribute('data-theme', 'dark')
    currentTheme = 'dark'
    themeIcon.textContent = '☀️'
    localStorage.setItem('weather-theme', 'dark')
  } else {
    html.removeAttribute('data-theme')
    currentTheme = 'light'
    themeIcon.textContent = '🌙'
    localStorage.setItem('weather-theme', 'light')
  }
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem('weather-theme')
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
    currentTheme = 'dark'
    document.querySelector('.theme-icon').textContent = '☀️'
  }
}

async function copyWeatherCode(weatherType, button) {
  const code = weatherCodeTemplates[weatherType]
  const isMainBtn = button === copyCodeBtn
  
  try {
    await navigator.clipboard.writeText(code)
    
    if (isMainBtn) {
      button.classList.add('copied')
      const originalText = button.querySelector('.copy-text').textContent
      button.querySelector('.copy-text').textContent = '已复制!'
      button.querySelector('.copy-icon').textContent = '✅'
      
      setTimeout(() => {
        button.classList.remove('copied')
        button.querySelector('.copy-text').textContent = originalText
        button.querySelector('.copy-icon').textContent = '📋'
      }, 2000)
    } else {
      const originalIcon = button.textContent
      button.classList.add('copied')
      button.textContent = '✅'
      
      setTimeout(() => {
        button.classList.remove('copied')
        button.textContent = originalIcon
      }, 2000)
    }
  } catch (err) {
    console.error('复制失败:', err)
    
    const textArea = document.createElement('textarea')
    textArea.value = code
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    
    if (isMainBtn) {
      button.classList.add('copied')
      const originalText = button.querySelector('.copy-text').textContent
      button.querySelector('.copy-text').textContent = '已复制!'
      button.querySelector('.copy-icon').textContent = '✅'
      
      setTimeout(() => {
        button.classList.remove('copied')
        button.querySelector('.copy-text').textContent = originalText
        button.querySelector('.copy-icon').textContent = '📋'
      }, 2000)
    } else {
      const originalIcon = button.textContent
      button.classList.add('copied')
      button.textContent = '✅'
      
      setTimeout(() => {
        button.classList.remove('copied')
        button.textContent = originalIcon
      }, 2000)
    }
  }
}

function copyCode() {
  copyWeatherCode(currentWeather, copyCodeBtn)
}

function setupEventListeners() {
  weatherButtons.forEach(button => {
    button.addEventListener('click', () => {
      const weatherType = button.dataset.weather
      switchWeather(weatherType)
    })
  })

  quickCopyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation()
      const weatherType = button.dataset.weather
      copyWeatherCode(weatherType, button)
    })
  })

  themeToggle.addEventListener('click', switchTheme)
  copyCodeBtn.addEventListener('click', copyCode)
}

document.addEventListener('DOMContentLoaded', () => {
  loadSavedTheme()
  initWeather()
  setupEventListeners()
})
