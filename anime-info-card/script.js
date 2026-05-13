const animeData = [
    {
        id: 1,
        title: "鬼灭之刃",
        titleEn: "Demon Slayer",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20demon%20slayer%20tanjiro%20katana%20demon%20hunting&image_size=square",
        category: "action",
        tags: ["热血", "战斗", "奇幻"],
        year: "2019",
        episodes: "44集",
        synopsis: "讲述了灶门炭治郎为了将变成鬼的妹妹祢豆子变回人类，踏上了成为鬼杀队剑士的旅程。在与鬼的战斗中，他结识了伙伴，逐渐揭开了鬼的秘密和家族的谜团。",
        characters: ["灶门炭治郎", "灶门祢豆子", "我妻善逸", "嘴平伊之助", "富冈义勇"]
    },
    {
        id: 2,
        title: "你的名字",
        titleEn: "Your Name",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20your%20name%20kimi%20no%20na%20wa%20romantic%20sky%20comet&image_size=square",
        category: "romance",
        tags: ["恋爱", "奇幻", "青春"],
        year: "2016",
        episodes: "剧场版",
        synopsis: "在东京生活的少年立花泷和在乡下生活的少女宫水三叶，通过梦境交换身体的奇妙经历。两人在不断的交集之中逐渐产生了情愫，同时也发现了隐藏在彗星背后的秘密。",
        characters: ["立花泷", "宫水三叶", "藤井司", "奥寺美纪", "一叶"]
    },
    {
        id: 3,
        title: "进击的巨人",
        titleEn: "Attack on Titan",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20attack%20on%20titan%20eren%20survey%20corps%20walls&image_size=square",
        category: "action",
        tags: ["热血", "战斗", "黑暗"],
        year: "2013",
        episodes: "87集",
        synopsis: "百年以来，人类都被巨人支配着。为了躲避巨人的袭击，人类建造了三重巨大的城墙。艾伦·耶格尔在目睹母亲被巨人吞噬后，立誓要消灭所有巨人，加入调查兵团展开反击。",
        characters: ["艾伦·耶格尔", "三笠·阿克曼", "阿尔敏·阿诺德", "利威尔·阿克曼", "埃尔文·史密斯"]
    },
    {
        id: 4,
        title: "轻音少女",
        titleEn: "K-ON!",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20k-on%20cute%20girls%20music%20band%20school%20tea&image_size=square",
        category: "slice",
        tags: ["日常", "音乐", "治愈"],
        year: "2009",
        episodes: "39集",
        synopsis: "讲述了樱丘高中轻音乐部的少女们的日常生活。平泽唯在误打误撞中加入了濒临废部的轻音乐部，与秋山澪、田井中律、琴吹紬等人一起度过了快乐的高中时光。",
        characters: ["平泽唯", "秋山澪", "田井中律", "琴吹紬", "中野梓"]
    },
    {
        id: 5,
        title: "咒术回战",
        titleEn: "Jujutsu Kaisen",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20jujutsu%20kaisen%20itadori%20yuji%20curses%20magic&image_size=square",
        category: "action",
        tags: ["热血", "战斗", "奇幻"],
        year: "2020",
        episodes: "47集",
        synopsis: "高中生虎杖悠仁在机缘巧合下吞下了特级咒物两面宿傩的手指，从此与诅咒共生。为了保护他人，他加入了东京咒术高专，与伏黑惠、钉崎野蔷薇等人一起展开咒术战斗。",
        characters: ["虎杖悠仁", "伏黑惠", "钉崎野蔷薇", "五条悟", "两面宿傩"]
    },
    {
        id: 6,
        title: "辉夜大小姐想让我告白",
        titleEn: "Kaguya-sama",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20kaguya%20sama%20love%20is%20war%20romantic%20comedy%20school&image_size=square",
        category: "romance",
        tags: ["恋爱", "喜剧", "校园"],
        year: "2019",
        episodes: "37集",
        synopsis: "秀知院学园学生会的副会长四宫辉夜和会长白银御行，明明互相喜欢却都不愿先告白，于是展开了一场场想方设法让对方先告白的头脑战恋爱喜剧。",
        characters: ["四宫辉夜", "白银御行", "藤原千花", "石上优", "早坂爱"]
    },
    {
        id: 7,
        title: "关于我转生变成史莱姆这档事",
        titleEn: "That Time I Got Reincarnated as a Slime",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20slime%20rimuru%20fantasy%20isekai%20monster&image_size=square",
        category: "fantasy",
        tags: ["奇幻", "冒险", "异世界"],
        year: "2018",
        episodes: "48集",
        synopsis: "三上悟在被刺杀死后转生到了异世界成为了一只史莱姆。他利用获得的独特技能大贤者和捕食者，在异世界建立了魔物之国特恩佩斯特，开启了奇妙的冒险。",
        characters: ["利姆露", "大贤者", "红丸", "朱菜", "紫苑"]
    },
    {
        id: 8,
        title: "玉子爱情故事",
        titleEn: "Tamako Love Story",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=anime%20tamako%20market%20mochi%20love%20story%20cute&image_size=square",
        category: "slice",
        tags: ["日常", "恋爱", "治愈"],
        year: "2014",
        episodes: "剧场版",
        synopsis: "北白川玉子是兔山商店街打糕店的女儿，她与青梅竹马大路饼藏以及商店街的人们过着快乐的生活。升入高三后，两人之间的关系开始发生微妙的变化。",
        characters: ["北白川玉子", "大路饼藏", "北白川馅子", "常盘绿", "牧野神奈"]
    }
];

let currentFilter = 'all';

function createCard(anime) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';
    cardContainer.dataset.category = anime.category;
    
    const categoryClass = anime.category;
    
    cardContainer.innerHTML = `
        <div class="card">
            <div class="card-face card-front">
                <div class="card-glow"></div>
                <img src="${anime.image}" alt="${anime.title}" class="card-image">
                <div class="card-overlay"></div>
                <div class="card-info">
                    <h3 class="card-title">${anime.title}</h3>
                    <div class="card-tags">
                        ${anime.tags.map(tag => `<span class="tag ${categoryClass}">${tag}</span>`).join('')}
                    </div>
                    <div class="card-meta">
                        <span>📅 ${anime.year}</span>
                        <span>🎬 ${anime.episodes}</span>
                    </div>
                    <div class="flip-hint">👆 点击翻转查看详情</div>
                </div>
            </div>
            <div class="card-face card-back">
                <h3 class="back-title">${anime.title}</h3>
                <div class="back-section">
                    <h4>📖 剧情简介</h4>
                    <p>${anime.synopsis}</p>
                </div>
                <div class="back-section">
                    <h4>👥 主要角色</h4>
                    <div class="characters-list">
                        ${anime.characters.map(char => `<span class="character">${char}</span>`).join('')}
                    </div>
                </div>
                <div class="back-section">
                    <h4>🏷️ 标签分类</h4>
                    <div class="back-tags">
                        ${anime.tags.map(tag => `<span class="back-tag">#${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const card = cardContainer.querySelector('.card');
    const cardGlow = cardContainer.querySelector('.card-glow');
    
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
    
    cardContainer.addEventListener('mousemove', (e) => {
        const rect = cardContainer.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        cardGlow.style.setProperty('--mouse-x', `${x}%`);
        cardGlow.style.setProperty('--mouse-y', `${y}%`);
    });
    
    return cardContainer;
}

function renderCards() {
    const cardsGrid = document.getElementById('cardsGrid');
    cardsGrid.innerHTML = '';
    
    const filteredData = currentFilter === 'all' 
        ? animeData 
        : animeData.filter(anime => anime.category === currentFilter);
    
    filteredData.forEach(anime => {
        const card = createCard(anime);
        cardsGrid.appendChild(card);
    });
}

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            renderCards();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCards();
    setupFilters();
});
